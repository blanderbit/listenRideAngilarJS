'use strict';

angular.module('header').component('header', {
  templateUrl: 'header/header.template.html',
  controllerAs: 'header',
  controller: [ '$mdDialog',
    function HeaderController($mdDialog) {
      var header = this;
  
      header.showLogin = function(evt) {
        $mdDialog.show({
          controller: LoginDialogController,
          templateUrl: 'header/loginDialog.template.html',
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
  
      var LoginDialogController = function($mdDialog) {
        var loginDialog = this;
        loginDialog.hide = function() {
          $mdDialog.hide();
        };
    
        loginDialog.cancel = function() {
          $mdDialog.cancel();
        };
    
        loginDialog.answer = function(answer) {
          $mdDialog.hide(answer);
        };
      }
    }
  ]
});