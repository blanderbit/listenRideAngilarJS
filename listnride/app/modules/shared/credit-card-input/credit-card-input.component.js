'use strict';

angular.module('creditCardInput', []).component('creditCardInput', {
  templateUrl: 'app/modules/shared/credit-card-input/credit-card-input.template.html',
  controllerAs: 'creditCardInput',
  bindings: {
    data: '=',
    reset: '<'
  },
  controller: ['$scope',
    function СreditCardInput($scope) {
      var creditCardInput = this;

      creditCardInput.$onInit = function(){
        // VARIABLES
        creditCardInput.oldExpiryDateLength = 0;
        creditCardInput.expiryDateLength = 0;
        creditCardInput.month = 0;
        creditCardInput.year = 0;
        // METHODS
        creditCardInput.creditCardForm = creditCardInput.data;
      };

      creditCardInput.updateExpiryDate = function () {
        creditCardInput.expiryDateLength = creditCardInput.creditCardForm.expiryDate.toString().length;
        creditCardInput.month = creditCardInput.creditCardForm.expiryDate.toString().split("/")[0];
        creditCardInput.year = creditCardInput.creditCardForm.expiryDate.toString().split("/")[1];

        if (creditCardInput.expiryDateLength == 1 &&
            creditCardInput.oldExpiryDateLength != 2 &&
            parseInt(creditCardInput.month) > 1) {
          creditCardInput.creditCardForm.expiryDate = "0" + creditCardInput.creditCardForm.expiryDate + "/";
        }
        if (creditCardInput.expiryDateLength == 2 &&
            creditCardInput.oldExpiryDateLength < 2) {
          creditCardInput.creditCardForm.expiryDate += "/";
        }
        if (creditCardInput.oldExpiryDateLength == 4 &&
          creditCardInput.expiryDateLength == 3) {
          creditCardInput.creditCardForm.expiryDate = creditCardInput.month;
        }
        creditCardInput.oldExpiryDateLength = creditCardInput.expiryDateLength;
      };

      // TODO: remove hardcoded current year and month
      creditCardInput.validateExpiryDate = function () {
        var dateInput = $scope.creditCardForm.expiryDate;
        if (creditCardInput.expiryDateLength != 5) {
          dateInput.$setValidity('dateFormat', false);
        } else {
          if (creditCardInput.year > 18 &&
              creditCardInput.year < 25 &&
              creditCardInput.month >= 1 &&
              creditCardInput.month <= 12) {
            dateInput.$setValidity('dateFormat', true);
          } else if (creditCardInput.year == 18 &&
                     creditCardInput.month >= 2 &&
                     creditCardInput.month <= 12) {
            dateInput.$setValidity('dateFormat', true);
          } else {
            dateInput.$setValidity('dateFormat', false);
          }
        }
      };

    }
  ]
});
