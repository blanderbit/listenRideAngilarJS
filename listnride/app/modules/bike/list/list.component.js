'use strict';

angular.module('list',[]).component('list', {
  templateUrl: 'app/modules/bike/list/list.template.html',
  controllerAs: 'list',
  controller: ['$mdDialog', '$localStorage', '$state', '$scope', '$analytics', 'Upload', 'bikeOptions', 'api', '$timeout', 'verification', 'accessControl', 'loadingDialog',
    function ListController($mdDialog, $localStorage, $state, $scope, $analytics, Upload, bikeOptions, api, $timeout, verification, accessControl, loadingDialog) {
      if (accessControl.requireLogin()) {
        return;
      }

      var list = this;
      list.validateObj = {height: {min: 1000}, width: {min: 1500}, duration: {max: '5m'}};
      list.invalidFiles = {};

      list.form = {
        images: []
      };

      api.get('/users/' + $localStorage.userId).then(
        function (success) {
          var user = success.data;
          if (!user.has_address || !user.confirmed_phone || user.status == 0) {
            verification.openDialog(true);
          }
          list.form.street = user.street;
          list.form.zip = user.zip;
          list.form.city = user.city;
          list.form.country = user.country;
        },
        function (error) {
          console.log("Error fetching User");
        }
      );

      list.selectedIndex = 0;
      list.sizeOptions = bikeOptions.sizeOptions();
      list.kidsSizeOptions = bikeOptions.kidsSizeOptions();
      list.categoryOptions = bikeOptions.categoryOptions();
      list.subcategoryOptions = bikeOptions.subcategoryOptions();
      list.accessoryOptions = bikeOptions.accessoryOptions();

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
          "ride[image_file_1]": list.form.images[0],
          "ride[image_file_2]": list.form.images[1],
          "ride[image_file_3]": list.form.images[2],
          "ride[image_file_4]": list.form.images[3],
          "ride[image_file_5]": list.form.images[4]
        };

        api.get('/users/' + $localStorage.userId).then(
          function (success) {
            var user = success.data;
            if (!user.has_address || !user.confirmed_phone || user.status == 0) {
              verification.openDialog(false);
              list.submitDisabled = false;
            } else {
              Upload.upload({
                method: 'POST',
                url: api.getApiUrl() + '/rides',
                data: ride,
                headers: {
                  'Authorization': $localStorage.auth
                }
              }).then(
                function(response) {
                  loadingDialog.close();
                  $state.go("listings");
                  $analytics.eventTrack('List Bike', {  category: 'List a Bike', label: 'Bike Added'});
                },
                function(error) {
                  list.submitDisabled = false;
                  loadingDialog.close();
                  console.log("Error while listing bike", error);
                }
              );
            }
          },
          function (error) {
            console.log("Error fetching User");
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
              list.form.images.push(files[i]);
      };

      list.removeImage = function(index) {
        list.form.images.splice(index, 1);
      };

      list.isCategoryValid = function() {
        return list.form.mainCategory !== undefined &&
          list.form.subCategory !== undefined;
      };

      list.isDetailsValid = function() {
        return list.form.name !== undefined &&
          list.form.brand !== undefined &&
          list.form.size !== undefined &&
          list.form.description !== undefined;
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
          list.form.price_weekly !== undefined &&
          list.form.price_weekly < 1000 &&
          list.form.price_half_daily < 1000 &&
          list.form.price_daily < 1000;
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

      list.halfPriceChanged = function() {
        if ($scope.listBike.dailyPrice.$pristine) {
          list.form.price_daily = Math.round(1.5 * list.form.price_half_daily);
        }

        if ($scope.listBike.weeklyPrice.$pristine) {
          list.form.price_weekly = Math.round(5 * list.form.price_daily);
        }
      };

      list.onAccessoryClick = function(accessory) {
        list.form[accessory] = !list.form[accessory];
      };

    }
  ]
});
