'use strict';

angular.module('bikeSorter', [])
  .component('bikeSorter', {
    templateUrl: 'app/modules/shared/bike-sorter/bike-sorter.template.html',
    controllerAs: 'bikeSorter',
    bindings: {
      bikes: '=',
      titles: '=',
      categorizedBikes: '=',
      location: '<',
    },
    controller: ['orderByFilter', function BikeSorter(orderBy) {
      var bikeSorter = this;
      
      bikeSorter.locationBreakpoints = [0.05, 0.1, 0.5];

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
        bikeSorter.categorizedBikes = [];
        bikeSorter.titles = ["Less than 0.005 km", "Less than 0.01 km", "Less than 0.05 km", "More than 0.05 km"];

        ///////
        // bikeSorter.newCatBikes = [];
        // for (var breakpoint in bikeSorter.locationBreakpoints) {
        //   bikeSorter.newCatBikes.push({
        //     title: bikeSorter.titles[breakpoint],
        //     bikes: []
        //   })
        // }

        // for (var bike in bikeSorter.bikes) {
        //   for (breakpoint in bikeSorter.locationBreakpoints) {
        //     if (bikeSorter.bikes[bike].latLngDiff < bikeSorter.locationBreakpoints[breakpoint]) {
        //       bikeSorter.newCatBikes[breakpoint].bikes.push(bikeSorter.bikes[bike]);
        //       break;
        //     }
        //   }
        // }

        // for (var bikeCat in bikeSorter.newCatBikes) {
        //   if (bikeSorter.newCatBikes[bikeCat].bikes.length == 0) {
        //     bikeSorter.newCatBikes.splice(bikeCat, 1);
        //   }
        // }

        // bikeSorter.categorizedBikes = bikeSorter.newCatBikes;
        //////


        for (var brk in bikeSorter.locationBreakpoints) {
          var filterBikesBrk = [];
          for (var bike in bikeSorter.bikes) {
            
            console.log("bike distnace: ", bikeSorter.bikes[bike].latLngDiff);
            console.log("break distnace: ", bikeSorter.locationBreakpoints[brk]);
            
            if (bikeSorter.bikes[bike].latLngDiff < bikeSorter.locationBreakpoints[brk]) {
              filterBikesBrk.push(bikeSorter.bikes.splice(bike, 1));
            }
            // else {
            //   filterBikesBrk.push(bikeSorter.bikes.splice(bike, 1));
            // }
          }
          if (filterBikesBrk.length > 0 ) {bikeSorter.categorizedBikes.push(filterBikesBrk);}
          if (bikeSorter.bikes.length > 0) {bikeSorter.categorizedBikes.push(bikeSorter.bikes);}
        // }
        
        
        
        // bikeSorter.categorizedBikes.push([bikeSorter.bikes[0]]);
        // bikeSorter.categorizedBikes.push([bikeSorter.bikes[1]]);
        // bikeSorter.categorizedBikes.push([bikeSorter.bikes[2]]);
        // bikeSorter.categorizedBikes.push([bikeSorter.bikes[3]]);
        // bikeSorter.categorizedBikes.push([bikeSorter.bikes[4]]);

        console.log("Less than 0.005 km: ", bikeSorter.categorizedBikes[0]);
        console.log("Less than 0.01 km: ", bikeSorter.categorizedBikes[1]);
        console.log("Less than 0.05 km: ", bikeSorter.categorizedBikes[2]);
        console.log("More than 0.05 km: ", bikeSorter.categorizedBikes[3]);
      };
      
      bikeSorter.priceSorter = function (ascending) {
        bikeSorter.bikes = orderBy(bikeSorter.bikes, 'price_from', ascending);
      };
    }]
  });