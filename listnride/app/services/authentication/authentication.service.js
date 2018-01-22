'use strict';

angular.
  module('listnride').
  factory('authentication', [
    'Base64', '$http', '$localStorage', '$mdDialog', '$mdToast', '$window', '$state', '$q', '$translate', '$analytics', 'ezfb', 'api', 'verification', 'sha256',
    function(Base64, $http, $localStorage, $mdDialog, $mdToast, $window, $state, $q, $translate, $analytics, ezfb, api, verification, sha256){

      // After successful login/loginFb, authorization header gets created and saved in localstorage
      var setCredentials = function (response) {
        var encoded = Base64.encode(response.email + ":" + response.password_hashed);
        // Sets the Basic Auth String for the Authorization Header 
        $localStorage.auth = 'Basic ' + encoded;
        $localStorage.userId = response.id;
        $localStorage.name = response.first_name + " " + response.last_name;
        $localStorage.firstName = response.first_name;
        $localStorage.profilePicture = response.profile_picture.profile_picture.url;
        $localStorage.unreadMessages = response.unread_messages;
        $localStorage.email = response.email;
        $localStorage.referenceCode = response.ref_code;
        $localStorage.isBusiness = (response.business !== undefined);
      };

      var retrieveLocale = function() {
        var language = "en"; // Default language
        var availableLanguages = ["de", "en", "nl", "it", "es"];
        var browserLanguage = navigator.language.replace(/-.*$/,""); // Default browser language
        var retrievedLanguage = $localStorage.selectedLanguage; // Saved language
        var url = window.location.host.split('.');
        var urlLanguage = url[url.length-1]; // Domain name language

        if (url.indexOf("localhost:8080") < 0 && availableLanguages.indexOf(urlLanguage) >= 0) {
          browserLanguage = urlLanguage;
        }

        if(!_.isEmpty(browserLanguage) && browserLanguage !== 'en' && retrievedLanguage === 'en' || _.isEmpty(retrievedLanguage) ) {
          language = browserLanguage;
        } else {
          language = retrievedLanguage;
        }

        if (availableLanguages.indexOf(language) >= 0) {
          return language;
        } else {
          return 'en';
        }
      };

      // methods for signup controller
      // defined outside so that can be used out of sign up controller
      // used in request booking flow
       
      var showSignupError = function() {
        $mdToast.show(
          $mdToast.simple()
          .textContent($translate.instant('toasts.could-not-sign-up'))
          .hideDelay(4000)
          .position('top center')
        );
      };

      var showProfile = function() {
        $state.go("user", {userId: $localStorage.userId});
      };

      var signupFb = function(email, fbId, fbAccessToken, profilePicture, firstName, lastName, inviteCode) {
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
          verification.openDialog(false, invited, false, showProfile);
          $analytics.eventTrack('Facebook Sign-Up', {  category: 'Sign Up', label: 'Quick Sign-Up Complete'});
        }, function(error) {
          showSignupError();
        });
      };

      var connectFb = function(inviteCode) {
        ezfb.getLoginStatus(function(response) {
          if (response.status === 'connected') {
            var accessToken = response.authResponse.accessToken;
            ezfb.api('/me?fields=id,email,first_name,last_name,picture.width(600).height(600)', function(response) {
              signupFb(response.email, response.id, accessToken, response.picture.data.url, response.first_name, response.last_name, inviteCode);
            });
          } else {
            ezfb.login(function(response) {
              var accessToken = response.authResponse.accessToken;
              ezfb.api('/me?fields=id,email,first_name,last_name,picture.width(600).height(600)', function(response) {
                signupFb(response.email, response.id, accessToken, response.picture.data.url, response.first_name, response.last_name);
              });
            }, {scope: 'email'});
          }
        });
      };

      // The Signup Dialog Controller
      var SignupDialogController = function($mdDialog, inviteCode, requesting, business) {
        var signupDialog = this;

        signupDialog.signingUp = false;
        signupDialog.business = business;
        signupDialog.businessError = false;
        signupDialog.requesting = requesting;
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
            }
          };

          signupDialog.signingUp = true;

          api.post('/users', user).then(function(success) {
            setCredentials(success.data);
            if (signupDialog.business) {
              signupDialog.createBusiness();
            } else {
              if (!signupDialog.requesting) {
                $state.go('home');
              }
              verification.openDialog(false, invited);
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
            $analytics.eventTrack('Non-FB Sign-Up', {  category: 'Sign Up', label: 'Quick Sign-Up Complete'});
          }, function(error) {
            signupDialog.businessError = true;
            signupDialog.signingUp = false;
            showSignupError();
          });
        };

        signupDialog.connectFb = connectFb;

        signupDialog.showProfile = showProfile;
      };

      // The Login Dialog Controller
      var LoginDialogController = function($mdDialog, $mdToast, sha256, ezfb) {
        var loginDialog = this;

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
            .hideDelay(4000)
            .position('top center')
          );
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
            if (!success.data.has_address || !success.data.confirmed_phone || success.data.status === 0) {
              verification.openDialog(false);
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
            business: business
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
          fullscreen: true // Changed in CSS to only be for XS sizes
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
        connectFb: connectFb
      };
    }
  ]);
