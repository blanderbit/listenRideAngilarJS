'use strict';

angular.module('bikeCountFilter', [])
  .component('bikeCountFilter', {
    templateUrl: 'app/modules/shared/filter/bike-count-filter.template.html',
    controllerAs: 'bikeCountFilter',
    bindings: {
      onFilterChange: '<'
    },
    controller: [
      '$translate',
      '$state',
      'bikeOptions',
      'filterFilter',
      function BikeCountFilterController($translate, $state, bikeOptions, filterFilter) {
        var bikeCountFilter = this;

        bikeCountFilter.$onInit = function () {

        };

      }
    ]
  });
