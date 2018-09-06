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
        { name: "Germany", locations: ["Berlin", "Hamburg", "Dusseldorf", "Munich", "Stuttgart", "Dresden", "Bremen", "Frankfurt"]},
        { name: "Italy", locations: ["Florence", "Bologna", "Milan", "Turin", "Olbia", "Palermo", "Rome", "Trentino"]},
        { name: "Spain", locations: ["Seville", "Barcelona", "Madrid", "Valencia", "Palma de Majorca", "Arrecife", "Puerto santa cruz", "Las Palmas"]},
        { name: "Netherlands", locations: ["Amsterdam", "Den Haag", "Utrecht", "Apeldoorn"]},
        { name: "Switzerland", locations: ["Zurich", "Lugano", "Basel", "Lausanne"]},
        { name: "Portugal", locations: ["Lisbon", "Faro"]},
        { name: "South Africa", locations: ["Cape Town"]}
      ]
    }
  ]
});
