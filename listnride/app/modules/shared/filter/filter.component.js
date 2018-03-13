'use strict';

angular.module('filter',[]).component('filter', {
  templateUrl: 'app/modules/shared/filter/filter.template.html',
  controllerAs: 'filter',
  bindings: {
    updateState: '<',
    initialValues: '<',
    initialBikes: '<',
    bikes: '='
  },
  controller: [
    '$translate',
    '$state',
    'bikeOptions',
    'filterFilter',
    function FilterController($translate, $state, bikeOptions, filterFilter) {
      var filter = this;

      filter.brands = ["All Brands"];
      filter.currentSize = filter.initialValues.size;
      filter.currentBrand = filter.brands[0];
      initializeSizeFilter();

      // Wait for bikes to be actually provided
      filter.$onChanges = function (changes) {
        if (filter.initialBikes != undefined) {
          console.log("gets called");
          filter.bikes = filter.initialBikes;
          initializeBrandFilter();
          applyFilters();
        }
      };

      filter.onBrandChange = function() {
        filter.updateState({ brand: filter.currentBrand });
        applyFilters();
      };

      filter.onSizeChange = function() {
        filter.updateState({ size: filter.currentSize });
        applyFilters();
      }

      filter.clearFilters = function() {
        filter.currentSize = filter.sizes[0];
        filter.currentBrand = filter.brands[0];
        applyFilters();
      }

      function initializeBrandFilter () {
        // Populate brand filter with all available brands
        for (var i=0; i<filter.initialBikes.length; i++) {
          var currentBrand = filter.initialBikes[i].brand;
          if (!filter.brands.includes(currentBrand)) {
            filter.brands.push(currentBrand);
          }
        }
        // If filtered brand doesn't exist, switch to default
        if (filter.brands.includes(filter.initialValues.brand)) {
          filter.currentBrand = filter.initialValues.brand;
        }
      }

      function initializeSizeFilter () {
        filter.sizes = bikeOptions.sizeOptionsForSearch();
        $translate('search.all-sizes').then(function (translation) {
          filter.sizes[0] = translation;
        });
      }

      function applyFilters () {
        var filteredBikes = filter.initialBikes;
        if (filter.currentBrand != filter.brands[0]) {
          filteredBikes = filterFilter(filteredBikes, filter.currentBrand);
        }
        if (filter.currentSize != filter.sizes[0]) {
          filteredBikes = filterFilter(filteredBikes, filter.currentSize);
        }
        filter.bikes = filteredBikes;
      }
    }
  ]
});
