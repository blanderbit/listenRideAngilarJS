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
      /*
       * sort bike w.r.t their distance from user location
       * categorize the bikes based on location breakpoints
       */
      bikeSorter.locationSorter = function () {
        // generate titles for location based sorting
        var titles = bikeSorterService.getLocationTitles();
        // sort, populate and purge bikes
        var bikes = bikeSorterService.sortLocationBikes(bikeSorter.bikes, bikeSorter.location, orderBy);
        bikes = bikeSorterService.populateLocationBikes(bikes, titles);
        var response = bikeSorterService.purgeBikes(bikes, titles);
        bikes = response[0];
        titles = response[1];
        // update models
        bikeSorter.titles = titles;
        bikeSorter.categorizedBikes = bikes;
      };
      /*
       * sort bike w.r.t their prices
       * categorize the bikes based on price breakpoints
       */
      bikeSorter.priceSorter = function (ascending) {
        // generate titles for price based sorting
        var titles = bikeSorterService.getPriceTitles(ascending);
        // sort, populate and purge bikes
        var bikes = bikeSorterService.sortPriceBikes(bikeSorter.bikes, orderBy, ascending);
        bikes = bikeSorterService.populatePriceBikes(bikes, titles);
        var response = bikeSorterService.purgeBikes(bikes, titles);
        bikes = response[0];
        titles = response[1];
        // update models
        bikeSorter.titles = titles;
        bikeSorter.categorizedBikes = bikes;
      };
    }],
  })
  .factory('bikeSorterService', [function () {
    var bikeSorterService = {

      /*
       * breakpoints for location
       * breakpoints for price
       */
      breakpoints: {
        location: [0.25, 0.5, 1.0, 9999],
        price: [10, 30, 50, 100, 9999]
      },
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
      getLocationTitles: function () {
        var length = bikeSorterService.breakpoints.location.length;
        var titles = [];
        bikeSorterService.breakpoints.location.forEach(function (breakpoint, index) {
          if (index < length - 1) {
            titles.push("Less than " + (breakpoint * 1000) + " m");
          }
        });
        titles.push("More than " + (bikeSorterService.breakpoints.location[length - 2] * 1000) + " m");
        return titles;
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
      sortPriceBikes: function (bikes, orderBy, ascending) {
        return orderBy(bikes, 'price_from', ascending);
      },
      getPriceTitles: function (breakpoints, ascending) {
        var length = bikeSorterService.breakpoints.price.length,
          titles = [];
        var bound = ascending ? ["Less than ", "More than "] : ["More than ", "Less than "];
        var correctedBreakpoints = ascending ? bikeSorterService.breakpoints.price.reverse() : bikeSorterService.breakpoints.price;
        correctedBreakpoints.forEach(function (breakpoint, index) {
          if (index < length - 1) {
            titles.push(bound[0] + breakpoint + " €");
          }
        });
        titles.push(bound[1] + (correctedBreakpoints[length - 2]) + " €");
        return titles;
      },
      populateLocationBikes: function (bikes, titles) {
        var categorizedBikes = [];
        for (var breakpoint in bikeSorterService.breakpoints.location) {
          if (Object.prototype.hasOwnProperty.call(bikeSorterService.breakpoints.location, breakpoint)) {
            categorizedBikes.push({
              title: titles[breakpoint],
              bikes: []
            });
          }
        }
        // populate location based categorized bikes
        for (var bike in bikes) {
          if (Object.prototype.hasOwnProperty.call(bikes, bike)) {
            for (breakpoint in bikeSorterService.breakpoints.location) {
              if (bikes[bike].latLngDiff < bikeSorterService.breakpoints.location[breakpoint]) {
                categorizedBikes[breakpoint].bikes.push(bikes[bike]);
                break;
              }
            }
          }
        }
        return categorizedBikes;
      },
      populatePriceBikes: function (bikes, titles) {
        var categorizedBikes = [];
        for (var breakpoint in bikeSorterService.breakpoints.price) {
          if (Object.prototype.hasOwnProperty.call(bikeSorterService.breakpoints.price, breakpoint)) {
            categorizedBikes.push({
              title: titles[breakpoint],
              bikes: []
            });
          }
        }
        // populate price based categorized bikes
        for (var bike in bikes) {
          if (Object.prototype.hasOwnProperty.call(bikes, bike)) {
            for (breakpoint in bikeSorterService.breakpoints.price) {
              if (bikes[bike].price_from < bikeSorterService.breakpoints.price[breakpoint]) {
                categorizedBikes[breakpoint].bikes.push(bikes[bike]);
                break;
              }
            }
          }
        }
        return categorizedBikes;
      },
      purgeBikes: function (bikes, titles) {
        for (var index in bikes) {
          if (bikes[index].bikes.length === 0) {
            // remove element if it contains no bikes
            bikes.splice(index, 1);
            titles.splice(index, 1);
            if (parseInt(index) === bikes.length) {
              titles.pop();
              bikes.pop();
            }
          }
        }
        return [bikes, titles];
      }
    };
    return bikeSorterService;
  }]);