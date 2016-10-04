'use strict';

angular.module('search').component('search', {
  templateUrl: 'app/modules/search/search.template.html',
  controllerAs: 'search',
  bindings: {
    location: '<'
  },
  controller: ['$http', '$stateParams', '$state', 'NgMap', 'api',
    function SearchController($http, $stateParams, $state, NgMap, api) {
      var search = this;

      search.location = $stateParams.location;

      search.sizeFilter = {
        size: $stateParams.size
      };

      search.categoryFilter = {
        allterrain: $stateParams.allterrain == "true",
        city: $stateParams.city == "true",
        ebikes: $stateParams.ebikes == "true",
        kids: $stateParams.kids == "true",
        race: $stateParams.race == "true",
        special: $stateParams.special == "true"
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
        zoom: 5
      };

      populateBikes();

      NgMap.getMap({id: "searchMap"}).then(function(map) {
        console.log(map, map.infoWindows.infoWindow);
        search.map = map;
      });

      search.showBikeWindow = function(evt, bikeId) {
        if (search.map) {
          search.selectedBike = search.bikes.find(function(bike) {
            return bike.id == bikeId;
          });

          search.map.showInfoWindow('searchMapWindow', this);
        }
      };

      search.onLocationChange = function() {
        // TODO: This is coding excrement.
        // use the angular way to do things.
        // fix the google autocomplete and all will work.
        var myLocation = document.querySelector("#autocompleteSearch").value;
        search.location = myLocation;
        $state.go('.', {location: myLocation}, {notify: false});
        search.bikes = undefined;
        populateBikes();
      };

      search.onSizeChange = function() {
        $state.go('.', {size: search.sizeFilter.size}, {notify: false});
      };

      search.onCategoryChange = function(category) {
        var categoryMap = {};
        categoryMap[category] = search.categoryFilter[category];
        $state.go('.', categoryMap, {notify: false});
      };

      search.onMapClick = function(event) {
        if (search.map) {
          search.map.hideInfoWindow('searchMapWindow');
          search.selectedBike = undefined;
        }
      };

      function populateBikes() {
        api.get("/rides?location=" + search.location).then(function(response) {
          search.bikes = response.data;

          if (search.bikes.length > 0) {
            search.mapOptions.lat = search.bikes[0].lat_rnd;
            search.mapOptions.lng = search.bikes[0].lng_rnd;
            search.mapOptions.zoom = 10;
          } else {
            search.mapOptions.lat = 51.1657;
            search.mapOptions.lng = 10.4515;
            search.mapOptions.zoom = 4;
          }
        }, function(error) {
          console.log("Error retrieving bikes");
        });
      }

    }
  ]
});