'use strict';

angular.module('categoryLanding',[]).component('categoryLanding', {
  templateUrl: 'app/modules/seo/category-landing.template.html',
  controllerAs: 'categoryLanding',
  controller: ['$translate', '$translatePartialLoader', '$stateParams', '$state', '$http', 'api',
    function CategoryLandingController($translate, $tpl, $stateParams, $state, $http, api) {

      var categoryLanding = this;
      $tpl.addPart(ENV.staticTranslation);
      categoryLanding.bikes = {};
      categoryLanding.loading = true;

      // api.get('/seo_pages?url=' + $stateParams.pageTitle).then(
      api.get('/seo_pages?city=berlin&lang=en').then(
        function (success) {
          console.log(success.data);
          categoryLanding.data = success.data;
          categoryLanding.location = categoryLanding.data.city;
          categoryLanding.loading = false;
        },
        function (error) {
          $state.go('404');
        }
      );

      categoryLanding.onSearchClick = function() {
        $state.go('search', {location: categoryLanding.location});
      };

      function determineParams() {
        switch($stateParams.pageTitle) {
          case 'ebikes-berlin': return {city: "Berlin", category_id: "5"};
          case 'roadbikes-berlin': return {city: "Berlin", category_id: "2"};
          case 'ebikes-munich': return {city: "Munich", category_id: "5"};
          case 'roadbikes-munich': return {city: "Munich", category_id: "2"};
          case 'ebikes-hamburg': return {city: "Hamburg", category_id: "5"};
          case 'roadbikes-hamburg': return {city: "Hamburg", category_id: "2"};
          case 'ebikes-vienna': return {city: "Vienna", category_id: "5"};
          case 'roadbikes-vienna': return {city: "Vienna", category_id: "2"};
          case 'mountainbikes-vienna': return {city: "Vienna", category_id: "3"};
          case 'roadbikes-mallorca': return {city: "Mallorca", category_id: "2"};
          case 'mountainbikes-mallorca': return {city: "Mallorca", category_id: "3"};
          case 'citybikes-amsterdam': return {city: "Amsterdam", category_id: "1"};
          case 'cargobikes-amsterdam': return {city: "Amsterdam", category_id: "6"};
        }
      }
    }
  ]
});
