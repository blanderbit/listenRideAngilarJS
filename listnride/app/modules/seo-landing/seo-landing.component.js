'use strict';

angular.module('seoLanding',[]).component('seoLanding', {
  templateUrl: 'app/modules/seo-landing/seo-landing.template.html',
  controllerAs: 'seoLanding',
  controller: ['$translate', '$translatePartialLoader', '$stateParams', '$state', '$http', 'api', 'ENV',
    function SeoLandingController($translate, $tpl, $stateParams, $state, $http, api, ENV) {

      var seoLanding = this;
      $tpl.addPart(ENV.staticTranslation);
      seoLanding.bikes = {};
      seoLanding.loading = true;

      api.get('/seo_pages?url=' + $stateParams.pageTitle).then(
        function (success) {
          seoLanding.data = success.data;
          seoLanding.bikes = success.data.bikes;
          seoLanding.loading = false;
        },
        function (error) {
          $state.go('404');
        }
      );

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
