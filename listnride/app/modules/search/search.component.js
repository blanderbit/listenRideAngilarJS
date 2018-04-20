'use strict';


/*
Structure of bike search component:

Search
      |__Filter
      |__Cardgrid
                 |__Sorter   
*/

angular.module('search',[]).component('search', {
  templateUrl: 'app/modules/search/search.template.html',
  controllerAs: 'search',
  bindings: {
    location: '<'
  },
  controller: ['$translate', '$stateParams','$state', '$timeout', 'NgMap', 'ngMeta', 'api',
    function SearchController($translate, $stateParams, $state, $timeout, NgMap, ngMeta, api) {
      var search = this;
      search.$onInit = function() {
        // methods
        search.location = $stateParams.location;
        search.showBikeWindow = showBikeWindow;
        search.placeChanged = placeChanged;
        search.onButtonClick = onButtonClick;
        search.onCategoryChange = onCategoryChange;
        search.onMapClick = onMapClick;
        search.onBikeHover = onBikeHover;
        search.populateBikes = populateBikes;
        search.addMoreItemsLimit = addMoreItemsLimit;
        search.filteredBikes = [];
        search.initialValues = {
          amount: '',
          sizes: [],
          categories: [],
          brand: '',
          date: {
            "start_date": '',
            "duration": ''
          }
        };
        
        // get initial filter values from url
        search.initialValues.sizes = $stateParams.sizes.split(',');
        search.initialValues.brand = $stateParams.brand;
        search.initialValues.categories = $stateParams.categories.split(',');
        search.initialValues.date = {
          "start_date": $stateParams.start_date,
          "duration": $stateParams.duration
        };

        search.limit = 15;
        search.mapOptions = {
          lat: 40,
          lng: -74,
          zoom: 5
        };
        
        // invocations
        populateBikes(search.location);
        setMetaTags(search.location);
        initializeGoogleMap();
      };

      search.updateState = function(params) {
        $state.go(
          $state.current,
          params,
          { notify: false }
        );
      }
      
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

      // TODO: rename this function. Not clear name.
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

      function populateBikes(location) {
        search.bikes = undefined;
        location = location ? location : $stateParams.location;

        var urlRequest = "/rides?location=" + location;
        if (search.initialValues.date && search.initialValues.date.start_date) {
          urlRequest += "&start_date=" + search.initialValues.date.start_date;
          urlRequest += "&duration=" + search.initialValues.date.duration;
        }

        api.get(urlRequest).then(function(response) {
          search.bikes = response.data.bikes;
          search.categorizedFilteredBikes = [{
            title: "All Bikes",
            bikes: search.bikes
          }];
          search.titles = [];
          search.latLng = response.data.location.geometry.location;
          search.locationBounds = response.data.location.geometry.viewport;

          NgMap.getMap({id: "searchMap"}).then(function(map) {
            map.fitBounds(correctBounds());
            map.setZoom(map.getZoom() + 1);
            // map.panToBounds(bounds);
          });

          if (search.bikes.length > 0) {
            search.mapOptions.lat = search.bikes[0].lat_rnd;
            search.mapOptions.lng = search.bikes[0].lng_rnd;
            // search.mapOptions.zoom = 11;
          } else {
            search.mapOptions.lat = 51.1657;
            search.mapOptions.lng = 10.4515;
            // search.mapOptions.zoom = 4;
          }
        }, function(error) {
        });
      }

      function correctBounds() {
        var bounds = new google.maps.LatLngBounds();
        if (!_.isEmpty(search.locationBounds)) {
          bounds = extendBounds(bounds, search.locationBounds.northeast.lat, search.locationBounds.northeast.lng);
          bounds = extendBounds(bounds, search.locationBounds.southwest.lat, search.locationBounds.southwest.lng);
        }

        for (var i = 0; i < 3; i++) { bounds = extendBounds(bounds, search.bikes[i].lat_rnd, search.bikes[i].lng_rnd) }
        return bounds
      }

      function extendBounds(bounds, lat, lng) {
        var loc = new google.maps.LatLng(lat, lng);
        bounds.extend(loc);
        return bounds
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
      
      function initializeGoogleMap() {
        // TODO: timeout needs to be replaced with a better solution
        $timeout(function(){
          NgMap.getMap({ id: "searchMap" }).then(function (map) {
            search.map = map;
          });
        }, 0);
      }

      function addMoreItemsLimit() {
        if (search.limit < search.bikes.length) {
          search.limit += 15;
        }
      }
    }
  ]
});
