'use strict';

angular.module('search').component('search', {
  templateUrl: 'modules/search/search.template.html',
  controllerAs: 'search',
  bindings: {
    location: '<'
  },
  controller: ['$http', 'uiGmapGoogleMapApi', 'api',
    function SearchController($http, uiGmapGoogleMapApi, api) {
      var search = this;

      search.map = {
        center: { latitude: 45, longitude: -73 },
        zoom: 8,
        options: {
          scrollwheel: false
        },
        markers: []
      };

      api.get("/rides?location=" + search.location).then(function(response) {
        search.bikes = response.data;
        // var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < search.bikes.length; ++i) {
          var lat = search.bikes[i].lat_rnd;
          var lng = search.bikes[i].lng_rnd
          // var latlng = new google.maps.LatLng(lat, lng);

          // bounds.extend(latlng);
          search.bikes[i].coords = {
            latitude: lat,
            longitude: lng
          };
        }

        uiGmapGoogleMapApi.then(function(maps) {
          // console.log(maps);
        });

        search.map.center = {
          latitude: search.bikes[0].lat_rnd,
          longitude: search.bikes[0].lng_rnd
        }
      })

    }
  ]
});