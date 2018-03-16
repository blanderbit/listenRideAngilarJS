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

        filter.brands = ["All Brands"];
        filter.currentSize = filter.initialValues.size;
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
          filter.updateState({ size: filter.currentSize });
          applyFilters();
        };

        filter.clearFilters = function() {
          filter.currentSize = bikeOptions.sizeOptionsForSearch()[0];
          filter.currentBrand = filter.brands[0];
          applyFilters();
        };

        filter.onCategoryChange = function() {
          applyFilters();
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

        function initializeSizeFilter () {
          filter.sizes = bikeOptions.sizeOptionsForSearch();
          $translate('search.all-sizes').then(function (translation) {
            filter.sizes[0].label = translation;
          });
        }
  
        function applyFilters () {
          var filteredBikes = filter.initialBikes;
          filteredBikes = filterBrands(filteredBikes);
          filteredBikes = filterSizes(filteredBikes);
          filteredBikes = filterCategories(filteredBikes);
          filter.bikes = filteredBikes;
        }

        function filterBrands (bikes) {
          if (filter.currentBrand != filter.brands[0]) {
            return filterFilter(bikes, filter.currentBrand);
          } else {
            return bikes;
          }
        }
  
        function filterSizes (bikes) {
          if (filter.currentSize != filter.sizes[0]) {
            return filterFilter(bikes, filter.currentSize);
          } else {
            return bikes;
          }
        }

        function filterCategories (bikes) {
          if (!_.isEmpty(filter.selected)) {
            return arrayFilter(bikes);
          } else {
            return bikes;
          }
        }

        //----- Category filter -----

        filter.categories = [
          {id: 10, name: 'Dutch bike'},
          {id: 11, name: 'Touring bike'},
          {id: 12, name: 'Fixie'},
          {id: 13, name: 'Single Speed'}
        ];

        filter.selected = [];

        var categoriesLength = filter.categories.length;

        filter.toggle = function (item, list) {
          var idx = list.indexOf(item);
          if (idx > -1) {
            list.splice(idx, 1);
          }
          else {
            list.push(item);
          }

          filter.onCategoryChange()
        };

        filter.exists = function (item, list) {
          return list.indexOf(item) > -1;
        };

        filter.isIndeterminate = function() {
          return (filter.selected.length !== 0 &&
            filter.selected.length !== categoriesLength);
        };

        filter.isChecked = function() {
          return filter.selected.length === categoriesLength;
        };

        filter.toggleAll = function() {
          if (filter.selected.length === categoriesLength) {
            filter.selected = [];
          } else if (filter.selected.length === 0 || filter.selected.length > 0) {
            filter.selected = [];
            for (var i = 0; i < filter.categories.length; i++) {
              filter.selected.push(filter.categories[i].id);
            }
          }

          filter.onCategoryChange()
        };
        
        function arrayFilter(bikes) {
          return _.filter(bikes, function(o) {
            return _.includes(filter.selected, o.category);
          })
        }

        //----- end -----
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
  });
