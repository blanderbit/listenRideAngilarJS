'use strict';

angular.module('bikeCard').component('bikeCard', {
  templateUrl: 'modules/_shared/bike-card/bike-card.template.html',
  controllerAs: 'bikeCard',
  bindings: {
    name: '<',
    brand: '<',
    price: '<',
    url: '<'
  },
  controller: [
    function BikeCardController() {
      var bikeCard = this;
      bikeCard.price
    }
  ]
});