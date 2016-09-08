'use strict';

angular.module('header').component('header', {
  templateUrl: 'header/header.template.html',
  controllerAs: 'header',
  controller: [ '$mdDialog',
    function HeaderController($mdDialog) {
      var header = this;
  
      header.showLogin = function(evt) {
        $mdDialog.show({
          controller: LoginController,
          controllerAs: 'login',
          templateUrl: 'header/login.template.html',
          parent: angular.element(document.body),
          targetEvent: evt,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: header.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          //
        }, function() {
          //
        });
      };

      function LoginController($mdDialog) {
        var login = this;
        login.hide = function() {
          $mdDialog.hide();
        }
      }
    }
  ]
});