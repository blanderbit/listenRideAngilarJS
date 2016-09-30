'use strict';

angular.module('list').component('list', {
  templateUrl: 'app/modules/list/list.template.html',
  controllerAs: 'list',
  controller: ['bike_options',
    function ListController(bike_options) {
      var list = this;

      list.form = {};

      list.selectedIndex = 0;
      list.sizeOptions = bike_options.sizeOptions();
      list.categoryOptions = bike_options.categoryOptions();
      list.subcategoryOptions = bike_options.subcategoryOptions();

      list.nextTab = function() {
        list.selectedIndex = list.selectedIndex + 1;
        console.log(list.form);
      }

      list.previousTab = function() {
        list.selectedIndex = list.selectedIndex - 1;
        console.log(list.form);
      }

      list.isCategoryValid = function() {
        return list.form.mainCategory !== undefined &&
          list.form.subCategory !== undefined;
      };

      list.isDetailsValid = function() {
        return list.form.name !== undefined &&
          list.form.brand !== undefined &&
          list.form.description !== undefined &&
          list.form.description.length >= 100;
      }

    }
  ]
});