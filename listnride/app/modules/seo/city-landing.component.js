'use strict';
import Swiper from 'swiper';

angular.module('cityLanding',[]).component('cityLanding', {
  templateUrl: 'app/modules/seo/city-landing.template.html',
  controllerAs: 'cityLanding',
  controller: ['$scope', '$translate', '$translatePartialLoader', '$stateParams', '$state', 'api', 'ENV', 'bikeOptions', 'ngMeta', 'mapConfigs', '$mdMedia', '$timeout', 'NgMap',
    function cityLandingController($scope, $translate, $tpl, $stateParams, $state, api, ENV, bikeOptions, ngMeta, mapConfigs, $mdMedia, $timeout, NgMap) {
      var cityLanding = this;
      const MOBILE_BIKE_COLUMNS = 3;
      const DESKTOP_BIKECOLUMNS = 6;

      cityLanding.$onInit = function() {
        $tpl.addPart(ENV.staticTranslation);
        cityLanding.city = _.capitalize($stateParams.city);
        cityLanding.bikes = {};
        cityLanding.loading = true;
        cityLanding.categories = [];
        cityLanding.headerTranslation = 'seo.header';
        cityLanding.breadcrumbs = [
        {
          title:'Home',
          route: 'home'
        },
        {
          title:`Rent bikes in ${cityLanding.city}`,
          route: `cityLanding({ city: '${$stateParams.city}'})`
        }];
        cityLanding.colorScheme = mapConfigs.colorScheme();
        cityLanding.mapOptions = {
          lat: 40,
          lng: -74,
          zoom: 5
        };
        cityLanding.showAllBikes = [];
        cityLanding.mobileScreen = $mdMedia('xs');
        cityLanding.bikesToShow = cityLanding.mobileScreen ? MOBILE_BIKE_COLUMNS : DESKTOP_BIKECOLUMNS;

        bikeOptions.allCategoriesOptionsSeo().then(function (resolve) {
          // without transport category
          cityLanding.categories = resolve.filter(function (item) {
            return item.url !== 'transport';
          });
          // parse url names to data names (change '-' to '_')
          _.forEach(cityLanding.categories, function (item) {
            item.dataName = item.url.replace(/-/i, '_')
          });
        });

        // methods
        cityLanding.onSearchClick = onSearchClick;
        cityLanding.tileRowspan = tileRowspan;
        cityLanding.tileColspan = tileColspan;
        cityLanding.loadAllBikes = loadAllBikes;

        // invocations
        fetchData();
        // TODO find another way to apply document ready function
        $timeout(function () {
          swiperConfig();
        }, 6000);
      };


      function fetchData() {
        var lng = $translate.preferredLanguage();
        var ISLANDS = ['Usedom', 'Sylt', 'Mallorca', 'Lanzarote'];

        api.get('/seo_page?city=' + cityLanding.city + '&lng=' + lng).then(
          function (success) {
            cityLanding.data = success.data;
            console.log(cityLanding.data)
            cityLanding.location = cityLanding.city;
            cityLanding.translatedCity = cityLanding.data.city_names[lng] ? cityLanding.data.city_names[lng] : cityLanding.city;
            cityLanding.loading = false;

            _.forEach(cityLanding.data.blocks, function(value, index) {
              cityLanding.bikes[index] = cityLanding.data.blocks[index].bikes.slice(0, cityLanding.bikesToShow);
            });

            ngMeta.setTitle($translate.instant(cityLanding.data.explore.meta_title));
            ngMeta.setTag("description", $translate.instant(cityLanding.data.explore.meta_description));

            // TODO: emporary monkeypatch for backend not returning nil values
            if (cityLanding.data.explore.title.startsWith("Main explore title")) {
              cityLanding.data.explore = null;
            }
            if (cityLanding.data.explore.description.startsWith("Example main title")) {
              cityLanding.data.texts = null;
            }
            // End

          },
          function (error) {
            $state.go('404');
          }
        );
      }

      function loadAllBikes(index) {
        cityLanding.showAllBikes[index] = true;
        cityLanding.bikes[index] = cityLanding.data.blocks[index].bikes;
      }

      function tileColspan(index) {
        if (index === 0 || index === 4) {
          return 3;
        } else if (index === 3 || index > 4){
          return 2;
        } else {
          return 1;
        };
      };

      function tileRowspan(index) {
        if (index === 1 || index === 2) {
          return 2;
        } else {
          return 1;
        };
      };

      function swiperConfig () {
        cityLanding.brandsSwiper = new Swiper ('#bikes-brands', {
          // Optional parameters
          keyboardControl: true,
          slidesPerView: 4,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          breakpoints: {
            768: {
              slidesPerView: 3
            },
            640: {
              slidesPerView: 2
            }
          }
        });

        cityLanding.testimonialsSwiper = new Swiper ('#testimonials-slider', {
          // Optional parameters
          slidesPerView: 3,
          spaceBetween: -50,
          keyboardControl: true,
          centeredSlides: true,
          loop: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          breakpoints: {
            // when window width is <= 320px
            639: {
              slidesPerView: 1,
              spaceBetween: 10
            }
          }
        });

        cityLanding.tipsSwiper = new Swiper ('#slider-fading', {
          // Optional parameters
          keyboardControl: true,
          centeredSlides: true,
          spaceBetween: 30,
          effect: 'fade',
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          autoplay: {
            delay: 5000
          },
        });

        cityLanding.tipsSwiper.on('slideChange', function () {
          cityLanding.slideIndex = cityLanding.tipsSwiper.activeIndex;
          // update scope one more time
          _.defer(function () {
            $scope.$apply();
          });
        });
      }

      function onSearchClick() {
        $state.go('search', {location: cityLanding.location});
      }
    }
  ]
});
