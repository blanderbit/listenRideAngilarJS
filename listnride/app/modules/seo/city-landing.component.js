'use strict';

angular.module('cityLanding',[]).component('cityLanding', {
  templateUrl: 'app/modules/seo/city-landing.template.html',
  controllerAs: 'cityLanding',
  controller: ['$translate', '$translatePartialLoader', '$stateParams', '$state', 'api', 'ENV', 'bikeOptions', 'ngMeta',
    function cityLandingController($translate, $tpl, $stateParams, $state, api, ENV, bikeOptions, ngMeta) {
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
          link: 'home'
        },
        {
          title:'Berlin',
          link: `cityLanding({ city: '${$stateParams.city}'})`
        }];

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

      function onSearchClick() {
        $state.go('search', {location: cityLanding.location});
      }
    }
  ]
});
