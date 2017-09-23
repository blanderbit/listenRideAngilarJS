'use strict';

angular.module('confirmation', []).component('confirmation', {

  bindings: {
    buttonClass: '<',
    buttonDisable: '<',
    buttonText: '<',
    confirmText: '<',
    onSuccess: '&',
    onFailure: '&'
  },

  template:
  '<md-button ' +
  '   class="{{confirmation.buttonClass}}" ' +
  '   ng-disabled="{{confirmation.buttonDisable}}" disabled="{{confirmation.buttonDisable}}"' +
  '   ng-click="confirmation.openDialog($event)">' +
  '   {{ confirmation.buttonText | translate }}' +
  '</md-button>',

  controllerAs: 'confirmation',

  controller: [
    '$mdDialog',
    function ConfirmationController($mdDialog) {
      var confirmation = this;

      confirmation.confirm = $mdDialog.hide;
      confirmation.cancel = $mdDialog.cancel;

      confirmation.openDialog = function (ev) {
        $mdDialog.show({
          templateUrl: 'app/modules/shared/confirmation/confirmation.template.html',
          controller: ['$scope', function ($scope) {
            $scope.confirmation = confirmation;
          }],
          parent: angular.element(document.body),
          targetEvent: ev
        })
        .then(function () {
          confirmation.buttonDisable = true;
          confirmation.onSuccess();
        });
      }
    }]
});

