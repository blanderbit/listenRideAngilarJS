'use strict';

angular.module('search').component('search', {
  templateUrl: 'modules/search/search.template.html',
  controllerAs: 'search',
  controller: ['$http', 'uiGmapGoogleMapApi',
    function SearchController($http, uiGmapGoogleMapApi) {
      var search = this;
      search.map = {
        center: { latitude: 45, longitude: -73 },
        zoom: 8,
        options: {
          scrollwheel: false
        }
      };
      
      uiGmapGoogleMapApi.then(function(maps) {

      });
    }
  ]
});