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
        zoom: 11,
        options: {
          scrollwheel: false
        },
        markers: []
      };

      uiGmapGoogleMapApi.then(function(maps) {
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({'address': search.location}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK &&
            status != google.maps.GeocoderStatus.ZERO_RESULTS) {
            search.map.center = {
              latitude: results[0].geometry.location.lat(),
              longitude: results[0].geometry.location.lng()
            };
          }
        });
      });

      api.get("/rides?location=" + search.location).then(function(response) {
        search.bikes = response.data;
        
        for (var i = 0; i < search.bikes.length; ++i) {
          var lat = search.bikes[i].lat_rnd;
          var lng = search.bikes[i].lng_rnd
          search.bikes[i].coords = {
            latitude: lat,
            longitude: lng
          };
        }

        if (search.bikes.length > 0) {
          search.map.center = {
            latitude: search.bikes[0].lat_rnd,
            longitude: search.bikes[0].lng_rnd
          }
        }
      })

    }
  ]
});