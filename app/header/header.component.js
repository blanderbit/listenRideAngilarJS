'use strict';

angular.module('header').component('header', {
  templateUrl: 'header/header.template.html',
  controllerAs: 'header',
  controller: [ '$mdDialog',
    function HeaderController($mdDialog) {
      var header = this;
  
      header.showLoginDialog = function(evt) {
        $mdDialog.show({
          controller: LoginDialogController,
          controllerAs: 'loginDialog',
          templateUrl: 'header/loginDialog.template.html',
          parent: angular.element(document.body),
          targetEvent: evt,
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
      };

      function LoginDialogController($mdDialog) {
        var login = this;
        login.hide = function() {
          $mdDialog.hide();
        }
      }
    }
  ]
});