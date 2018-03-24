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
    controller: ['orderByFilter', 'bikeSorterService', function BikeSorter(orderBy, bikeSorterService) {
      var bikeSorter = this;

      // breakpoints for location
      var locationBkpt = [0.25, 0.5, 1.0, 999];
      // breakpoints for price

      /*
       * sort bike w.r.t their distance from user location
       * categorize the bikes based on breakpoints
       */
      bikeSorter.locationSorter = function () {
        // generate titles for location based sorting
        var titles = bikeSorterService.getLocationTitles(locationBkpt);
        // sort, populate and purge bikes
        var bikes = bikeSorterService.sortLocationBikes(bikeSorter.bikes, bikeSorter.location, orderBy);
        bikes = bikeSorterService.populateLocationBikes(locationBkpt, bikes, titles);
        bikes = bikeSorterService.purgeLocationBikes(bikes);
        // update models
        bikeSorter.titles = titles;
        bikeSorter.categorizedBikes = bikes;
      };

      bikeSorter.priceSorter = function (ascending) {
        bikeSorter.bikes = orderBy(bikeSorter.bikes, 'price_from', ascending);
      };
    }],
  })
  .factory('bikeSorterService', [function () {
    var bikeSorterService = {
      // conversion from degree two radian
      convertDegree2Radian: function (deg) {
        return deg * (Math.PI / 180);
      },
      // find distance between two points using haversine formula
      distanceUsingHaversine: function (lat, lng, lat_rnd, lng_rnd) {
        // Radius of the earth in km
        var R = 6371;
        var dLat = bikeSorterService.convertDegree2Radian(lat - lat_rnd);
        var dLon = bikeSorterService.convertDegree2Radian(lng - lng_rnd);
        var a = 0;
        a += Math.sin(dLat / 2) * Math.sin(dLat / 2);
        a += Math.cos(bikeSorterService.convertDegree2Radian(lat_rnd));
        a *= Math.cos(bikeSorterService.convertDegree2Radian(lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
      },

      sortLocationBikes: function (bikes, location, orderBy) {
        for (var index in bikes) {
          if (Object.prototype.hasOwnProperty.call(bikes, index)) {
            var d = bikeSorterService.distanceUsingHaversine(
              location.lat,
              location.lng,
              bikes[index].lat_rnd,
              bikes[index].lng_rnd
            );
            bikes[index].latLngDiff = d;
          }
        }
        bikes = orderBy(bikes, 'latLngDiff', false);
        return bikes;
      },
      getLocationTitles: function (locationBkpt) {
        var breakpointsLength = locationBkpt.length;
        var titles = [];
        locationBkpt.forEach(function (breakpoint, index) {
          if (index < breakpointsLength - 1) {
            titles.push("Less than " + (breakpoint * 1000) + " m");
          }
        });
        titles.push("More than " + (locationBkpt[breakpointsLength - 2] * 1000) + " m");
        return titles;
      },
      populateLocationBikes: function (locationBkpt, bikes, titles) {
        var newCatBikes = [];
        for (var breakpoint in locationBkpt) {
          if (Object.prototype.hasOwnProperty.call(locationBkpt, breakpoint)) {
            newCatBikes.push({
              title: titles[breakpoint],
              bikes: []
            });
          }
        }

        // populate categorized bikes
        for (var bike in bikes) {
          if (Object.prototype.hasOwnProperty.call(bikes, bike)) {
            for (breakpoint in locationBkpt) {
              if (bikes[bike].latLngDiff < locationBkpt[breakpoint]) {
                newCatBikes[breakpoint].bikes.push(bikes[bike]);
                break;
              }
            }
          }
        }
        return newCatBikes;
      },
      purgeLocationBikes: function (bikes) {
        for (var bikeCat in bikes) {
          if (bikes[bikeCat].bikes.length === 0) {
            bikes.splice(bikeCat, 1);
          }
        }
        return bikes;
      }
    };
    return bikeSorterService;
  }]);