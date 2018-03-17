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
          // TODO: YB for each clear sizes
          // filter.currentSizes = bikeOptions.sizeOptionsForSearch()[0];

          filter.currentBrand = filter.brands[0];
          applyFilters();
        };

        filter.onCategoryChange = function() {
          applyFilters();
        };

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
          filter.updateState({ sizes: filter.currentSizes.join(',') });
        }

        function decreaseBikesCount(){
          if (filter.currentSizes.length <= 1) return;
          filter.currentSizes.pop();
          filter.updateState({ sizes: filter.currentSizes.join(',') });
        }

        //----- Category filter -----

        filter.categories = [
          {
            catId: 10,
            name: 'City',
            iconFileName: "biketype_1.svg",
            subcategories: [
              {id: 10, name: 'Dutch bike'},
              {id: 11, name: 'Touring bike'},
              {id: 12, name: 'Fixie'},
              {id: 13, name: 'Single Speed'}
            ]
          },
          {
            catId: 20,
            name: 'Race',
            iconFileName: "biketype_2.svg",
            subcategories: [
              {id: 20, name: 'Road bike'},
              {id: 21, name: 'Triathlon'},
              {id: 22, name: 'Indoor'}
            ]
          },
          {
            catId: 30,
            name: 'All terrain',
            iconFileName: "biketype_3.svg",
            subcategories: [
              {id: 30, name: 'Tracking'},
              {id: 31, name: 'Enduro'},
              {id: 32, name: 'Freeride'},
              {id: 33, name: 'Cross Country'},
              {id: 34, name: 'Downhill'},
              {id: 35, name: 'Cyclocross'}
            ]
          },
          {
            catId: 40,
            name: 'Children',
            iconFileName: "biketype_4.svg",
            subcategories: [
              {id: 40, name: 'City'},
              {id: 41, name: 'All Terrain'},
              {id: 42, name: 'Road'}
            ]
          },
          {
            catId: 50,
            name: 'Electric',
            iconFileName: "biketype_5.svg",
            subcategories: [
              {id: 50, name: 'Pedelec'},
              {id: 51, name: 'E-bike'}
            ]
          },
          {
            catId: 60,
            name: 'Special',
            iconFileName: "biketype_6.svg",
            subcategories: [
              {id: 60, name: 'Folding bike'},
              {id: 61, name: 'Tandem'},
              {id: 62, name: 'Cruiser'},
              {id: 63, name: 'Cargo bike'},
              {id: 64, name: 'Recumbent'},
              {id: 65, name: 'Mono bike'}
            ]
          }
        ];

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

        filter.toggleAll = function(categoryId) {
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
