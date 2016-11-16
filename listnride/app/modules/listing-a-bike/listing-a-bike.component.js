'use strict';

angular.module('listingABike',[]).component('listingABike', {
  templateUrl: 'app/modules/listing-a-bike/listing-a-bike.template.html',
  controllerAs: 'listingABike',
  controller: [ 'authentication',
    function HomeController(authentication) {
      var listingABike = this;

      listingABike.authentication = authentication;
    }
  ]
});