'use strict';

angular.
  module('verification').
  factory('verification', ['$mdDialog', '$mdToast',
    function($mdDialog, $mdToast) {

      var VerificationDialogController = function() {
        var verificationDialog = this;
        verificationDialog.hide = function() {
          $mdDialog.hide();
        };
      };

      var openDialog = function() {
        $mdDialog.show({
          controller: VerificationDialogController,
          controllerAs: 'verificationDialog',
          templateUrl: 'app/modules/shared/verification/verification.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: true
        });
      }

      return {
        openDialog: function() {
          openDialog();
        }
      }
    }
  ]);