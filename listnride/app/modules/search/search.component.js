'use strict';

angular.module('search',[]).component('search', {
  templateUrl: 'app/modules/search/search.template.html',
  controllerAs: 'search',
  bindings: {
    location: '<'
  },
  controller: ['$translate', '$http', '$stateParams', '$state', 'NgMap', 'ngMeta', 'api',
    function SearchController($translate, $http, $stateParams, $state, NgMap, ngMeta, api) {
      var search = this;

      search.location = $stateParams.location;

      setMetaTags(search.location);

      search.sizeFilter = {
        size: $stateParams.size
      };

      search.categoryFilter = {
        allterrain: $stateParams.allterrain === "true",
        city: $stateParams.city === "true",
        ebikes: $stateParams.ebikes === "true",
        kids: $stateParams.kids === "true",
        race: $stateParams.race === "true",
        special: $stateParams.special === "true"
      };

      search.sizeOptions = [
        {value: "", label: "-"},
        {value: 155, label: "155 - 165"},
        {value: 165, label: "165 - 175"},
        {value: 175, label: "175 - 185"},
        {value: 185, label: "185 - 195"},
        {value: 195, label: "195 - 205"}
      ];

      $translate('search.all-sizes').then(function (translation) {
        search.sizeOptions[0].label = translation;
      });

      search.mapOptions = {
        lat: 40,
        lng: -74,
        zoom: 5
      };

      populateBikes(search.location);

      NgMap.getMap({id: "searchMap"}).then(function(map) {
        search.map = map;
      });

      search.showBikeWindow = function(evt, bikeId) {
        if (search.map) {
          search.selectedBike = search.bikes.find(function(bike) {
            return bike.id === bikeId;
          });

          search.map.showInfoWindow('searchMapWindow', this);
        }
      };

      search.placeChanged = function(place) {
        var location = place.formatted_address || place.name;
        $state.go('.', {location: location}, {notify: false});
        search.location = location;
        setMetaTags(location);
        populateBikes(location);
      };

      search.onButtonClick = function() {
        $state.go('.', {location: search.location}, {notify: false});
        populateBikes(search.location);
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

      function populateBikes(location) {
        search.bikes = undefined;

        api.get("/rides?location=" + location).then(function(response) {
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

      function setMetaTags(location) {
        var data = {
          location: location
        };
        console.log($translate.instant("search.meta-title", data));
        $translate("search.meta-title", data).then(
          function (translation) {
            ngMeta.setTitle(translation);
          }
        );
        ngMeta.setTitle($translate.instant("search.meta-title", data));
        ngMeta.setTag("description", $translate.instant("search.meta-description", data));
      }

    }
  ]
});
