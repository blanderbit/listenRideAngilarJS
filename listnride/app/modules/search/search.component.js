'use strict';

angular.module('search',[]).component('search', {
  templateUrl: 'app/modules/search/search.template.html',
  controllerAs: 'search',
  bindings: {
    location: '<'
  },
  controller: ['$translate', '$stateParams', '$state', 'NgMap', 'ngMeta', 'api', 'bikeOptions',
    function SearchController($translate, $stateParams, $state, NgMap, ngMeta, api, bikeOptions) {
      var search = this;
      search.$onInit = function() {
        // methods
        search.location = $stateParams.location;
        search.showBikeWindow = showBikeWindow;
        search.placeChanged = placeChanged;
        search.onButtonClick = onButtonClick;
        search.onSizeChange = onSizeChange;
        search.onCategoryChange = onCategoryChange;
        search.onMapClick = onMapClick;
        search.clearData = clearData;
        search.onMapClick = onMapClick;
        search.onBikeHover = onBikeHover;
        
        // properties
        search.date = {}
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
        search.sizeOptions = bikeOptions.sizeOptionsForSearch();
        $translate('search.all-sizes').then(function (translation) {
          search.sizeOptions[0].label = translation;
        });
        search.mapOptions = {
          lat: 40,
          lng: -74,
          zoom: 5
        };
        
        // invocatons
        setMetaTags(search.location);
        populateBikes(search.location);
        initializeGoogleMap();
      };
      
      function onMapClick () {
        if (search.map) {
          search.map.hideInfoWindow('searchMapWindow');
          search.selectedBike = undefined;
        }
      }

      // show bike card in maps on card hover
      function onBikeHover (bike, toShow) {
        if (search.map) {
          search.selectedBike = bike;
          if (toShow === true) {
            search.map.showInfoWindow('searchMapWindow', search.map.markers[bike.id]);
          } else if (toShow === false) {
            search.map.hideInfoWindow('searchMapWindow');
          }
        }
      }

      function showBikeWindow(evt, bikeId) {
        if (search.map) {
          search.selectedBike = search.bikes.find(function(bike) {
            return bike.id === bikeId;
          });

          search.map.showInfoWindow('searchMapWindow', this);
        }
      }

      function placeChanged(place) {
        var location = place.formatted_address || place.name;
        $state.go(
          // current state
          $state.current,
          // state params
          { location: location },
          // route options
          // do not remove inherit prop, else map tiles stop working
          { notify: false }
        );
        search.location = location;
        setMetaTags(location);
        populateBikes(location);
      }

      function onButtonClick() {
        $state.go(
          // current state
          $state.current,
          // state params
          { location: search.location },
          // route options
          // do not remove inherit prop, else map tiles stop working
          { notify: false }
        );
        populateBikes(search.location);
      }

      function onSizeChange() {
        $state.go(
          // current state
          $state.current,
          // state params
          { size: search.sizeFilter.size },
          // route options
          // do not remove inherit prop, else map tiles stop working
          { notify: false }
        );
      }

      function onCategoryChange(category) {
        var categoryMap = {};
        categoryMap[category] = search.categoryFilter[category];
        $state.go(
          // current state
          $state.current,
          // state params
          categoryMap,
          // route options
          // do not remove inherit prop, else map tiles stop working
          { notify: false }
        );
      }

      function onMapClick() {
        if (search.map) {
          search.map.hideInfoWindow('searchMapWindow');
          search.selectedBike = undefined;
        }
      }

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
        });
      }

      function setMetaTags(location) {
        var data = {
          location: location
        };
        $translate("search.meta-title", data).then(
          function (translation) {
            ngMeta.setTitle(translation);
          }
        );
        ngMeta.setTitle($translate.instant("search.meta-title", data));
        ngMeta.setTag("description", $translate.instant("search.meta-description", data));
      }

      function clearData() {
      }
      
      function initializeGoogleMap () {
        NgMap.getMap({ id: "searchMap" }).then(function (map) {
          search.map = map;
        });
      }
    }
  ]
});
