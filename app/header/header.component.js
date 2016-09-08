'use strict';

angular.module('header').component('header', {
  templateUrl: 'header/header.template.html',
  controllerAs: 'header',
  controller: [ '$mdDialog',
    function HeaderController($mdDialog) {
      var header = this;
  
      header.showLogin = function(evt) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'header/loginDialog.template.html',
          parent: angular.element(document.body),
          targetEvent: evt,
          clickOutsideToClose: true,
          fullscreen: header.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          header.status = 'You said the information was "' + answer + '".';
        }, function() {
          header.status = 'You cancelled the dialog.';
        });
      };
  
      function DialogController($mdDialog) {
        header.hide = function() {
          $mdDialog.hide();
        };
    
        header.cancel = function() {
          $mdDialog.cancel();
        };
    
        header.answer = function(answer) {
          $mdDialog.hide(answer);
        };
      }
    }
  ]
});