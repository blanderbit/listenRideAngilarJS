'use strict';
angular.module('cardgrid', []).component('cardgrid', {
  templateUrl: 'app/modules/shared/cardgrid/cardgrid.template.html',
  controllerAs: 'cardgrid',
  bindings: {
    // used in bikes grid
    title: '@',
    bikes: '<',
    onBikeHover: '<',

    // passed to bike sorter component
    cardIndex: '<',
    uncategorizedBikes: '<',
    location: '<',
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
