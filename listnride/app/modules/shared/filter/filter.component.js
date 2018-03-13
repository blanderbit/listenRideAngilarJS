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
    function FilterController($translate, $state, bikeOptions) {
      var filter = this;

      filter.brands = ["All Brands"];
      filter.currentSize = filter.initialValues.size;
      filter.currentBrand = filter.brands[0];
      initializeSearchFilter();

      // Wait for bikes to be actually provided
      filter.$onChanges = function (changes) {
        if (filter.initialBikes != undefined) {
          console.log("gets called");
          filter.bikes = filter.initialBikes;
          initializeBrandFilter();
        }
      };

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

      function initializeSearchFilter () {
        filter.sizes = bikeOptions.sizeOptionsForSearch();
        $translate('search.all-sizes').then(function (translation) {
          filter.sizes[0].label = translation;
        });
      }

      filter.onBrandChange = function() {
        
      };

      filter.onSizeChange = function() {
        console.log("gets called");
        filter.updateState({ size: filter.size });
        // filter.bikes = 
        filter.bikes = [filter.initialBikes[0], filter.initialBikes[1]];
        console.log(filter.bikes);
      }
    }
  ]
});
