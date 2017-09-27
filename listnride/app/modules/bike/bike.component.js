'use strict';

angular.module('bike',[]).component('bike', {
  templateUrl: 'app/modules/bike/bike.template.html',
  controllerAs: 'bike',
  controller: ['api', '$stateParams', '$mdDialog', '$mdMedia', '$translate', '$filter', 'ngMeta',
    function BikeController(api, $stateParams, $mdDialog, $mdMedia, $translate, $filter, ngMeta) {
      var bike = this;

      bike.mapOptions = {
        lat: 0,
        lng: 0,
        zoom: 14,
        radius: 500,
        scrollwheel: false,
        draggable: false,
        gestureHandling: 'cooperative'
      };

      bike.mobileCalendar = function() {
        return !!($mdMedia('xs') || $mdMedia('sm'));
      };

      // TODO: move all api calls in service
      // it is really difficult to test api calls from controller.
      // controller should only be used for data binding and 
      // not for logic and api calls
      api.get('/rides/' + $stateParams.bikeId).then(
        function(response) {
          bike.showAll = false;
          bike.data = response.data;
          bike.mapOptions.lat = bike.data.lat_rnd;
          bike.mapOptions.lng = bike.data.lng_rnd;

          bike.prices = {
            one_day: 20,
            three_days: 54,
            seven_days: 112
          };

          var metaData = {
            name: bike.data.name,
            brand: bike.data.brand,
            description: bike.data.description,
            location: bike.data.city,
            category: $filter('category')(bike.data.category)
          };

          ngMeta.setTitle($translate.instant("bike.meta-title", metaData));
          ngMeta.setTag("description", $translate.instant("bike.meta-description", metaData));
          console.log(bike.data);
        },
        function(error) {
          console.log("Error retrieving bike", error);
        }
      );

      bike.showGalleryDialog = function(event) {
        event.stopPropagation();
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

      bike.showCalendarDialog = function(event) {
        $mdDialog.show({
          controller: CalendarDialogController,
          controllerAs: 'calendarDialog',
          templateUrl: 'app/modules/bike/calendar/calendarDialog.template.html',
          // contentElement: '#calendar-dialog',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: true // Only for -xs, -sm breakpoints.
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
        galleryDialog.slickConfig = {
          enabled: true,
          autoplay: true,
          draggable: true,
          autoplaySpeed: 12000,
          ease: 'ease-in-out',
          speed: '500',
          dots: true,
          prevArrow: "<div class='arrow arrow-prev'></div>",
          nextArrow: "<div class='arrow arrow-next'></div>"
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
