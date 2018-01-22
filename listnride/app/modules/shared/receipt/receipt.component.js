'use strict';
angular.module('receipt', []).component('receipt', {
  templateUrl: 'app/modules/shared/receipt/receipt.template.html',
  controllerAs: 'receipt',
  bindings: {
    startDate: '<',
    endDate: '<',
    invalidDays: '<',
    prices: '<'
  },
  controller: [
      'date',
      'price',
      'ENV',
    function ReceiptController(date, price, api, authentication, verification, ENV) {
      var receipt = this;

      var prices = price.calculatePrices(receipt.startDate, receipt.endDate, receipt.prices);

      receipt.duration = date.duration(receipt.startDate, receipt.endDate, receipt.invalidDays);
      receipt.durationDays = date.durationDays(receipt.startDate, receipt.endDate);
      receipt.subtotal = prices.subtotal;
      receipt.subtotalDiscounted = prices.subtotalDiscounted
      receipt.lnrFee = prices.serviceFee;
      receipt.total = prices.total;
    }
  ]
});
