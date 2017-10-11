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
      bikeCard.from = parseInt(bikeCard.bike.price_from);
      bikeCard.isPhoneScreen = $mdMedia('xs');
    }
  ]
});
