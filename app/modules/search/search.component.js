'use strict';

angular.module('search').component('search', {
  templateUrl: 'modules/search/search.template.html',
  controllerAs: 'search',
  bindings: {
    location: '<'
  },
  controller: ['$http', 'NgMap', 'api',
    function SearchController($http, NgMap, api) {
      var search = this;

      NgMap.getMap().then(function(map) {
        console.log(map.getCenter());
        console.log('markers', map.markers);
        console.log('shapes', map.shapes);
      });

      api.get("/rides?location=" + search.location).then(function(response) {
        search.bikes = response.data;
      });

    }
  ]
});