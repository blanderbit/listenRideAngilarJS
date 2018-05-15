'use strict';

angular.module('categoryLanding', []).component('categoryLanding', {
  templateUrl: 'app/modules/seo/category-landing.template.html',
  controllerAs: 'categoryLanding',
  controller: ['$translate', '$translatePartialLoader', '$stateParams', '$state', '$filter', 'api', 'ENV',
    function CategoryLandingController($translate, $tpl, $stateParams, $state, $filter, api, ENV) {
      var categoryLanding = this;

      categoryLanding.$onInit = function () {
        $tpl.addPart(ENV.staticTranslation);

        // capitalize city name in URL
        categoryLanding.city = capitalize($stateParams.city);

        // take category number from category (only english) name in URL
        var categoryId = $filter('categorySeo')($stateParams.category);
        if (!categoryId) $state.go('404');

        categoryLanding.bikes = {};
        categoryLanding.loading = true;
        categoryLanding.category = $filter('category')(categoryId);

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
      };

      // function to capitalize a String
      function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
      }

    }
  ]
});