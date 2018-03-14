'use strict';

angular.module('filter',[])
  .component('filter', {
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

        // methods
        filter.increaseBikesCount = increaseBikesCount;
        filter.decreaseBikesCount = decreaseBikesCount;

        // variables
        filter.brands = ["All Brands"];
        filter.currentSizes = filter.initialValues.sizes.slice();
        filter.currentBrand = filter.brands[0];
        initializeSizeFilter();

        // Wait for bikes to be actually provided
        filter.$onChanges = function (changes) {
          if (filter.initialBikes != undefined) {
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
          filter.updateState({ sizes: filter.currentSizes.join(',') });
          applyFilters();
        }

        filter.clearFilters = function() {
          // TODO: YB for each clear sizes
          // filter.currentSizes = bikeOptions.sizeOptionsForSearch()[0];

          filter.currentBrand = filter.brands[0];
          applyFilters();
        }

        function initializeBrandFilter () {
          // Populate brand filter with all available brands
          for (var i=0; i<filter.bikes.length; i++) {
            var currentBrand = filter.bikes[i].brand;
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
          if (filter.currentSizes[0] === '') filter.currentSizes[0] = '-1';
          if (!filter.currentSizes.length) filter.increaseBikesCount();
          filter.sizes = bikeOptions.sizeOptionsForSearch();
          $translate('search.all-sizes').then(function (translation) {
            filter.sizes[0].label = translation;
          });
        }
  
        function applyFilters () {
          var filteredBikes = filter.initialBikes;
          filteredBikes = filterBrands(filteredBikes);
          filteredBikes = filterSizes(filteredBikes);
          filter.bikes = filteredBikes;
          initializeBrandFilter();
        }

        function filterBrands (bikes) {
          if (filter.currentBrand != filter.brands[0]) {
            return filterFilter(bikes, filter.currentBrand);
          } else {
            return bikes;
          }
        }
  
        function filterSizes (bikes) {
          // TODO: filter by sizes array
          if (filter.currentSize != filter.sizes[0]) {
            return filterFilter(bikes, filter.currentSize);
          } else {
            return bikes;
          }
        }

        function increaseBikesCount() {
          filter.currentSizes.push(-1);
          filter.updateState({ sizes: filter.currentSizes.join(',') });
        }

        function decreaseBikesCount(){
          if (filter.currentSizes.length <= 1) return;
          filter.currentSizes.pop();
          filter.updateState({ sizes: filter.currentSizes.join(',') });
        }
      }
    ]
  })
  // size filter
  .component('bikeCountFilter', {
    templateUrl: 'app/modules/shared/filter/bike-count-filter.template.html',
    require: { parent: '^filter' },
    controllerAs: 'bikeCountFilter'
  })
  // category filter
  .component('categoryFilter', {
    templateUrl: 'app/modules/shared/filter/category-filter.template.html',
    require: { parent: '^filter' },
    controllerAs: 'categoryFilter'
  })
