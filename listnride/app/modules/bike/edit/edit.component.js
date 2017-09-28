'use strict';

angular.module('edit',[]).component('edit', {
  templateUrl: 'app/modules/bike/list/list.template.html',
  controllerAs: 'list',
  controller: ['$mdDialog', '$localStorage', '$state', '$stateParams', 'Upload', 'bikeOptions', 'api', 'accessControl', 'loadingDialog',
    function EditController($mdDialog, $localStorage, $state, $stateParams, Upload, bikeOptions, api, accessControl, loadingDialog) {
      if (accessControl.requireLogin()) {
        return;
      }
      
      var list = this;
      list.heading = 'list.edit-bike';
      list.isListMode = false;
      list.form = { images: [] };
      list.selectedIndex = 0;
      list.sizeOptions = bikeOptions.sizeOptions();
      list.kidsSizeOptions = bikeOptions.kidsSizeOptions();
      list.categoryOptions = bikeOptions.categoryOptions();
      list.subcategoryOptions = bikeOptions.subcategoryOptions();
      list.accessoryOptions = bikeOptions.accessoryOptions();
      list.validateObj = {height: {min: 1000}, width: {min: 1500}, duration: {max: '5m'}};
      list.invalidFiles = {};

      // flag for daily and weekly discount fields
      list.discountFieldEditable = true;

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

            // daily and weekly discounts
            // by default the discounts are 0
            data.discount_daily = data.discount_daily ? parseInt(data.discount_daily) : 0;
            data.discount_weekly = data.discount_weekly ? parseInt(data.discount_weekly) : 0;

            // form data for edit bikes
            list.form = data;
          }
        },
        function(error) {
          console.log("Error editing bike", error);
        }
      );

      // set the custom prices for a bike
      list.setCustomPrices = function () {
        // only when discount fields are enabled
        if (list.discountFieldEditable) {
          // set the custom prices
          list.form = bikeOptions.setCustomPrices(list.form);
        }
      };

      list.disableDiscounts = function () {
        list.discountFieldEditable = false;
      };

      list.enableDiscounts = function () {
        list.discountFieldEditable = true;
      };

      list.onFormSubmit = function() {
        list.submitDisabled = true;
        loadingDialog.open();

        var ride = {
          "ride[name]": list.form.name,
          "ride[brand]": list.form.brand,
          "ride[description]": list.form.description,
          "ride[size]": list.form.size,
          "ride[category]": list.form.mainCategory.concat(list.form.subCategory),
          "ride[has_lock]": list.form.has_lock || false,
          "ride[has_helmet]": list.form.has_helmet || false,
          "ride[has_lights]": list.form.has_lights || false,
          "ride[has_basket]": list.form.has_basket || false,
          "ride[has_trailer]": list.form.has_trailer || false,
          "ride[has_childseat]": list.form.has_childseat || false,
          "ride[user_id]": $localStorage.userId,
          "ride[street]": list.form.street,
          "ride[city]": list.form.city,
          "ride[zip]": list.form.zip,
          "ride[country]": list.form.country,
          "ride[price_half_daily]": list.form.price_half_daily,
          "ride[price_daily]": list.form.price_daily,
          "ride[price_weekly]": list.form.price_weekly,
          "ride[image_file_1]": (list.form.images[0]) ? list.form.images[0].src : undefined,
          "ride[image_file_2]": (list.form.images[1]) ? list.form.images[1].src : undefined,
          "ride[image_file_3]": (list.form.images[2]) ? list.form.images[2].src : undefined,
          "ride[image_file_4]": (list.form.images[3]) ? list.form.images[3].src : undefined,
          "ride[image_file_5]": (list.form.images[4]) ? list.form.images[4].src : undefined
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
            list.submitDisabled = false;
            hloadingDialog.close();
            console.log("Error while listing bike", error);
          }
        );
      };

      list.nextTab = function() {
        list.selectedIndex = list.selectedIndex + 1;
      };

      list.previousTab = function() {
        list.selectedIndex = list.selectedIndex - 1;
      };

      list.addImage = function(files) {
        if (files && files.length)
          for (var i = 0; i < files.length && list.form.images.length < 5; ++i)
            if (files[i] != null)
              list.form.images.push({src: files[i], local: "true"});
      };

      list.removeImage = function(index) {
        list.form.images.splice(index, 1);
      };

      list.isFormValid = function() {
        return isCategoryValid() &&
          isDetailsValid() &&
          isPictureValid() &&
          isLocationValid() &&
          isPricingValid();
      };

      list.categoryChange = function(oldCategory) {
        if (list.form.mainCategory == 4 || oldCategory == 4) {
          list.form.size = undefined;
        }
      };

      list.fillAddress = function(place) {
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

          list.form.street = desiredComponents.route + " " + desiredComponents.street_number;
          list.form.zip = desiredComponents.postal_code;
          list.form.city = desiredComponents.locality;
          list.form.country = desiredComponents.country;
        }
      };

      list.onAccessoryClick = function(accessory) {
        list.form[accessory] = !list.form[accessory];
      };

      function isCategoryValid() {
        return list.form.mainCategory !== undefined &&
          list.form.subCategory !== undefined;
      }

      function isDetailsValid() {
        return list.form.name !== undefined &&
          list.form.brand !== undefined &&
          list.form.size !== undefined &&
          list.form.description !== undefined;
      }

      function isPictureValid() {
        return list.form.images.length > 0;
      }

      function isLocationValid() {
        return list.form.street !== undefined &&
          list.form.zip !== undefined &&
          list.form.city !== undefined &&
          list.form.country !== undefined;
      }

      function isPricingValid () {
        return list.form.price_daily !== undefined &&
          list.form.price_2_days !== undefined &&
          list.form.price_3_days !== undefined &&
          list.form.price_4_days !== undefined &&
          list.form.price_5_days !== undefined &&
          list.form.price_6_days !== undefined &&
          list.form.price_7_days !== undefined &&
          list.form.price_8_days !== undefined &&
          list.form.price_30_days !== undefined;
      }

    }
  ]
});
