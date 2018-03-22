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
        };

        filter.clearFilters = function() {
          filter.currentSizes = [];
          filter.selected = [];
          filter.openSubs = [];
          filter.currentBrand = filter.brands[0];
          clearState();
          applyFilters();
        };

        filter.onCategoryChange = function() {
          applyFilters();
        };

        function clearState() {
          filter.updateState({
            brand: '',
            sizes: ''
          });
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
          filteredBikes = filterCategories(filteredBikes);
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

        function filterCategories (bikes) {
          if (!_.isEmpty(filter.selected)) {
            return arrayFilter(bikes);
          } else {
            return bikes;
          }
        }

        function increaseBikesCount() {
          filter.currentSizes.push(-1);
          onSizeChange();
        }

        function decreaseBikesCount(){
          if (filter.currentSizes.length <= 1) return;
          filter.currentSizes.pop();
          onSizeChange();
        }

        //----- Category filter -----

        filter.categories = bikeOptions.allCategoriesOptions();
        filter.selected = [];
        filter.openSubs = [];

        filter.toggle = function (item, list) {
          var idx = list.indexOf(item);
          if (idx > -1) {
            list.splice(idx, 1);
          } else {
            list.push(item);
          }
          filter.onCategoryChange()
        };

        filter.exists = function (item, list) {
          return list.indexOf(item) > -1;
        };

        filter.isIndeterminate = function(categoryId) {
          return (filter.selected.length !== 0 && !categoryChosen(categoryId));
        };

        filter.isChecked = function(categoryId) {
          return categoryChosen(categoryId);
        };

        filter.toggleAll = function($event, categoryId) {
          $event.stopPropagation();
          if (categoryChosen(categoryId)) {
            filter.selected = _.difference(filter.selected, categorySubs(categoryId))
          } else if (filter.selected.length === 0 || filter.selected.length > 0) {
            filter.selected = _.union(filter.selected, categorySubs(categoryId));
            filter.openSubs = _.union(filter.openSubs, [categoryId])
          }
          filter.onCategoryChange()
        };

        filter.showSubs = function(categoryId) {
          return filter.openSubs.includes(categoryId)
        };

        function categoryIntersection(categoryId) {
          return _.intersection(filter.selected, categorySubs(categoryId)).sort()
        }

        function categoryChosen(categoryId) {
          return _.isEqual(categoryIntersection(categoryId), categorySubs(categoryId))
        }

        function categorySubs(id) {
          return _.map(_.find(filter.categories, function(category) {
            return category.catId === id;
          }).subcategories, 'id').sort()
        }

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
