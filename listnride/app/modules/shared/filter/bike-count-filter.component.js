'use strict';

angular.module('bikeCountFilter', [])
  .component('bikeCountFilter', {
    templateUrl: 'app/modules/shared/filter/bike-count-filter.template.html',
    controllerAs: 'bikeCountFilter',
    bindings: {
      currentValues: '=',
      onFilterChange: '<?',
      hideAllSizes: '<?',
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
          bikeCountFilter.sizes = [];
          bikeCountFilter.defaultValueIndex = (bikeCountFilter.hideAllSizes ? 0 : -1);
          bikeOptions.sizeOptionsValue = (bikeCountFilter.hideAllSizes ? '' : 'search');
          bikeOptions.sizeOptions(bikeOptions.sizeOptionsValue).then(function (resolve) {
            bikeCountFilter.sizes = resolve
          });

          // invocations
          if (!bikeCountFilter.currentValues.length) bikeCountFilter.setDefault();
        };

        function setDefault() {
          bikeCountFilter.currentValues = [bikeCountFilter.defaultValueIndex];
        }

        function increaseBikesCount() {
          bikeCountFilter.currentValues.push(bikeCountFilter.defaultValueIndex);
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
