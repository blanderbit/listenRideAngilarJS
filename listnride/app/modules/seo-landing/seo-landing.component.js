'use strict';

angular.module('seoLanding',[]).component('seoLanding', {
  templateUrl: 'app/modules/seo-landing/seo-landing.template.html',
  controllerAs: 'seoLanding',
  controller: ['$translate', 'api',
    function SeoLandingController($translate, api) {

      var seoLanding = this;
      seoLanding.featuredBikes = {};

      api.get("/featured").then(function(response) {
        seoLanding.featuredBikes = response.data.slice(0,4);
      });
    }
  ]
});
