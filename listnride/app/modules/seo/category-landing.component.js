'use strict';

angular.module('categoryLanding',[]).component('categoryLanding', {
  templateUrl: 'app/modules/seo/category-landing.template.html',
  controllerAs: 'categoryLanding',
  controller: ['$translate', '$translatePartialLoader', '$stateParams', '$state', '$http', '$filter', 'api', 'ENV',
    function CategoryLandingController($translate, $tpl, $stateParams, $state, $http, $filter, api, ENV) {

      var categoryLanding = this;
      categoryLanding.city = $stateParams.city.charAt(0).toUpperCase() + $stateParams.city.slice(1);
      var categoryId = $filter('categorySeo')($stateParams.category);
      if (categoryId == "") {
        $state.go('404');
      }

      $tpl.addPart(ENV.staticTranslation);
      categoryLanding.bikes = {};
      categoryLanding.loading = true;
      categoryLanding.category = $filter('category')(categoryId);

      api.get('/seo_page?city='+categoryLanding.city+'&cat='+categoryId+'&lng=' + $translate.preferredLanguage()).then(
        function (success) {
          categoryLanding.data = success.data;
          categoryLanding.location = categoryLanding.city;
          categoryLanding.loading = false;
        },
        function (error) {
          $state.go('404');
        }
      );

      categoryLanding.onSearchClick = function() {
        $state.go('search', {location: categoryLanding.location});
      };

    }
  ]
});
