'use strict';
angular.module('cardgrid', []).component('cardgrid', {
  templateUrl: 'app/modules/shared/cardgrid/cardgrid.template.html',
  controllerAs: 'cardgrid',
  bindings: {
    title: '@',
    bikes: '<',
    cardIndex: '<',
    uncategorizedBikes: '<',
    location: '<',
    onBikeHover: '<',
    categorizedBikes: '=',
    titles: '=',
  },
  controller: [
      '$translate',
    function ReceiptController($translate) {
      var cardgrid = this;
    }
  ]
});
