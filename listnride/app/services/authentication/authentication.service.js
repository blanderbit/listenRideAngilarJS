'use strict';

angular.
  module('listnride').
  factory('authentication', [
    'Base64', '$localStorage', '$mdDialog', '$rootScope', '$state', '$analytics', 'ezfb', 'api', 'verification', 'sha256', 'notification',
    function(Base64, $localStorage, $mdDialog, $rootScope, $state, $analytics, ezfb, api, verification, sha256, notification){

      // After successful login/loginFb, authorization header gets created and saved in localstorage
      var setCredentials = function (response) {
        $localStorage.userId = response.id;
        $localStorage.name = response.first_name + " " + response.last_name;
        $localStorage.firstName = response.first_name;
        $localStorage.lastName = response.last_name;
        $localStorage.profilePicture = response.profile_picture.profile_picture.url;
        $localStorage.unreadMessages = response.unread_messages;
        $localStorage.email = response.email;
        $localStorage.referenceCode = response.ref_code;
        $localStorage.isBusiness = !!response.business;
      };

      var getAccessToken = function (user, isFacebook) {
        var preparedData = isFacebook ? {
          assertion: facebook_access_token,
          grant_type: 'assertion'
        } : {
          email: user.email,
          password: user.password,
          grant_type: 'password'
        }

        return api.post('/oauth/token', preparedData).then(function (response) {
          return response.data;
        }, function(error){
          notification.show(error, 'error');
        });
      }

      var setAccessToken = function (data) {
        $localStorage.accessToken = data.access_token;
        $localStorage.tokenType = data.token_type;
        $localStorage.expiresIn = data.expiresIn;
        $localStorage.refreshToken = data.refresh_token;
        $localStorage.createdAt = data.created_at;
      }

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
        notification.show(null, null, 'toasts.successfully-sign-up');
      };

      var showSignupError = function() {
        notification.show(null, null, 'toasts.could-not-sign-up');
      };

      var showLoginSuccess = function() {
        $mdDialog.hide();
        notification.show(null, null, 'toasts.successfully-logged-in');
      };

      var showLoginError = function() {
        notification.show(null, null, 'toasts.could-not-log-in');
      };

      var showProfile = function() {
        $state.go("user", {userId: $localStorage.userId});
      };

      // LOGIN

      var loginGlobal = function (form) {
        var obj = {
          email: form.email.$modelValue,
          password: form.password.$modelValue,
          grant_type: 'password',
          target: 'login'
        };
        $analytics.eventTrack('click', { category: 'Request Bike', label: 'Sign In' });
        LoginDialogController(null, sha256, null, obj);
      };

      // SIGN_UP

      var signupGlobal = function (user) {
        var obj = {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.password,
          isShop: user.isShop || false
        };

        $analytics.eventTrack('click', { category: 'Request Bike', label: 'Register' });

        // manually set all variables to null
        // $mdDialog, inviteCode, requesting, business
        // TODO: Create service for sign up
        SignupDialogController(null, null, null, false, obj);
      };

      // CONTROLLERS

      var LoginDialogController = function($mdDialog, sha256, ezfb, loginObj) {
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
              notification.show(success, null, 'toasts.reset-password-success');
            }, function(error) {
              loginDialog.error = error.data.errors[0]
            });
          } else {
            notification.show(success, null, 'toasts.enter-email');
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
              'password': signupDialog.password,
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
            getAccessToken(user.user).then(function(successTokenData){
              setAccessToken(successTokenData)
            });

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

      /////////////////

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

      var forgetGlobal = function (email) {
        var obj = {
          email: email,
          target: 'reset'
        };

        LoginDialogController(null, sha256, null, obj);
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
        return !!$localStorage.accessToken;
      };

      // Logs out the user by deleting the auth header from localStorage
      var logout = function() {

        api.post('/oauth/revoke', {'token': $localStorage.accessToken}).then(function(){
          // reset all localStorage except isAgreeCookiesInfo if user set it to true
          var isAgreeCookiesInfo = $localStorage.isAgreeCookiesInfo;
          $localStorage.$reset();
          if (isAgreeCookiesInfo) $localStorage.isAgreeCookiesInfo = true;

          $state.go('home');
          notification.show(null, null, 'toasts.successfully-logged-out');
        });
      };

      // Further all functions to be exposed in the service
      return {
        showSignupDialog: showSignupDialog,
        showLoginDialog: showLoginDialog,
        loggedIn: loggedIn,
        logout: logout,
        setCredentials: setCredentials,
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
