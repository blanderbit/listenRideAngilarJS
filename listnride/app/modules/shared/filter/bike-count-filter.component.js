'use strict';

angular.module('bikeCountFilter', [])
  .component('bikeCountFilter', {
    templateUrl: 'app/modules/shared/filter/bike-count-filter.template.html',
    controllerAs: 'bikeCountFilter',
    bindings: {
      currentValues: '=',
      onFilterChange: '<?',
      showAllSizesLabel: '<?',//to show allSizes value set true value
      showUnisize:'<?', //to hide Unisize value set it to null
      showKidsSizes: '<?'//to hide kidsSizes set it null
    },
    controller: [
      '$translate',
      'bikeOptions',
      function BikeCountFilterController($translate, bikeOptions) {
        var bikeCountFilter = this;
        var ALL_SIZES_VALUE = -1;
        var DEFAULT_VALUE = 0;

        bikeCountFilter.$onInit = function () {
          // methods
          bikeCountFilter.increaseBikesCount = increaseBikesCount;
          bikeCountFilter.decreaseBikesCount = decreaseBikesCount;

          // values
          bikeCountFilter.currentValues = bikeCountFilter.currentValues || [];
          bikeCountFilter.sizes = [];

          bikeOptions.sizeOptions(bikeCountFilter.showAllSizesLabel, bikeCountFilter.showKidsSizes, bikeCountFilter.showUnisize).then(function (resolve) {
            bikeCountFilter.sizes = resolve;
          });

          // invocations
          if (!bikeCountFilter.currentValues.length) setDefault();
        };

        function setDefault() {
          var defaultValueOnInit = bikeCountFilter.hideAllSizesLabel ? DEFAULT_VALUE : ALL_SIZES_VALUE;
          bikeCountFilter.currentValues = [defaultValueOnInit];
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
