'use strict';

angular.module('cityLanding',[]).component('cityLanding', {
  templateUrl: 'app/modules/seo/city-landing.template.html',
  controllerAs: 'cityLanding',
  controller: ['$translate', '$translatePartialLoader', '$stateParams', '$state', '$http', 'api', 'ENV',
    function cityLandingController($translate, $tpl, $stateParams, $state, $http, api, ENV) {

      var cityLanding = this;
      var city = $stateParams.pageTitle;
      $tpl.addPart(ENV.staticTranslation);
      cityLanding.bikes = {};
      cityLanding.loading = true;

      // api.get('/seo_pages?url=' + $stateParams.pageTitle).then(
      api.get('/seo_pages?city='+city+'&lang=' + $translate.preferredLanguage()).then(
        function (success) {
          // if (success.data.errors) {
            // $state.go('404');
          // } else {
            cityLanding.data = success.data;
            cityLanding.location = cityLanding.data.city;
            cityLanding.loading = false;
          // }
        },
        function (error) {
          $state.go('404');
        }
      );

      cityLanding.onSearchClick = function() {
        $state.go('search', {location: cityLanding.location});
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
