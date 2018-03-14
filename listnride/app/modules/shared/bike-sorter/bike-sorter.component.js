'use strict';

angular.module('bikeSorter', [])
  .component('bikeSorter', {
    templateUrl: 'app/modules/shared/bike-sorter/bike-sorter.template.html',
    controllerAs: 'bikeSorter',
    bindings: {
      bikes: '=',
      location: '<',
    },
    controller: ['orderByFilter', function BikeSorter(orderBy) {
      var bikeSorter = this;

      function deg2rad(deg) {
        return deg * (Math.PI / 180);
      }

      function distanceUsingHaversine(lat_rnd, lng_rnd) {
        // Radius of the earth in km
        var R = 6371;
        var dLat = deg2rad(bikeSorter.location.lat - lat_rnd);
        var dLon = deg2rad(bikeSorter.location.lng - lng_rnd);
        var a = 0;
        a += Math.sin(dLat / 2) * Math.sin(dLat / 2);
        a += Math.cos(deg2rad(lat_rnd));
        a *= Math.cos(deg2rad(bikeSorter.location.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
      }

      bikeSorter.locationSorter = function () {
        for (var index in bikeSorter.bikes) {
          if (Object.prototype.hasOwnProperty.call(bikeSorter.bikes, index)) {
            var d = distanceUsingHaversine(bikeSorter.bikes[index].lat_rnd, bikeSorter.bikes[index].lng_rnd);
            bikeSorter.bikes[index].latLngDiff = d;
          }
        }
        bikeSorter.bikes = orderBy(bikeSorter.bikes, 'latLngDiff', false);
        console.log("loc sorted bikes: ", bikeSorter.bikes);
      };

      bikeSorter.priceSorter = function (ascending) {
        bikeSorter.bikes = orderBy(bikeSorter.bikes, 'price_from', ascending);
      };
    }]
  });