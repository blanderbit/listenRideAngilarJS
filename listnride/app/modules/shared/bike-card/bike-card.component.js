'use strict';

angular.module('bikeCard',[]).component('bikeCard', {
  templateUrl: 'app/modules/shared/bike-card/bike-card.template.html',
  controllerAs: 'bikeCard',
  bindings: {
    bike: '<',
    booked: '<',
    home: '<',
    seo: '<'
  },
  controller: ['$mdMedia',
    function BikeCardController($mdMedia) {
      var bikeCard = this;
      bikeCard.showIcon = !bikeCard.seo && bikeCard.bike.category;
      console.log(bikeCard.seo);
      var hal_daily = parseInt(bikeCard.bike.price_weekly);
      var price_weekly = parseInt(bikeCard.bike.price_half_daily);
      bikeCard.from = Math.min(hal_daily, price_weekly);
      bikeCard.isPhoneScreen = $mdMedia('xs');
    }
  ]
});
