(function(){
'use strict';
angular.module('bike', []).component('bike', {
  templateUrl: 'app/modules/bike/bike.template.html',
  controllerAs: 'bike',
  controller: ['api', '$stateParams', '$mdDialog', '$mdMedia', 'NgMap',
    function BikeController(api, $stateParams, $mdDialog, $mdMedia, NgMap) {
      var bike = this;

      bike.mapOptions = {
        lat: 0,
        lng: 0,
        zoom: 14,
        radius: 500
      };

      bike.mobileCalendar = function() {
        if ($mdMedia('xs') || $mdMedia('sm')) {
          return true;
        }
        else {
          return false;
        }
      };

      api.get('/rides/' + $stateParams.bikeId).then(
        function(response) {
          bike.data = response.data;
          bike.mapOptions.lat = bike.data.lat_rnd;
          bike.mapOptions.lng = bike.data.lng_rnd;
        },
        function(error) {
          console.log("Error retrieving bike", error);
        }
      );

      bike.showGalleryDialog = function(event) {
        $mdDialog.show({
          controller: GalleryDialogController,
          controllerAs: 'galleryDialog',
          templateUrl: 'app/modules/bike/galleryDialog.template.html',
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

      bike.showCalendarDialog = function() {
        $mdDialog.show({
          controller: CalendarDialogController,
          controllerAs: 'calendarDialog',
          templateUrl: 'app/modules/bike/calendarDialog.template.html',
          // contentElement: '#calendar-dialog',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: true // Only for -xs, -sm breakpoints.
        });
      }

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

      var CalendarDialogController = function() {
        var calendarDialog = this;
        calendarDialog.bike = bike;

        calendarDialog.hide = function() {
          $mdDialog.hide();
        }
      }
    }
  ]
});
})();