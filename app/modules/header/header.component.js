'use strict';

angular.module('header').component('header', {
  templateUrl: 'modules/header/header.template.html',
  controllerAs: 'header',
  controller: ['$mdDialog', '$mdToast', '$mdSidenav', '$http', '$timeout', 'authentication', 'sha256', 'api', 'verification',
    function HeaderController($mdDialog, $mdToast, $mdSidenav, $http, $timeout, authentication, sha256, api, verification, timeout) {
      var header = this;
      header.authentication = authentication;

      header.openVerificationDialog = function() {
        verification.openDialog();
      };

      header.toggleSidebar = function() {
        $mdSidenav('right').toggle();
      }

      header.logout = function() {
        header.authentication.logout();
        $mdToast.show(
            $mdToast.simple()
            .textContent('You are logged out.')
            .hideDelay(3000)
            .position('top center')
        );
      }
  
      header.showLoginDialog = function(event) {
        $mdDialog.show({
          controller: LoginDialogController,
          controllerAs: 'loginDialog',
          templateUrl: 'modules/header/loginDialog.template.html',
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

      function LoginDialogController() {
        var loginDialog = this;

        var showLoginSuccess = function() {
          $mdDialog.hide();
          $mdToast.show(
            $mdToast.simple()
            .textContent('Successfully logged in.')
            .hideDelay(3000)
            .position('top center')
          );
        }
        var showLoginError = function() {
          $mdDialog.hide();
          $mdToast.show(
            $mdToast.simple()
            .textContent('Error: Could not log in')
            .hideDelay(3000)
            .position('top center')
          );
        }

        loginDialog.hide = function() {
          $mdDialog.hide();
        }

        loginDialog.login = function() {
          authentication.login(loginDialog.email, sha256.encrypt(loginDialog.password))
          .then(function success() {
            showLoginSuccess();
          }, function error() {
            showLoginError();
          });
        }

        loginDialog.loginFb = function() {
          authentication.loginFb().then(function(success) {
            showLoginSuccess();
          }, function(error) {
            showLoginError();
          });
        }

        loginDialog.resetPassword = function() {
          $http({
            method: 'POST',
            url: 'https://listnride-staging.herokuapp.com/v2/users/reset_password',
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
              'user': {
                "email": loginDialog.email
              }
            }
          }).then(function successCallback(response) {
            $mdToast.show(
              $mdToast.simple()
              .textContent('Please check your emails, we\'ve just sent you a new password.')
              .hideDelay(5000)
              .position('top center')
            );
          }, function errorCallback(response) {
            console.log(response);
          });
        }
      }

      header.showSignupDialog = function(event) {
        $mdDialog.show({
          controller: SignupDialogController,
          controllerAs: 'signupDialog',
          templateUrl: 'modules/header/signupDialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: true // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          //
        }, function() {
          //
        });
      }

      function SignupDialogController($mdDialog) {
        var signupDialog = this;
        signupDialog.hide = function() {
          $mdDialog.hide();
        };
        signupDialog.signup = function() {
          authentication.signup(signupDialog.email, sha256.encrypt(signupDialog.password), signupDialog.firstName, signupDialog.lastName)
          .then(function(success) {
            $mdDialog.hide();
            $timeout(function() {
              verification.openDialog();
            }, 500);
          }, function(error) {
            console.log('could not sign up');
          })
        };
        signupDialog.signupFb = function() {
          authentication.signupFb()
          .then(function(success) {
            $mdDialog.hide();
            $timeout(function() {
              verification.openDialog();
            }, 500);
          }, function(error) {
            console.log('fb could not sign up');
          });
        };
      }
    }
  ]
});