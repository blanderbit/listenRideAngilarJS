'use strict';

angular.module('bikeCard',[]).component('bikeCard', {
  templateUrl: 'app/modules/shared/bike-card/bike-card.template.html',
  controllerAs: 'bikeCard',
  bindings: {
    bike: '<',
    booked: '<'
  },
  controller: ['$mdMedia',
    function BikeCardController($mdMedia) {
      var bikeCard = this;
      var hal_daily = parseInt(bikeCard.bike.price_weekly);
      var price_weekly = parseInt(bikeCard.bike.price_half_daily);
      bikeCard.from = Math.min(hal_daily, price_weekly);
      bikeCard.isPhoneScreen = $mdMedia('xs');
    }
  ]
});
