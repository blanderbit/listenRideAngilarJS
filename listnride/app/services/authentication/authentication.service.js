'use strict';

angular.
  module('listnride').
  factory('authentication', [
    'Base64', '$http', '$localStorage', '$mdDialog', '$mdToast', '$window', '$state', '$q', '$translate', 'ezfb', 'api', 'verification', 'sha256',
    function(Base64, $http, $localStorage, $mdDialog, $mdToast, $window, $state, $q, $translate, ezfb, api, verification, sha256){

      // After successful login/loginFb, authorization header gets created and saved in localstorage
      var setCredentials = function (email, password, id, profilePicture, firstName, lastName, unreadMessages, referenceCode) {
        var encoded = Base64.encode(email + ":" + password);
        // Sets the Basic Auth String for the Authorization Header 
        $localStorage.auth = 'Basic ' + encoded;
        $localStorage.userId = id;
        $localStorage.name = firstName + " " + lastName;
        $localStorage.firstName = firstName;
        $localStorage.profilePicture = profilePicture;
        $localStorage.unreadMessages = unreadMessages;
        $localStorage.email = email;
        $localStorage.referenceCode = referenceCode;
      };

      // The Signup Dialog Controller
      var SignupDialogController = function($mdDialog, inviteCode) {
        var signupDialog = this;

        console.log(inviteCode);

        signupDialog.signingUp = false;

        var signupFb = function(email, fbId, fbAccessToken, profilePicture, firstName, lastName) {
          var user = {
            "user": {
              "email": email,
              "facebook_id": fbId,
              "facebook_access_token": fbAccessToken,
              "profile_picture_url": profilePicture,
              "first_name": firstName,
              "last_name": lastName,
              "ref_code": inviteCode
            }
          };
          var invited = false;
          if (inviteCode) {
            invited = true;
          }
          api.post("/users", user).then(function(success) {
            setCredentials(success.data.email, success.data.password_hashed, success.data.id, success.data.profile_picture.profile_picture.url, success.data.first_name, success.data.last_name, success.data.unread_messages, success.data.ref_code);            
            verification.openDialog(false, invited);
          }, function(error) {
            showSignupError();
          });
        };

        var showSignupError = function() {
          $mdToast.show(
            $mdToast.simple()
            .textContent($translate.instant('toasts.could-not-sign-up'))
            .hideDelay(4000)
            .position('top center')
          );
        }

        signupDialog.hide = function() {
          $mdDialog.hide();
        };

        signupDialog.signup = function() {
          var user = {
            'user': {
              'email': signupDialog.email,
              'password_hashed': sha256.encrypt(signupDialog.password),
              'first_name': signupDialog.firstName,
              'last_name': signupDialog.lastName,
              'ref_code': inviteCode
            }
          };
          signupDialog.signingUp = true;
          var invited = false;
          if (inviteCode) {
            invited = true;
          }
          api.post('/users', user).then(function(success) {
            setCredentials(success.data.email, success.data.password_hashed, success.data.id, success.data.profile_picture.profile_picture.url, success.data.first_name, success.data.last_name, success.data.unread_messages, success.data.ref_code);
            $state.go('home');
            verification.openDialog(false, invited);
          }, function(error) {
            showSignupError();
            signupDialog.signingUp = false;
          });
        };

        signupDialog.connectFb = function() {
          ezfb.getLoginStatus(function(response) {
            console.log("FB Get Login Status, Response:");
            console.log(response);
            if (response.status === 'connected') {
              var accessToken = response.authResponse.accessToken;
              ezfb.api('/me?fields=id,email,first_name,last_name,picture.width(600).height(600)', function(response) {
                signupFb(response.email, response.id, accessToken, response.picture.data.url, response.first_name, response.last_name);
              });
            } else {
              ezfb.login(function(response) {
                console.log("FB Login, Response:");
                console.log(response);
                var accessToken = response.authResponse.accessToken;
                ezfb.api('/me?fields=id,email,first_name,last_name,picture.width(600).height(600)', function(response) {
                  signupFb(response.email, response.id, accessToken, response.picture.data.url, response.first_name, response.last_name);
                });
              }, {scope: 'email'});
            }
          });
        };

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
        }

        var showLoginError = function() {
          $mdToast.show(
            $mdToast.simple()
            .textContent($translate.instant('toasts.could-not-log-in'))
            .hideDelay(4000)
            .position('top center')
          );
        }

        var loginFb = function(email, facebookId) {
          var user = {
            'user': {
              'email': email,
              'facebook_id': facebookId
            }
          };
          api.post('/users/login', user).then(function(response) {
            setCredentials(response.data.email, response.data.password_hashed, response.data.id, response.data.profile_picture.profile_picture.url, response.data.first_name, response.data.last_name, response.data.unread_messages, response.data.ref_code);
            showLoginSuccess();
            if (!response.data.has_address || !response.data.confirmed_phone || response.data.status == 0) {
              verification.openDialog(false);
            }
            console.log(response.data);
          }, function(response) {
            showLoginError();
          });
        };

        loginDialog.hide = function() {
          $mdDialog.hide();
        }

        loginDialog.login = function() {
          var user = {
            'user': {
              'email': loginDialog.email,
              'password_hashed': sha256.encrypt(loginDialog.password)
            }
          };
          api.post('/users/login', user).then(function(success) {
            setCredentials(success.data.email, success.data.password_hashed, success.data.id, success.data.profile_picture.profile_picture.url, success.data.first_name, success.data.last_name, success.data.unread_messages, success.data.ref_code);
            showLoginSuccess();
            if (!success.data.has_address || !success.data.confirmed_phone || success.data.status == 0) {
              verification.openDialog(false);
            }
          }, function(error) {
            console.log(error);
            showLoginError();
          });
        }

        loginDialog.connectFb = function() {
          ezfb.getLoginStatus(function(response) {
            if (response.status === 'connected') {
              ezfb.api('/me?fields=id,email,first_name,last_name,picture.width(600).height(600)', function(response) {
                console.log(response);
                loginFb(response.email, response.id);
              });
            } else {
              ezfb.login(function(response) {
                ezfb.api('/me?fields=id,email,first_name,last_name,picture.width(600).height(600)', function(response) {
                  console.log(response);
                  loginFb(response.email, response.id);
                });
              }, {scope: 'email'});
            }
          });
        }

        loginDialog.resetPassword = function() {
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
            console.log(response);
          });
        }

      };

      var showSignupDialog = function(inviteCode, event) {;
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
            inviteCode : inviteCode
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
        if ($localStorage.auth) {
          return true;
        } else {
          return false;
        }
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
        console.log(user);
        return api.post('/users/login', user);
      }

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
        }
      };
    }
  ]);
