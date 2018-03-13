'use strict';

angular.module('filter',[]).component('filter', {
  templateUrl: 'app/modules/shared/filter/filter.template.html',
  controllerAs: 'filter',
  bindings: {
    bikes: '<',
    filteredBikes: '=',
    updateState: '<',
    initialValues: '<'
  },
  controller: [
    '$translate',
    '$state',
    'bikeOptions',
    function FilterController($translate, $state, bikeOptions) {
      var filter = this;

      filter.brands = ["All Brands"];
      filter.currentSize = filter.initialValues.size;
      filter.currentBrand = filter.initialValues.brand;

      // Wait for bikes to be actually provided
      filter.$onChanges = function (changes) {
        if (filter.bikes != undefined) {
          initializeBrandFilter();
        }
      };

      var initializeBrandFilter = function() {
        // Populate brand filter with all available brands
        for (var i=0; i<filter.bikes.length; i++) {
          var currentBrand = filter.bikes[i].brand;
          if (!filter.brands.includes(currentBrand)) {
            filter.brands.push(currentBrand);
          }
        }
        // If filtered brand doesn't exist, switch to default
        if (!filter.brands.includes(filter.currentBrand)) {
          filter.currentBrand = filter.brands[0];
        }
      }      

      // Size Filter
      filter.sizeOptions = bikeOptions.sizeOptionsForSearch();
      $translate('search.all-sizes').then(function (translation) {
          filter.sizeOptions[0].label = translation;
      });

      filter.onSizeChange = function() {
        filter.updateState({ size: filter.size });
      }
    }
  ]
});
