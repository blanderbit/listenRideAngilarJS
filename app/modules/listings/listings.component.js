'use strict';

angular.module('listings').component('listings', {
  templateUrl: 'app/modules/listings/listings.template.html',
  controllerAs: 'listings',
  controller: [ '$state', 'api',
    function ListingsController($state, api) {
      var listings = this;

    }
  ]
});