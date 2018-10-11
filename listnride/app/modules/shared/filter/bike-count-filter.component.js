'use strict';

angular.module('bikeCountFilter', [])
  .component('bikeCountFilter', {
    templateUrl: 'app/modules/shared/filter/bike-count-filter.template.html',
    controllerAs: 'bikeCountFilter',
    bindings: {
      currentValues: '=',
      onFilterChange: '<?'
    },
    controller: [
      '$translate',
      'bikeOptions',
      function BikeCountFilterController($translate, bikeOptions) {
        var bikeCountFilter = this;

        bikeCountFilter.$onInit = function () {
          // methods
          bikeCountFilter.increaseBikesCount = increaseBikesCount;
          bikeCountFilter.decreaseBikesCount = decreaseBikesCount;
          bikeCountFilter.setDefault = setDefault;

          // values
          bikeCountFilter.currentValues = bikeCountFilter.currentValues || [];
          bikeCountFilter.sizes = bikeOptions.sizeOptions('search');

          // invocations
          if (!bikeCountFilter.currentValues.length) bikeCountFilter.setDefault();

        };

        function setDefault() {
          bikeCountFilter.currentValues = [-1]
        }

        function increaseBikesCount() {
          bikeCountFilter.currentValues.push(-1);
          if (typeof bikeCountFilter.onFilterChange === "function") bikeCountFilter.onFilterChange();
        }

        function decreaseBikesCount() {
          if (bikeCountFilter.currentValues.length <= 1) return;
          bikeCountFilter.currentValues.pop();
          if (typeof bikeCountFilter.onFilterChange === "function") bikeCountFilter.onFilterChange();
        }

      }
    ]
  });
