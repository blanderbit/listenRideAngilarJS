'use strict';

angular.module('filter',[])
  .component('filter', {
    templateUrl: 'app/modules/shared/filter/filter.template.html',
    controllerAs: 'filter',
    bindings: {
      updateState: '<',
      initialValues: '<',
      initialBikes: '<',
      bikes: '=',
      populateBikes: '<',
      categorizedBikes: '=',
      limit: '='
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
          filter.onDateChange = onDateChange;
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
          filter.closeDateRange = closeDateRange;

          // variables
          filter.isClearDataRange = false;
          filter.currentDate = filter.initialValues.date;
          // sizes
          filter.currentSizes = filter.initialValues.sizes.slice();
          initializeSizeFilter();
          // brand
          filter.brands = [$translate.instant("search.all-brands")];
          filter.currentBrand = filter.brands[0];
          // categories
          filter.categories = [];
          bikeOptions.allCategoriesOptions().then(function (resolve) {
            filter.categories = resolve;
          });
          filter.currentCategories = filter.initialValues.categories.filter(Boolean).slice().map(Number);
          filter.openSubs = [];
        };

        // Wait for bikes to be actually provided
        filter.$onChanges = function (changes) {
          // TODO: initializeBrandFilter inited one time here and one time in applyFilters.
          // Remove unnecessary init @moritz
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

        function onDateChange() {
          filter.updateState({
            start_date: filter.currentDate.start_date,
            duration: filter.currentDate.duration
          }, function() {
            filter.populateBikes();
          });
        };

        function onSizeChange() {
          filter.updateState({ sizes: filter.currentSizes.join(',') });
          applyFilters();
        };

        function clearFilters() {
          clearState(function(){
            filter.currentSizes = [-1];
            filter.currentCategories = [];
            filter.openSubs = [];
            filter.currentBrand = filter.brands[0];
            filter.limit = 15;
            clearDate();
            applyFilters();
          });
        };

        function onCategoryChange() {
          filter.updateState({ categories: filter.currentCategories.join(',') });
          applyFilters();
        };

        function clearState(cb) {
          filter.updateState({
            brand: '',
            sizes: '',
            start_date: '',
            duration: '',
            categories: ''
          }, cb);
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

          // sord brands
          var defaultBrand = filter.brands.shift();
          filter.brands.sort(alphabetical);
          filter.brands.unshift(defaultBrand);
        }

        function alphabetical(a, b) {
          var A = a.toLowerCase();
          var B = b.toLowerCase();
          if (A < B) {
            return -1;
          } else if (A > B) {
            return 1;
          } else {
            return 0;
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
          var filteredBikes = filter.initialBikes.slice();
          filteredBikes = filterBrands(filteredBikes);
          filteredBikes = filterSizes(filteredBikes);
          filteredBikes = filterCategories(filteredBikes);
          filter.bikes = filteredBikes;

          filter.categorizedBikes = [{
            title: $translate.instant("search.all-bikes"),
            bikes: filter.bikes
          }];

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
          // TODO: find clear solution for this
          if (!_.isEmpty(filter.currentSizes) && filter.currentSizes.indexOf("-1") == -1 && filter.currentSizes.indexOf(-1) == -1) {
            var selectedSizes = _.uniq(filter.currentSizes);
            selectedSizes = selectedSizes.map(Number);
            return arrayFilter(bikes, selectedSizes, 'size');
          } else {
            return bikes;
          }
        }

        function filterCategories (bikes) {
          if (!_.isEmpty(filter.currentCategories)) {
            return arrayFilter(bikes, filter.currentCategories, 'category');
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

        function clearDate() {
          filter.isClearDataRange = true;
          if (!filter.currentDate.start_date) return;
          filter.currentDate = {
            'start_date': null,
            'duration': null
          }
          filter.populateBikes();
        }

        // tricky function to initialize date-picker close, when we click ng-menu
        function closeDateRange() {
          var datePickerTrigger = angular.element('.js-datepicker-opened');
          if (!!datePickerTrigger.length) {
            datePickerTrigger.click();
          }
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
          var intersection = _.intersection(categorySubs(categoryId), filter.currentCategories).length;
          return (intersection > 0 && intersection !== categorySubs(categoryId).length);
        };

        function isChecked(categoryId) {
          return categoryChosen(categoryId);
        };

        function toggleAll($event, categoryId) {
          $event.stopPropagation();
          if (categoryChosen(categoryId)) {
            filter.currentCategories = _.difference(filter.currentCategories, categorySubs(categoryId))
          } else if (filter.currentCategories.length === 0 || filter.currentCategories.length > 0) {
            filter.currentCategories = _.union(filter.currentCategories, categorySubs(categoryId));
            filter.openSubs = _.union(filter.openSubs, [categoryId])
          }
          filter.onCategoryChange()
        };

        function showSubs(categoryId) {
          return filter.openSubs.includes(categoryId)
        };

        function categoryIntersection(categoryId) {
          return _.intersection(filter.currentCategories, categorySubs(categoryId)).sort()
        }

        function categoryChosen(categoryId) {
          return _.isEqual(categoryIntersection(categoryId), categorySubs(categoryId))
        }

        function categorySubs(id) {
          return _.map(_.find(filter.categories, function(category) {
            return category.catId === id;
          }).subcategories, 'id').sort()
        }

        function arrayFilter(bikes, selectedItems, filterBy) {
          return _.filter(bikes, function(o) {
            return _.includes(selectedItems, o[filterBy]);
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
