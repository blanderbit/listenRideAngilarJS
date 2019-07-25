'use strict';

angular.module('cityLanding',[]).component('cityLanding', {
  templateUrl: 'app/modules/seo/city-landing.template.html',
  controllerAs: 'cityLanding',
  controller: ['$translate', '$translatePartialLoader', '$stateParams', '$state', 'api', 'ENV', 'bikeOptions', 'ngMeta', 'mapConfigs',
    function cityLandingController($translate, $tpl, $stateParams, $state, api, ENV, bikeOptions, ngMeta, mapConfigs) {
      var cityLanding = this;

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

        // invocations
        fetchData();
        getInfoData();
        slickConfig();
      };

      function fetchData() {
        var lng = $translate.preferredLanguage();
        var ISLANDS = ['Usedom', 'Sylt', 'Mallorca', 'Lanzarote'];

        api.get('/seo_page?city=' + cityLanding.city + '&lng=' + lng).then(
          function (success) {
            cityLanding.data = success.data;
            cityLanding.location = cityLanding.city;
            cityLanding.translatedCity = cityLanding.data.city_names[lng] ? cityLanding.data.city_names[lng] : cityLanding.city;
            cityLanding.loading = false;
            cityLanding.headerTranslation = _.includes(ISLANDS, cityLanding.data.city) ? 'seo.header-2' : 'seo.header';

            var minPrice = parseInt(_.minBy(cityLanding.data.bikes, 'price_from').price_from);
            ngMeta.setTitle($translate.instant('meta.seo.city-title', { location: cityLanding.location }));
            ngMeta.setTag("description", $translate.instant('meta.seo.city-description', { location: cityLanding.location, minPrice: minPrice }));
            // TODO: emporary monkeypatch for backend not returning nil values
            if (cityLanding.data.explore.title.startsWith("Main explore title")) {
              cityLanding.data.explore = null;
            }
            if (cityLanding.data.texts.main.title.startsWith("Example main title")) {
              cityLanding.data.texts = null;
            }
            if (cityLanding.data.header_image == "example") {
              cityLanding.data.header_image = "app/assets/ui_images/static/lnr_trust_and_safety.jpg";
            }
            // End

          },
          function (error) {
            $state.go('404');
          }
        );
      }

      function getInfoData() {

        cityLanding.info = [
          {
            title: "Bike rental, made easy",
            description: "Search & rent a bike in mere seconds. </br>No more cash, phone calls or emails.",
            icon: "app/assets/ui_icons/icn_green_energy.svg"
          },
          {
            title: "Variety of choice, everywhere",
            description: "We’re proud of offering 323 rental bikes </br>in Berlin, and 852 in Germany.",
            icon: "app/assets/ui_icons/icn_bike_nature.svg"
          },
          {
            title: "It`s insured: ride free, ride hard",
            description: "All bikes are insured for the rental period.</br> If you have any questions, our team will be with you.",
            icon: "app/assets/ui_icons/icn_insurance_protection.svg"
          }
        ];
      }

      function slickConfig() {
        cityLanding.slickConfig = {
          enabled: true,
          ease: 'ease-in-out',
          speed: '500',
          infinite: false,
          slidesToShow: 4,
          prevArrow: "<button class='slick-arrow_prev'><i class='fa fa-chevron-left'></i></button>",
          nextArrow: "<button class='slick-arrow_next'><i class='fa fa-chevron-right'></i></button>"
        };
      }

      function swiperConfig () {

        cityLanding.mySwiper = new Swiper ('.swiper-container', {
          // Optional parameters
          //loop: true,
          paginationClickable: true,
          keyboardControl: true,

          // If we need pagination
          pagination: '.swiper-pagination',

          // Navigation arrows
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
        });
      }

      function onSearchClick() {
        $state.go('search', {location: cityLanding.location});
      }
    }
  ]
});
