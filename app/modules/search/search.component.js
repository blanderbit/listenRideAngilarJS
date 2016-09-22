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
      search.mapOptions = {
        lat: 40,
        lng: -74,
        zoom: 10
      };

      NgMap.getMap().then(function(map) {
        search.map = map;
      });

      search.showBikeWindow = function(evt, bikeId) {
        for (let i = 0; i < search.bikes.length; ++i) {
          if (search.bikes[i].id == bikeId) {
            search.selectedBike = search.bikes[i];
            break;
          }
        }
        search.map.showInfoWindow('mapWindow', this);
      };

      api.get("/rides?location=" + search.location).then(function(response) {
        search.bikes = response.data;
        if (search.bikes.length > 0) {
          search.mapOptions.lat = search.bikes[0].lat_rnd;
          search.mapOptions.lng = search.bikes[0].lng_rnd;
        }
      });

    }
  ]
});