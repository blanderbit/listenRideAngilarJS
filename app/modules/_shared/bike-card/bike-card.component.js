'use strict';

angular.module('bikeCard').component('bikeCard', {
  templateUrl: 'modules/_shared/bike-card/bike-card.template.html',
  controllerAs: 'bikeCard',
  bindings: {
    bikeId: '<',
    name: '<',
    brand: '<',
    price: '<',
    imageUrl: '<'
  },
  controller: [
    function BikeCardController() {
      var bikeCard = this;
    }
  ]
});