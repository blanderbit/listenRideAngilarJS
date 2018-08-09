'use strict';

angular.module('accessoriesFilter', [])
  .component('accessoriesFilter', {
    templateUrl: 'app/modules/shared/filter/accessories-filter.template.html',
    controllerAs: 'accessoriesFilter',
    bindings: {
      currentAccessories: '=',
      onFilterChange: '<'
    },
    controller: [
      '$translate',
      '$state',
      'bikeOptions',
      'filterFilter',
      function AccessoriesFilterController($translate, $state, bikeOptions, filterFilter) {
        var accessoriesFilter = this;

        accessoriesFilter.$onInit = function () {
          // methods
          accessoriesFilter.toggle = toggle;
          accessoriesFilter.exists = exists;
          accessoriesFilter.isIndeterminate = isIndeterminate;
          accessoriesFilter.isChecked = isChecked;
          accessoriesFilter.showSubs = showSubs;
          accessoriesFilter.categorySubs = categorySubs;

          // variables
          accessoriesFilter.accessories = [];
          bikeOptions.accessoryOptions().then(function (resolve) {
            accessoriesFilter.accessories = resolve;
          });
        };

        function toggle(item, list) {
          var idx = list.indexOf(item);
          if (idx > -1) {
            list.splice(idx, 1);
          } else {
            list.push(item);
          }
          if (typeof accessoriesFilter.onFilterChange === "function") accessoriesFilter.onFilterChange();
        };

        function exists(item, list) {
          return list.indexOf(item) > -1;
        };

        function isIndeterminate(categoryId) {
          var intersection = _.intersection(accessoriesFilter.categorySubs(categoryId), accessoriesFilter.currentAccesories).length;
          return (intersection > 0 && intersection !== accessoriesFilter.categorySubs(categoryId).length);
        };

        function isChecked(categoryId) {
          return categoryChosen(categoryId);
        };

        function showSubs(categoryId) {
          return accessoriesFilter.openSubs.includes(categoryId)
        };

        function categoryIntersection(categoryId) {
          return _.intersection(accessoriesFilter.currentAccesories, accessoriesFilter.categorySubs(categoryId)).sort()
        }

        function categoryChosen(categoryId) {
          return _.isEqual(categoryIntersection(categoryId), accessoriesFilter.categorySubs(categoryId))
        }

        function categorySubs(id) {
          return _.map(_.find(accessoriesFilter.categories, function (category) {
            return category.catId === id;
          }).subcategories, 'id').sort()
        }

      }
    ]
  });

