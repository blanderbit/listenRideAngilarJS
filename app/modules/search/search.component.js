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

      search.sizeFilter = {
        size: ""
      };

      search.categoryFilter = {
        allterrain: false,
        city: false,
        electric: false,
        kids: false,
        race: false,
        special: false
      };

      search.sizeOptions = [
        {value: "", label: "-"},
        {value: 155, label: "155 - 165"},
        {value: 165, label: "165 - 175"},
        {value: 175, label: "175 - 185"},
        {value: 185, label: "185 - 195"},
        {value: 195, label: "195 - 205"}
      ];

      search.mapOptions = {
        lat: 40,
        lng: -74,
        zoom: 1
      };

      NgMap.getMap().then(function(map) {
        search.map = map;
      });

      search.showBikeWindow = function(evt, bikeId) {
        search.selectedBike = search.bikes.find(function(bike) {
          return bike.id == bikeId;
        })
        search.map.showInfoWindow('mapWindow', this);
      };

      api.get("/rides?location=" + search.location).then(function(response) {
        search.bikes = response.data;
        // console.log(search.bikes);

        if (search.bikes.length > 0) {
          search.mapOptions.lat = search.bikes[0].lat_rnd;
          search.mapOptions.lng = search.bikes[0].lng_rnd;
          search.mapOptions.zoom = 10;
        }
      });

    }
  ]
});