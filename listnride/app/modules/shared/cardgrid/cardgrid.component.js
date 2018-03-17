'use strict';
angular.module('cardgrid', []).component('cardgrid', {
  templateUrl: 'app/modules/shared/cardgrid/cardgrid.template.html',
  controllerAs: 'cardgrid',
  bindings: {
    title: '@',
    bikes: '<',
    onBikeHover: '<'
  },
  controller: [
      '$translate',
    function ReceiptController($translate) {
      var cardgrid = this;

    }
  ]
});
