'use strict';

angular.module('edit').component('edit', {
  templateUrl: 'app/modules/edit/edit.template.html',
  controllerAs: 'edit',
  controller: ['$localStorage', '$state', 'Upload', 'bike_options', 'api',
    function EditController($localStorage, $state, Upload, bike_options, api) {
      var edit = this;

      edit.form = {
        images: []
      };

      edit.selectedIndex = 0;
      edit.sizeOptions = bike_options.sizeOptions();
      edit.kidsSizeOptions = bike_options.kidsSizeOptions();
      edit.categoryOptions = bike_options.categoryOptions();
      edit.subcategoryOptions = bike_options.subcategoryOptions();
      edit.accessoryOptions = bike_options.accessoryOptions();

      edit.onFormSubmit = function() {
        edit.submitDisabled = true;

        var ride = {
          "ride[name]": edit.form.name,
          "ride[brand]": edit.form.brand,
          "ride[description]": edit.form.description,
          "ride[size]": edit.form.size,
          "ride[category]": edit.form.mainCategory.concat(edit.form.subCategory),
          "ride[has_lock]": edit.form.has_lock || false,
          "ride[has_helmet]": edit.form.has_helmet || false,
          "ride[has_lights]": edit.form.has_lights || false,
          "ride[has_basket]": edit.form.has_basket || false,
          "ride[has_trailer]": edit.form.has_trailer || false,
          "ride[has_childseat]": edit.form.has_childseat || false,
          "ride[user_id]": $localStorage.userId,
          "ride[street]": edit.form.street,
          "ride[city]": edit.form.city,
          "ride[zip]": edit.form.zip,
          "ride[country]": edit.form.country,
          "ride[price_half_daily]": edit.form.price_half_daily,
          "ride[price_daily]": edit.form.price_daily,
          "ride[price_weekly]": edit.form.price_weekly,
          "ride[image_file_1]": edit.form.images[0],
          "ride[image_file_2]": edit.form.images[1],
          "ride[image_file_3]": edit.form.images[2],
          "ride[image_file_4]": edit.form.images[3],
          "ride[image_file_5]": edit.form.images[4]
        };
        
        Upload.upload({
          method: 'POST',
          url: api.getApiUrl() + '/rides',
          data: ride,
          headers: {
            'Authorization': $localStorage.auth
          }
        }).then(
          function(response) {
            $state.go("bike", {bikeId: response.data.id});
          },
          function(error) {
            edit.submitDisabled = false;
            console.log("Error while listing bike", error);
          }
        );
      };

      edit.nextTab = function() {
        edit.selectedIndex = edit.selectedIndex + 1;
      }

      edit.previousTab = function() {
        edit.selectedIndex = edit.selectedIndex - 1;
      }

      edit.addImage = function(files) {
        if (files && files.length)
          for (var i = 0; i < files.length && edit.form.images.length < 5; ++i)
            if (files[i] != null)
              edit.form.images.push(files[i]);
      };

      edit.removeImage = function(index) {
        edit.form.images.splice(index, 1);
      }

      edit.isCategoryValid = function() {
        return edit.form.mainCategory !== undefined &&
          edit.form.subCategory !== undefined;
      };

      edit.isDetailsValid = function() {
        return edit.form.name !== undefined &&
          edit.form.brand !== undefined &&
          edit.form.description !== undefined &&
          edit.form.description.length >= 100;
      };

      edit.isPictureValid = function() {
        return edit.form.images.length > 0;
      };

      edit.isLocationValid = function() {
        return edit.form.street !== undefined &&
          edit.form.zip !== undefined &&
          edit.form.city !== undefined &&
          edit.form.country !== undefined;
      };

      edit.isPricingValid = function() {
        return edit.form.price_half_daily !== undefined &&
          edit.form.price_daily !== undefined &&
          edit.form.price_weekly !== undefined;
      };

    }
  ]
});