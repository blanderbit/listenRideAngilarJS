'use strict';

angular.
  module('listnride').
  factory('authentication', [
    'Base64', '$localStorage', '$mdDialog', '$rootScope', '$mdToast', '$state', '$translate', '$analytics', 'ezfb', 'api', 'verification', 'sha256', 'notification',
    function(Base64, $localStorage, $mdDialog, $rootScope, $mdToast, $state, $translate, $analytics, ezfb, api, verification, sha256, notification){

      var encodeAuth = function (email, password_hashed) {
        return Base64.encode(email + ":" + password_hashed);
      }

      // After successful login/loginFb, authorization header gets created and saved in localstorage
      var setCredentials = function (response) {
        var encoded = encodeAuth(response.email, response.password_hashed);
        // Sets the Basic Auth String for the Authorization Header
        $localStorage.auth = 'Basic ' + encoded;
        $localStorage.userId = response.id;
        $localStorage.name = response.first_name + " " + response.last_name;
        $localStorage.firstName = response.first_name;
        $localStorage.lastName = response.last_name;
        $localStorage.profilePicture = response.profile_picture.profile_picture.url;
        $localStorage.unreadMessages = response.unread_messages;
        $localStorage.email = response.email;
        $localStorage.referenceCode = response.ref_code;
        $localStorage.isBusiness = (response.business !== undefined);
      };

      var retrieveLocale = function() {
        // Set default language to english
        var language = "en";
        // Define all available languages
        var availableLanguages = ["de", "en", "nl", "it", "es"];
        var url = window.location.host.split('.');
        // Language based on tld
        var urlLanguage = url[url.length-1];

        // If we're outside localhost, use tld-language (if part of available languages)
        if (url.indexOf("localhost:8080") < 0 && availableLanguages.indexOf(urlLanguage) >= 0) {
          language = urlLanguage;
        }

        return language;
      };

      // methods for signup controller
      // defined outside so that can be used out of sign up controller
      // used in request booking flow

      var showSignupSuccess = function() {
        $mdToast.show(
          $mdToast.simple()
            .textContent($translate.instant('toasts.successfully-sign-up'))
            .hideDelay(3000)
            .position('top center')
        );
      };

      var showSignupError = function() {
        $mdToast.show(
          $mdToast.simple()
          .textContent($translate.instant('toasts.could-not-sign-up'))
          .hideDelay(4000)
          .position('top center')
        );
      };

      var showLoginSuccess = function() {
        $mdDialog.hide();
        $mdToast.show(
          $mdToast.simple()
            .textContent($translate.instant('toasts.successfully-logged-in'))
            .hideDelay(3000)
            .position('top center')
        );
      };

      var showLoginError = function() {
        $mdToast.show(
          $mdToast.simple()
            .textContent($translate.instant('toasts.could-not-log-in'))
            .hideDelay(3000)
            .position('top center')
        );
      };

      var showProfile = function() {
        $state.go("user", {userId: $localStorage.userId});
      };

      var signupFb = function(email, fbId, fbAccessToken, profilePicture, firstName, lastName, inviteCode, requestFlow) {
        var invited = !!inviteCode;
        var user = {
          "user": {
            "email": email,
            "facebook_id": fbId,
            "facebook_access_token": fbAccessToken,
            "profile_picture_url": profilePicture,
            "first_name": firstName,
            "last_name": lastName,
            "ref_code": inviteCode,
            "language": retrieveLocale()
          }
        };

        api.post("/users", user).then(function(success) {
          setCredentials(success.data);
          if (requestFlow) {
            $rootScope.$broadcast('user_created');
            $analytics.eventTrack('click', {  category: 'Sign Up', label: 'Facebook Request Flow'});
          } else {
            verification.openDialog(false, invited, false, showProfile);
            $analytics.eventTrack('click', {  category: 'Sign Up', label: 'Facebook Standard Flow'});
          }
        }, function(error) {
          showSignupError();
        });
      };

      var loginFb = function(email, facebookId) {
        var user = {
          'user': {
            'email': email,
            'facebook_id': facebookId
          }
        };
        api.post('/users/login', user).then(function(response) {
          setCredentials(response.data);
          $rootScope.$broadcast('user_login');
          showLoginSuccess();
        }, function(error) {
        });
      };

      var connectFb = function(inviteCode, requestFlow) {
        ezfb.getLoginStatus(function(response) {
          if (response.status === 'connected') {
            if (requestFlow) {
              $analytics.eventTrack('click', {category: 'Login', label: 'Facebook Request Flow'});
            } else {
              $analytics.eventTrack('click', {category: 'Login', label: 'Facebook Standard Flow'});
            }
            var accessToken = response.authResponse.accessToken;
            ezfb.api('/me?fields=id,email,first_name,last_name,picture.width(600).height(600)', function(response) {
              loginFb(response.email, response.id);
            });
          } else {
            ezfb.login(function(response) {
              if (requestFlow) {
                $analytics.eventTrack('click', {category: 'Signup', label: 'Facebook Request Flow'});
              } else {
                $analytics.eventTrack('click', {category: 'Signup', label: 'Facebook Standard Flow'});
              }
              $analytics.eventTrack('click', {category: 'Request Bike', label: 'Register Facebook'});
              var accessToken = response.authResponse.accessToken;
              ezfb.api('/me?fields=id,email,first_name,last_name,picture.width(600).height(600)', function(response) {
                signupFb(response.email, response.id, accessToken, response.picture.data.url, response.first_name, response.last_name, false, requestFlow);
              });
            }, {scope: 'email'});
          }
        });
      };

      var signupGlobal = function (user) {
        // TODO: REPLACE THIS MONKEY PATCH WITH PROPER BACKEND-SIDE TEMPORARY PASSWORDS
        if (!user.password) {
          user.password = "sdf138FH";
        }
        var obj = {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.password,
          isShop: user.isShop || false
        };

        $analytics.eventTrack('click', {category: 'Request Bike', label: 'Register'});

        // manually set all variables to null
        // $mdDialog, inviteCode, requesting, business
        // TODO: Create service for sign up
        SignupDialogController(null, null, null, false, obj);
      };

      // The Signup Dialog Controller
      var SignupDialogController = function ($mdDialog, inviteCode, requesting, business, signupObj) {
        var signupDialog = signupObj || this;
        signupDialog.signingUp = false;
        signupDialog.requestSignup = false;
        signupDialog.business = business;
        signupDialog.businessError = false;
        signupDialog.requesting = requesting;
        signupDialog.newsletter = false;
        var invited = !!inviteCode;

        signupDialog.hide = function() {
          $mdDialog.hide();
        };

        signupDialog.showLogin = function() {
          $mdDialog.hide();
          showLoginDialog();
        };

        signupDialog.signup = function() {
          if (signupDialog.businessError && signupDialog.business) {
            signupDialog.createBusiness();
          } else {
            signupDialog.createUser();
          }
        };

        signupDialog.createUser = function() {
          var user = {
            'user': {
              'email': signupDialog.email,
              'password_hashed': sha256.encrypt(signupDialog.password),
              'first_name': signupDialog.firstName,
              'last_name': signupDialog.lastName,
              'ref_code': inviteCode,
              'language': retrieveLocale()
            },
            'notification_preference' : {
              'newsletter': signupDialog.newsletter
            },
            'is_shop': signupDialog.isShop || false
          };

          signupDialog.signingUp = true;

          api.post('/users', user).then(function(success) {
            setCredentials(success.data);
            //TODO: refactor this logic
            if (signupDialog.requestSignup) {
              $rootScope.$broadcast('user_created');
              $analytics.eventTrack('click', {category: 'Signup', label: 'Email Request Flow'});
            } else {
              $analytics.eventTrack('click', {category: 'Signup', label: 'Email Standard Flow'});
              if (signupDialog.business) {
                signupDialog.createBusiness();
              } else {
                if (!signupDialog.requesting) {
                  $state.go('home');
                }
                signupDialog.hide();
                // verification.openDialog(false, invited);
              }
            }
          }, function(error) {
            showSignupError();
            signupDialog.signingUp = false;
          });
        };

        signupDialog.createBusiness = function() {
          var business = {
            'business': {
              'company_name': signupDialog.companyName
            }
          };

          api.post('/businesses', business).then(function(success) {
            $state.go('home');
            verification.openDialog(false, invited, false, signupDialog.showProfile);
          }, function(error) {
            signupDialog.businessError = true;
            signupDialog.signingUp = false;
            showSignupError();
          });
        };

        signupDialog.connectFb = connectFb;
        signupDialog.showProfile = showProfile;

        if (signupObj) {
          signupDialog.requestSignup = true;
          signupDialog.createUser()
        }
      };

      var loginGlobal = function (form) {
        var obj = {
          email: form.email.$modelValue,
          password: form.password.$modelValue,
          target: 'login'
        };
        $analytics.eventTrack('click', {category: 'Request Bike', label: 'Sign In'});
        LoginDialogController(null, null, sha256, null, obj);
      };

      var forgetGlobal = function (email) {
        var obj = {
          email: email,
          target: 'reset'
        };

        LoginDialogController(null, null, sha256, null, obj);
      };

      // The Login Dialog Controller
      var LoginDialogController = function($mdDialog, $mdToast, sha256, ezfb, loginObj) {
        var loginDialog = loginObj || this;

        loginDialog.requestLogin = true;

        var loginFb = function(email, facebookId) {
          var user = {
            'user': {
              'email': email,
              'facebook_id': facebookId
            }
          };
          api.post('/users/login', user).then(function(response) {
            setCredentials(response.data);
            showLoginSuccess();
            if (!response.data.has_address || !response.data.confirmed_phone || response.data.status === 0) {
              verification.openDialog(false);
            }
          }, function(error) {
            showLoginError();
          });
        };

        loginDialog.hide = function() {
          $mdDialog.hide();
        };

        loginDialog.login = function() {
          var user = {
            'user': {
              'email': loginDialog.email,
              'password_hashed': sha256.encrypt(loginDialog.password)
            }
          };
          api.post('/users/login', user).then(function(success) {
            setCredentials(success.data);
            showLoginSuccess();
            if (loginDialog.requestLogin) {
              $analytics.eventTrack('click', {category: 'Login', label: 'Email Request Flow'});
              $rootScope.$broadcast('user_login');
            } else {
              $analytics.eventTrack('click', {category: 'Signup', label: 'Email Standard Flow'});
              if (!success.data.has_address || !success.data.confirmed_phone || success.data.status === 0) {
                verification.openDialog(false);
              }
            }
          }, function(error) {
            showLoginError();
          });
        };

        loginDialog.connectFb = function() {
          ezfb.getLoginStatus(function(response) {
            if (response.status === 'connected') {
              ezfb.api('/me?fields=id,email,first_name,last_name,picture.width(600).height(600)', function(response) {
                loginFb(response.email, response.id);
              });
            } else {
              ezfb.login(function(response) {
                ezfb.api('/me?fields=id,email,first_name,last_name,picture.width(600).height(600)', function(response) {
                  loginFb(response.email, response.id);
                });
              }, {scope: 'email'});
            }
          });
        };

        loginDialog.resetPassword = function() {
          if (loginDialog.email) {
            var user = {
              "user": {
                "email": loginDialog.email
              }
            };
            api.post('/users/reset_password', user).then(function(success) {
              $mdToast.show(
                $mdToast.simple()
                  .textContent($translate.instant('toasts.reset-password-success'))
                  .hideDelay(5000)
                  .position('top center')
              );
            }, function(error) {
              loginDialog.error = error.data.errors[0]
            });
          } else {
            $mdToast.show(
              $mdToast.simple()
                .textContent($translate.instant('toasts.enter-email'))
                .hideDelay(5000)
                .position('top center')
            );
          }
        };

        if (loginObj) {
          if (loginDialog.target === 'login') {
            loginDialog.requestLogin = true;
            loginDialog.login ()
          } else if (loginDialog.target === 'reset') {
            loginDialog.resetPassword()
          }
        }
      };

      var showSignupDialog = function(inviteCode, requesting, event, business) {
        $mdDialog.show({
          controller: SignupDialogController,
          controllerAs: 'signupDialog',
          templateUrl: 'app/services/authentication/signupDialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: true, // Only for -xs, -sm breakpoints.
          locals : {
            inviteCode : inviteCode,
            requesting: requesting,
            business: business,
            signupObj: null
          }
        })
        .then(function(answer) {
          //
        }, function() {
          //
        });
      };

      var showLoginDialog = function(event) {
        $mdDialog.show({
          controller: LoginDialogController,
          controllerAs: 'loginDialog',
          templateUrl: 'app/services/authentication/loginDialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: true, // Changed in CSS to only be for XS sizes
          locals : {
            loginObj: null
          }
        })
        .then(function(answer) {
          //
        }, function() {
          //
        });
      };

      var loggedIn = function() {
        return !!$localStorage.auth;
      };

      // Logs out the user by deleting the auth header from localStorage
      var logout = function() {
        document.execCommand("ClearAuthenticationCache");
        delete $localStorage.auth;
        delete $localStorage.userId;
        delete $localStorage.profilePicture;
        delete $localStorage.name;
        $state.go('home');
        $mdToast.show(
          $mdToast.simple()
          .textContent($translate.instant('toasts.successfully-logged-out'))
          .hideDelay(3000)
          .position('top center')
        );
      };

      var tokenLogin = function(token, email) {
        var user = {
          "user": {
            "shop_token": token,
            "email": email
          }
        };
        return api.post('/users/login', user);
      };

      // Further all functions to be exposed in the service
      return {
        showSignupDialog: showSignupDialog,
        showLoginDialog: showLoginDialog,
        loggedIn: loggedIn,
        logout: logout,
        tokenLogin: tokenLogin,
        setCredentials: setCredentials,
        encodeAuth: encodeAuth,
        profilePicture: function() {
          return $localStorage.profilePicture
        },
        name: function() {
          return $localStorage.name
        },
        userId: function() {
          return $localStorage.userId
        },
        unreadMessages: function() {
          return $localStorage.unreadMessages
        },
        connectFb: connectFb,
        signupGlobal: signupGlobal,
        loginGlobal: loginGlobal,
        forgetGlobal: forgetGlobal
      };
    }
  ]);
