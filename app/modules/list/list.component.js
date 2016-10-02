'use strict';

angular.module('list').component('list', {
  templateUrl: 'app/modules/list/list.template.html',
  controllerAs: 'list',
  controller: ['$localStorage', 'Upload', 'bike_options', 'api',
    function ListController($localStorage, Upload, bike_options, api) {
      var list = this;

      list.form = {};

      list.selectedIndex = 0;
      list.sizeOptions = bike_options.sizeOptions();
      list.categoryOptions = bike_options.categoryOptions();
      list.subcategoryOptions = bike_options.subcategoryOptions();
      list.accessoryOptions = bike_options.accessoryOptions();

      list.onFormSubmit = function() {
        var form = { ride: {} };
        form.ride = list.form;
        form.ride.category = list.form.mainCategory.concat(list.form.subCategory);
        delete form.ride.mainCategory;
        delete form.ride.subCategory;
        console.log(form);

        Upload.upload({
          method: 'POST',
          url: api.getApiUrl() + '/rides',
          data: form,
          headers: {
            'Authorization': $localStorage.auth
          }
        }).then(
          function(response) {
            console.log("Success", response);
          },
          function(error) {
            console.log("Error", error);
          }
        );
      };

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
      };

      list.isPictureValid = function() {
        return list.form.image_file_1 !== undefined;
      };

      list.isLocationValid = function() {
        return list.form.street !== undefined &&
          list.form.zip !== undefined &&
          list.form.city !== undefined &&
          list.form.country !== undefined;
      };

      list.isPricingValid = function() {
        return list.form.price_half_daily !== undefined &&
          list.form.price_daily !== undefined &&
          list.form.price_weekly !== undefined;
      };

    }
  ]
});