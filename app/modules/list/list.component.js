'use strict';

angular.module('list').component('list', {
  templateUrl: 'app/modules/list/list.template.html',
  controllerAs: 'list',
  controller: ['$mdDialog', '$localStorage', '$state', '$scope', 'Upload', 'bike_options', 'api', '$timeout', 'verification',
    function ListController($mdDialog, $localStorage, $state, $scope, Upload, bike_options, api, $timeout, verification) {
      var list = this;

      list.form = {
        images: []
      };

      api.get('/users/' + $localStorage.userId).then(
        function (success) {
          var user = success.data;
          if (!user.has_address || !user.confirmed_phone || user.status == 0) {
            verification.openDialog(true);
          }
        },
        function (error) {
          console.log("Error fetching User");
        }
      );

      list.selectedIndex = 0;
      list.sizeOptions = bike_options.sizeOptions();
      list.kidsSizeOptions = bike_options.kidsSizeOptions();
      list.categoryOptions = bike_options.categoryOptions();
      list.subcategoryOptions = bike_options.subcategoryOptions();
      list.accessoryOptions = bike_options.accessoryOptions();

      list.onFormSubmit = function() {
        list.submitDisabled = true;
        showLoadingDialog();

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
          "ride[image_file_1]": list.form.images[0],
          "ride[image_file_2]": list.form.images[1],
          "ride[image_file_3]": list.form.images[2],
          "ride[image_file_4]": list.form.images[3],
          "ride[image_file_5]": list.form.images[4]
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
            hideLoadingDialog();
            $state.go("listings");
          },
          function(error) {
            list.submitDisabled = false;
            hideLoadingDialog();
            console.log("Error while listing bike", error);
          }
        );
      };

      list.nextTab = function() {
        list.selectedIndex = list.selectedIndex + 1;
      }

      list.previousTab = function() {
        list.selectedIndex = list.selectedIndex - 1;
      }

      list.addImage = function(files) {
        if (files && files.length)
          for (var i = 0; i < files.length && list.form.images.length < 5; ++i)
            if (files[i] != null)
              list.form.images.push(files[i]);
      };

      list.removeImage = function(index) {
        list.form.images.splice(index, 1);
      }

      list.isCategoryValid = function() {
        return list.form.mainCategory !== undefined &&
          list.form.subCategory !== undefined;
      };

      list.isDetailsValid = function() {
        return list.form.name !== undefined &&
          list.form.brand !== undefined &&
          list.form.size !== undefined &&
          list.form.description !== undefined &&
          list.form.description.length >= 100;
      };

      list.isPictureValid = function() {
        return list.form.images.length > 0;
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

      var loadingDialog;

      function showLoadingDialog() {
        var loadingDialog = $mdDialog.show({
          parent: angular.element(document.body),
          templateUrl: 'app/modules/list/loadingDialog.template.html',
          fullscreen: true
        });
      };

      function hideLoadingDialog() {
        $mdDialog.hide(loadingDialog);
      };

    }
  ]
});