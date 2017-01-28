'use strict';

angular.module('bikeCard',[]).component('bikeCard', {
  templateUrl: 'app/modules/shared/bike-card/bike-card.template.html',
  controllerAs: 'bikeCard',
  bindings: {
    bike: '<'
  },
  controller: ['$mdMedia',
    function BikeCardController($mdMedia) {
      var bikeCard = this;
      bikeCard.isPhoneScreen = $mdMedia('xs');
    }
  ]
});