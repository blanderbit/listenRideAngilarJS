'use strict';

angular.module('edit', []).component('edit', {
  templateUrl: 'app/modules/edit/edit.template.html',
  controllerAs: 'edit',
  controller: ['$mdDialog', '$localStorage', '$state', '$stateParams', 'Upload', 'bikeOptions', 'api', 'accessControl', 'loadingDialog',
    function EditController($mdDialog, $localStorage, $state, $stateParams, Upload, bikeOptions, api, accessControl, loadingDialog) {
      if (accessControl.requireLogin()) {
        return;
      }
      
      var edit = this;

      edit.form = { images: [] };
      edit.selectedIndex = 0;
      edit.sizeOptions = bikeOptions.sizeOptions();
      edit.kidsSizeOptions = bikeOptions.kidsSizeOptions();
      edit.categoryOptions = bikeOptions.categoryOptions();
      edit.subcategoryOptions = bikeOptions.subcategoryOptions();
      edit.accessoryOptions = bikeOptions.accessoryOptions();

      api.get('/rides/' + $stateParams.bikeId).then(
        function(response) {
          var data = response.data;

          if (data.user.id == $localStorage.userId) {
            var images = [];
            for (var i = 1; i <= 5; ++i) {
              if (data["image_file_" + i] !== undefined &&
                data["image_file_" + i]["image_file_" + i].small.url !== null) {
                images.push({
                  src: data["image_file_" + i],
                  url: data["image_file_" + i]["image_file_" + i].small.url,
                  local: "false"
                });
              }
            }

            data.images = images;
            data.price_half_daily = parseInt(data.price_half_daily);
            data.price_daily = parseInt(data.price_daily);
            data.price_weekly = parseInt(data.price_weekly);
            data.size = parseInt(data.size);
            data.mainCategory = (data.category + "").charAt(0);
            data.subCategory = (data.category + "").charAt(1);
            edit.form = data;
          }
        },
        function(error) {
          console.log("Error editing bike", error);
        }
      );

      edit.onFormSubmit = function() {
        edit.submitDisabled = true;
        loadingDialog.open();

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
          "ride[image_file_1]": (edit.form.images[0]) ? edit.form.images[0].src : undefined,
          "ride[image_file_2]": (edit.form.images[1]) ? edit.form.images[1].src : undefined,
          "ride[image_file_3]": (edit.form.images[2]) ? edit.form.images[2].src : undefined,
          "ride[image_file_4]": (edit.form.images[3]) ? edit.form.images[3].src : undefined,
          "ride[image_file_5]": (edit.form.images[4]) ? edit.form.images[4].src : undefined
        };
        
        Upload.upload({
          method: 'PUT',
          url: api.getApiUrl() + '/rides/' + $stateParams.bikeId,
          data: ride,
          headers: {
            'Authorization': $localStorage.auth
          }
        }).then(
          function(response) {
            loadingDialog.close();
            $state.go("bike", {bikeId: response.data.id});
            console.log("Success", response);
          },
          function(error) {
            edit.submitDisabled = false;
            hloadingDialog.close();
            console.log("Error while listing bike", error);
          }
        );
      };

      edit.nextTab = function() {
        edit.selectedIndex = edit.selectedIndex + 1;
        console.log(edit.form);
      }

      edit.previousTab = function() {
        edit.selectedIndex = edit.selectedIndex - 1;
        console.log(edit.form);
      }

      edit.addImage = function(files) {
        if (files && files.length)
          for (var i = 0; i < files.length && edit.form.images.length < 5; ++i)
            if (files[i] != null)
              edit.form.images.push({src: files[i], local: "true"});
      };

      edit.removeImage = function(index) {
        edit.form.images.splice(index, 1);
        console.log(edit.form.images);
      };

      edit.isFormValid = function() {
        return isCategoryValid() &&
          isDetailsValid() &&
          isPictureValid() &&
          isLocationValid() &&
          isPricingValid();
      };

      edit.categoryChange = function(oldCategory) {
        if (edit.form.mainCategory == 4 || oldCategory == 4) {
          edit.form.size = undefined;
        }
      };

      edit.fillAddress = function(place) {
        var components = place.address_components;
        if (components) {
          var desiredComponents = {
            "street_number": "",
            "route": "",
            "locality": "",
            "country": "",
            "postal_code": ""
          };

          for (var i = 0; i < components.length; i++) {
            var type = components[i].types[0];
            if (type in desiredComponents) {
              desiredComponents[type] = components[i].long_name;
            }
          }

          edit.form.street = desiredComponents.route + " " + desiredComponents.street_number;
          edit.form.zip = desiredComponents.postal_code;
          edit.form.city = desiredComponents.locality;
          edit.form.country = desiredComponents.country;
        }
      };

      function isCategoryValid() {
        return edit.form.mainCategory !== undefined &&
          edit.form.subCategory !== undefined;
      };

      function isDetailsValid() {
        return edit.form.name !== undefined &&
          edit.form.brand !== undefined &&
          edit.form.size !== undefined &&
          edit.form.description !== undefined;
      };

      function isPictureValid() {
        return edit.form.images.length > 0;
      };

      function isLocationValid() {
        return edit.form.street !== undefined &&
          edit.form.zip !== undefined &&
          edit.form.city !== undefined &&
          edit.form.country !== undefined;
      };

      function isPricingValid() {
        return edit.form.price_half_daily !== undefined &&
          edit.form.price_daily !== undefined &&
          edit.form.price_weekly !== undefined;
      };

    }
  ]
});