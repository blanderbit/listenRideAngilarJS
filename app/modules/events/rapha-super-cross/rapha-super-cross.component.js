'use strict';

angular.module('raphaSuperCross').component('raphaSuperCross', {
  templateUrl: 'app/modules/events/rapha-super-cross/rapha-super-cross.template.html',
  controllerAs: 'raphaSuperCross',
  controller: ['NgMap', 'api',
    function RaphaSuperCrossController(NgMap, api) {
      var raphaSuperCross = this;

      raphaSuperCross.mapOptions = {
        lat: 40,
        lng: -74,
        zoom: 5
      };

      NgMap.getMap({id: "raphaSuperCrossMap"}).then(function(map) {
        raphaSuperCross.map = map;
      });

      raphaSuperCross.showBikeWindow = function(evt, bikeId) {
        if (raphaSuperCross.map) {
          raphaSuperCross.selectedBike = raphaSuperCross.bikes.find(function(bike) {
            return bike.id == bikeId;
          });

          raphaSuperCross.map.showInfoWindow('raphaSuperCrossMapWindow', this);
        }
      };

      raphaSuperCross.onMapClick = function(event) {
        if (raphaSuperCross.map) {
          raphaSuperCross.map.hideInfoWindow('raphaSuperCrossMapWindow');
          raphaSuperCross.selectedBike = undefined;
        }
      };

      populateBikes();

      function populateBikes() {
        api.get("/rides?family=7").then(function(response) {
          raphaSuperCross.bikes = response.data;

          if (raphaSuperCross.bikes.length > 0) {
            raphaSuperCross.mapOptions.lat = raphaSuperCross.bikes[0].lat_rnd;
            raphaSuperCross.mapOptions.lng = raphaSuperCross.bikes[0].lng_rnd;
            raphaSuperCross.mapOptions.zoom = 10;
          } else {
            raphaSuperCross.mapOptions.lat = 51.1657;
            raphaSuperCross.mapOptions.lng = 10.4515;
            raphaSuperCross.mapOptions.zoom = 4;
          }
        }, function(error) {
          console.log("Error retrieving bikes");
        });
      }

    }
  ]
});