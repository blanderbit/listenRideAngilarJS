'use strict';

angular.module('bike').component('bike', {
  templateUrl: 'modules/bike/bike.template.html',
  controllerAs: 'bike',
  controller: ['api', '$stateParams', '$mdDialog', 'uiGmapGoogleMapApi',
    function BikeController(api, $stateParams, $mdDialog, uiGmapGoogleMapApi) {
      var bike = this;

      bike.map = {
          // center: { latitude: bike.data.lat_rnd, longitude: bike.data.lng_rnd },
          center: { latitude: 0, longitude: 0 },
          zoom: 12,
          options: {
            scrollwheel: false
          },
          markers: []
      };

      api.get('/rides/' + $stateParams.bikeId).then(function success(response) {
        console.log("Successfully retrieved Bike");
        bike.data = response.data;
        console.log(bike);
        console.log(bike.data.image_file_1.image_file_1.large.url);

        bike.map.center = {
          latitude: bike.data.lat_rnd,
          longitude: bike.data.lng_rnd
        }
        
      }, function error() {
        console.log("Error retrieving User");
      });

      bike.showGalleryDialog = function(event) {
        $mdDialog.show({
          controller: GalleryDialogController,
          controllerAs: 'galleryDialog',
          templateUrl: 'modules/bike/galleryDialog.template.html',
          locals: {
            bikeData: bike.data
          },
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: true // Changed in CSS to only be for XS sizes
        })
        .then(function(answer) {
          //
        }, function() {
          //
        });
      };

      function GalleryDialogController($mdDialog, bikeData) {
        var galleryDialog = this;
        galleryDialog.image_1 = bikeData.image_file_1.image_file_1.url;
        galleryDialog.image_2 = bikeData.image_file_2.image_file_2.url;
        galleryDialog.image_3 = bikeData.image_file_3.image_file_3.url;
        galleryDialog.image_4 = bikeData.image_file_4.image_file_4.url;
        galleryDialog.image_5 = bikeData.image_file_5.image_file_5.url;
        galleryDialog.hide = function() {
          $mdDialog.hide();
        }
      }
    }
  ]
});