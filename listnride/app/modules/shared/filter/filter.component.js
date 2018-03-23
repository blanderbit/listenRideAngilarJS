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

        filter.$onInit = function () {
          // methods
          filter.onBrandChange = onBrandChange;
          filter.onSizeChange = onSizeChange;
          filter.clearFilters = clearFilters;
          filter.onCategoryChange = onCategoryChange;
          filter.increaseBikesCount = increaseBikesCount;
          filter.decreaseBikesCount = decreaseBikesCount;
          filter.toggle = toggle;
          filter.exists = exists;
          filter.isIndeterminate = isIndeterminate;
          filter.isChecked = isChecked;
          filter.toggleAll = toggleAll;
          filter.showSubs = showSubs;

          // variables
          // sizes
          filter.currentSizes = filter.initialValues.sizes.slice();
          initializeSizeFilter();
          // brand
          filter.brands = ["All Brands"];
          filter.currentBrand = filter.brands[0];
          // categories
          filter.categories = bikeOptions.allCategoriesOptions();
          filter.selected = [];
          filter.openSubs = [];
          
        }
        // Wait for bikes to be actually provided
        filter.$onChanges = function (changes) {
          if (filter.initialBikes != undefined) {
            filter.bikes = filter.initialBikes;
            initializeBrandFilter();
            applyFilters();
          }
        };

        function onBrandChange() {
          filter.updateState({ brand: filter.currentBrand });
          applyFilters();
        };

        function onSizeChange() {
          filter.updateState({ sizes: filter.currentSizes.join(',') });
          applyFilters();
        };

        function clearFilters() {
          filter.currentSizes = [-1];
          filter.selected = [];
          filter.openSubs = [];
          filter.currentBrand = filter.brands[0];
          clearState();
          applyFilters();
        };

        function onCategoryChange() {
          applyFilters();
        };

        function clearState() {
          filter.updateState({
            brand: '',
            sizes: ''
          });
        }

        function initializeBrandFilter() {
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

        function initializeSizeFilter() {
          if (filter.currentSizes[0] === '') filter.currentSizes[0] = '-1';
          if (!filter.currentSizes.length) filter.increaseBikesCount();
          filter.sizes = bikeOptions.sizeOptionsForSearch();
          $translate('search.all-sizes').then(function (translation) {
            filter.sizes[0].label = translation;
          });
        }
  
        function applyFilters() {
          var filteredBikes = filter.initialBikes;
          filteredBikes = filterBrands(filteredBikes);
          filteredBikes = filterSizes(filteredBikes);
          filteredBikes = filterCategories(filteredBikes);
          filter.bikes = filteredBikes;
          initializeBrandFilter();
        }

        function filterBrands(bikes) {
          if (filter.currentBrand != filter.brands[0]) {
            return filterFilter(bikes, filter.currentBrand);
          } else {
            return bikes;
          }
        }
  
        function filterSizes(bikes) {
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
          filter.onSizeChange();
        }

        function decreaseBikesCount(){
          if (filter.currentSizes.length <= 1) return;
          filter.currentSizes.pop();
          filter.onSizeChange();
        }

        //----- Category filter -----

        function toggle(item, list) {
          var idx = list.indexOf(item);
          if (idx > -1) {
            list.splice(idx, 1);
          } else {
            list.push(item);
          }
          filter.onCategoryChange()
        };

        function exists(item, list) {
          return list.indexOf(item) > -1;
        };

        function isIndeterminate(categoryId) {
          return (filter.selected.length !== 0 && !categoryChosen(categoryId));
        };

        function isChecked(categoryId) {
          return categoryChosen(categoryId);
        };

        function toggleAll($event, categoryId) {
          $event.stopPropagation();
          if (categoryChosen(categoryId)) {
            filter.selected = _.difference(filter.selected, categorySubs(categoryId))
          } else if (filter.selected.length === 0 || filter.selected.length > 0) {
            filter.selected = _.union(filter.selected, categorySubs(categoryId));
            filter.openSubs = _.union(filter.openSubs, [categoryId])
          }
          filter.onCategoryChange()
        };

        function showSubs(categoryId) {
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
