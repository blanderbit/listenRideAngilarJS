'use strict';

angular.module('seoGrid', []).component('seoGrid', {
  templateUrl: 'app/modules/footer/seo-grid/seo-grid.template.html',
  controllerAs: 'seoGrid',
  controller: [
    '$scope',
    '$translate',
    function SeoGridController($scope, $translate) {
      var seoGrid = this;
    
      // Here the SEO locations / countries can be dynamically defined
      seoGrid.countries = [
        { name: "Germany", locations: ["Berlin", "Munich", "Hamburg", "Sylt"]},
        { name: "Germany", locations: ["Berlin", "Munich", "Hamburg", "Sylt"]},
        { name: "Germany", locations: ["Berlin", "Munich", "Hamburg", "Sylt"]},
        { name: "Germany", locations: ["Berlin", "Munich", "Hamburg", "Sylt"]},
        { name: "Germany", locations: ["Berlin", "Munich", "Hamburg", "Sylt"]},
        { name: "Germany", locations: ["Berlin", "Munich", "Hamburg", "Sylt"]}
      ]
    }
  ]
});
