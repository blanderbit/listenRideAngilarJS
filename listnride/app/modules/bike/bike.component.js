'use strict';

angular.module('bike',[]).component('bike', {
  templateUrl: 'app/modules/bike/bike.template.html',
  controllerAs: 'bike',
  controller: ['api', '$stateParams', '$localStorage', '$mdDialog', '$mdMedia', '$translate', '$filter', '$state', 'ngMeta', 'price', 'mapConfigs', 'helpers', 'bikeCluster',
    function BikeController(api, $stateParams, $localStorage, $mdDialog, $mdMedia, $translate, $filter, $state, ngMeta, price, mapConfigs, helpers, bikeCluster) {
      var bike = this;

      bike.$onInit = function() {
        // variables
        bike.colorScheme = mapConfigs.colorScheme();
        bike.owner = {};
        bike.owner.display_name = '';
        bike.owner.picture = '';
        bike.mapOptions = {
          lat: 0,
          lng: 0,
          zoom: 14,
          radius: 500,
          scrollwheel: false,
          draggable: false,
          gestureHandling: 'cooperative'
        };

        // methods
        bike.isMobileCalendarView = isMobileCalendarView;
        bike.hasAccessories = hasAccessories;
        bike.showAttribute = showAttribute;
        bike.showGalleryDialog = showGalleryDialog;
        bike.showCalendarDialog = showCalendarDialog;

        // invocations
        getBikeData();
      }


      // TODO: Refactor image savings (.jpg / .JPG)
      // bike.heroshot = function () {
      //   if (bike.data) {
      //     var heroshot = bike.isMobileCalendarView() ? bike.data.image_file_1.small.url : bike.data.image_file_1.large.url;
      //     return heroshot;
      //   }
      // };

      function getBikeData() {
        // TODO: move all api calls in service
        // it is really difficult to test api calls from controller.
        // controller should only be used for data binding and
        // not for logic and api calls
        api.get('/rides/' + $stateParams.bikeId).then(
          function (response) {
            bike.showAll = false;
            bike.data = response.data.current;
            bike.is_owner = bike.data.user.id === $localStorage.userId;
            bike.owner.display_name = setName();
            bike.owner.picture = setPicture();
            bike.mapOptions.lat = bike.data.lat_rnd;
            bike.mapOptions.lng = bike.data.lng_rnd;
            $translate($filter('category')(bike.data.category)).then(
              function (translation) {
                bike.category = translation;
              }
            );

            // CLUSTER BIKE LOGIC
            bike.defaultSize = $stateParams.size || bike.data.size;
            if (bike.data.is_cluster) {
              bike.cluster = response.data.cluster;
              bike.availableSizes = bike.cluster.sizes;

              // remove primary bike from variations array
              bike.cluster.variations = _.filter(bike.cluster.variations, function (variant) {
                return variant.id !== bike.data.id;
              });

              bikeCluster.getSizeTranslations(bike.availableSizes);

              // change some params to cluster merged params
              bike.data.accessories = bike.cluster.accessories;
              bike.data.ratings = bike.cluster.ratings;
            }

            // EVENT BIKE LOGIC

            // dummy data
            // bike.event = {
            //   id: 35,
            //   name: 'Cycling World',
            //   date: '23032019',
            //   duration: 2,
            //   type: 'slot',
            //   slot_range: 2,
            //   insurance: false
            // }

            bike.isSlotableEvent = _.indexOf([35,36], bike.data.family) !== -1;
            bike.isTwoHoursEventBike = bike.data.family === 35; // cwd event page
            bike.isThreeHoursEventBike = bike.data.family === 36; // 8bar event page


            // META
            var metaData = {
              name: bike.data.name,
              brand: bike.data.brand,
              description: bike.data.description,
              location: bike.data.city,
              category: $translate.instant($filter('category')(bike.data.category))
            };

            ngMeta.setTitle($translate.instant("bike.meta-title", metaData));
            ngMeta.setTag("description", $translate.instant("bike.meta-description", metaData));
            ngMeta.setTag("og:image", bike.data.image_file.url);
          },
          function (error) {
            $state.go('404');
          }
        );
      }

      function isMobileCalendarView() {
        return !!($mdMedia('xs') || $mdMedia('sm'));
      };

      function hasAccessories() {
        return bike.data && bike.data.accessories && _.keys(bike.data.accessories).length;
      }


      function showAttribute(attr) {
        return !(attr == false || attr === null || attr === 'null' || typeof attr === 'undefined');
      };

      function showGalleryDialog(event) {
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

      function showCalendarDialog(event) {
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

      function setName() {
        if (bike.data.business) {
          if (!bike.is_owner) {
            return $translate.instant('shared.local-business')
          } else {
            return bike.data.business.company_name
          }
        } else {
          return bike.data.user.first_name
        }
      }

      function setPicture() {
        if (bike.data.business && !bike.is_owner) {
          return 'app/assets/ui_icons/lnr_shop_avatar.svg'
        } else {
          return bike.data.user.profile_picture.profile_picture.url
        }
      }

      function GalleryDialogController($mdDialog, bikeData) {
        var galleryDialog = this;
        galleryDialog.image_1 = bikeData.image_file_1.url;
        galleryDialog.image_2 = bikeData.image_file_2.url;
        galleryDialog.image_3 = bikeData.image_file_3.url;
        galleryDialog.image_4 = bikeData.image_file_4.url;
        galleryDialog.image_5 = bikeData.image_file_5.url;
        galleryDialog.hide = function() {
          $mdDialog.hide();
        };
        galleryDialog.slickConfig = {
          enabled: true,
          autoplay: true,
          draggable: true,
          autoplaySpeed: 12000,
          ease: 'ease-in-out',
          speed: '500',
          dots: true,
          prevArrow: "<div class='slick-arrow slick-arrow_prev'></div>",
          nextArrow: "<div class='slick-arrow slick-arrow_next'></div>"
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
