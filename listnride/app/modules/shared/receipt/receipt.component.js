'use strict';
angular.module('receipt', []).component('receipt', {
  templateUrl: 'app/modules/shared/receipt/receipt.template.html',
  controllerAs: 'receipt',
  bindings: {
    startDate: '<',
    endDate: '<',
    invalidDays: '<',
    prices: '<',
    user: '<',
    withoutCalendar: '<?',
    coverageTotal: '<?',
    isPremiumCoverage: '<?'
  },
  controller: [
      'date',
      'price',
      'ENV',
    function ReceiptController(date, price, api, authentication, verification, ENV) {
      var receipt = this;
      receipt.balance = 0;

      this.$onChanges = function (changes) {
        if (changes.user) {
          if (changes.user.currentValue.balance != undefined) {
            receipt.balance = changes.user.currentValue.balance;
          }
        }
        updatePrices();
      };

      function updatePrices() {
        if (receipt.prices && (receipt.startDate != "Invalid Date" && receipt.endDate != "Invalid Date")) {
          setPrices();
        } else {
          setDefaultPrices();
        }
      }

      function setPrices() {
        var prices = price.calculatePrices(receipt.startDate, receipt.endDate, receipt.prices, receipt.coverageTotal, receipt.isPremiumCoverage);
        receipt.duration = date.duration(receipt.startDate, receipt.endDate, receipt.invalidDays);
        receipt.durationDays = date.durationDays(receipt.startDate, receipt.endDate);
        receipt.discount = prices.subtotal - prices.subtotalDiscounted;
        receipt.discountRelative = receipt.discount / receipt.durationDays;
        receipt.subtotal = prices.subtotal;
        receipt.subtotalDiscounted = prices.subtotalDiscounted;
        receipt.lnrFee = prices.serviceFee;
        receipt.premiumCoverage = prices.premiumCoverage;
        receipt.total = Math.max(prices.total - receipt.balance, 0);
      };

      function setDefaultPrices() {
        receipt.durationDays = "0";
        receipt.subtotalDiscounted = "0";
        receipt.duration = " --- ";
        receipt.subtotal = 0;
        receipt.lnrFee = 0;
        receipt.total = 0;
      }

    }
  ]
});
