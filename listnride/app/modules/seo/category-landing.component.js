'use strict';

angular.module('categoryLanding', []).component('categoryLanding', {
  templateUrl: 'app/modules/seo/category-landing.template.html',
  controllerAs: 'categoryLanding',
  controller: ['$translate', '$translatePartialLoader', '$stateParams', '$state', '$filter', 'api', 'ENV', 'bikeOptions', 'ngMeta',
    function CategoryLandingController($translate, $tpl, $stateParams, $state, $filter, api, ENV, bikeOptions, ngMeta) {
      var categoryLanding = this;

      categoryLanding.$onInit = function () {
        $tpl.addPart(ENV.staticTranslation);

        // capitalize city name in URL
        categoryLanding.city = $stateParams.city;

        // take category number from category (only english) name in URL
        var categoryId = $filter('categorySeo')($stateParams.category);
        if (!categoryId) $state.go('404');
        categoryLanding.category = $filter('category')(categoryId);

        categoryLanding.bikes = {};
        categoryLanding.loading = true;
        categoryLanding.categories = [];

        bikeOptions.allCategoriesOptionsSeo().then(function (resolve) {
          // without transport category
          categoryLanding.categories = resolve.filter(function (item) {
            return item.url !== 'transport';
          });
          // parse url names to data names (change '-' to '_')
          _.forEach(categoryLanding.categories, function (item) {
            item.dataName = item.url.replace(/-/i, '_')
          });
        });

        // methods
        categoryLanding.onSearchClick = onSearchClick;

        // invocations
        fetchData(categoryId);
      }

      function fetchData(categoryId) {
        api.get('/seo_page?city=' + categoryLanding.city + '&cat=' + categoryId + '&lng=' + $translate.preferredLanguage()).then(
          function (success) {
            categoryLanding.data = success.data;
            categoryLanding.location = categoryLanding.city;
            categoryLanding.loading = false;
            var minPrice = parseInt(_.minBy(categoryLanding.data.bikes, 'price_from').price_from);
            categoryLanding.categoryString = $translate.instant(categoryLanding.category).toLowerCase();
            ngMeta.setTitle($translate.instant('meta.seo.category-title', { location: categoryLanding.location, category: categoryLanding.categoryString }));
            ngMeta.setTag("description", $translate.instant('meta.seo.category-description', { location: categoryLanding.location, minPrice: minPrice, category: categoryLanding.categoryString }));
          },
          function (error) {
            $state.go('404');
          }
        );
      }

      function onSearchClick() {
        $state.go('search', {
          location: categoryLanding.location
        });
      }
    }
  ]
});
