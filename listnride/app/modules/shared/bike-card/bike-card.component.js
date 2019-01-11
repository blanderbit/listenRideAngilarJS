'use strict';

angular.module('bikeCard',[]).component('bikeCard', {
  templateUrl: 'app/modules/shared/bike-card/bike-card.template.html',
  controllerAs: 'bikeCard',
  bindings: {
    bike: '<',
    booked: '<',
    home: '<',
    seo: '<',
    showLabels: '<'
  },
  controller: ['$mdMedia', 'helpers',
    function BikeCardController($mdMedia, helpers) {
      var bikeCard = this;
      bikeCard.showIcon = !bikeCard.seo && bikeCard.bike.category;
      bikeCard.from = Math.ceil(bikeCard.bike.price_from);
      bikeCard.isPhoneScreen = $mdMedia('xs');

      // TODO: create logic for this and remove dummy data here
      bikeCard.labels = ['variants_available']
    }
  ]
});
