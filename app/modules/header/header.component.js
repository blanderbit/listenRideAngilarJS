'use strict';

angular.module('header').component('header', {
  templateUrl: 'modules/header/header.template.html',
  controllerAs: 'header',
  controller: ['$mdDialog', '$mdSidenav', '$http', 'authentication', 'sha256',
    function HeaderController($mdDialog, $mdSidenav, $http, authentication, sha256) {
      var header = this;

      header.toggleSidebar = function() {
        $mdSidenav('right').toggle();
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

      function LoginDialogController($mdDialog) {
        var loginDialog = this;
        loginDialog.hide = function() {
          $mdDialog.hide();
        }

        loginDialog.login = function() {
          $http({
            method: 'POST',
            url: 'https://listnride-staging.herokuapp.com/v2/users/login',
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
              'user': {
                "email": loginDialog.email,
                "password_hashed": sha256.encrypt(loginDialog.password)
              }
            }
          }).then(function successCallback(response) {
            console.log(response);
            $mdDialog.hide();
          }, function errorCallback(response) {
            console.log(response);
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
            console.log(response);
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
        var signup = this;
        signup.hide = function() {
          $mdDialog.hide();
        }
      }
    }
  ]
});