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
      bikeCard.from = Math.ceil(bikeCard.bike.price_from);
      bikeCard.isPhoneScreen = $mdMedia('xs');
      bikeCard.bike.image_file = imageUrl();

      function imageUrl() {
        if (_.isEmpty(bikeCard.bike.image_file_1)) {
          return bikeCard.bike.image_file
        } else {
          return bikeCard.bike.image_file_1.image_file_1.small.url
        }
      }
    }
  ]
});
