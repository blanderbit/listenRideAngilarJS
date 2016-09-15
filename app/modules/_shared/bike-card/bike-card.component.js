'use strict';

angular.module('bikeCard').component('bikeCard', {
  templateUrl: 'modules/_shared/bike-card/bike-card.template.html',
  controllerAs: 'bikeCard',
  bindings: {
    name: '<',
    price: '<',
    imgUrl: '<'
  },
  controller: [
    function FooterController() {
      var bikeCard = this;
  
    }
  ]
});