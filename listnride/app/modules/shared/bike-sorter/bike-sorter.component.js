'use strict';

angular.module('bikeSorter', [])
  .component('bikeSorter', {
    templateUrl: 'app/modules/shared/bike-sorter/bike-sorter.template.html',
    controllerAs: 'bikeSorter',
    bindings: {
      bikes: '<',
      titles: '=',
      categorizedBikes: '=',
      location: '<',
    },
    controller: ['orderByFilter', 'bikeSorterService', function BikeSorter(orderBy, bikeSorterService) {
      var bikeSorter = this;
      bikeSorter.$onInit = function () {
        bikeSorter.locationSorter = locationSorter;
        bikeSorter.priceSorter = priceSorter;
      };
      /*
       * sort bike w.r.t their distance from user location
       * categorize the bikes based on location breakpoints
       */
      function locationSorter() {
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
      }
      /*
       * sort bike w.r.t their prices
       * categorize the bikes based on price breakpoints
       */
      function priceSorter(ascending) {
        // generate titles for price based sorting
        var titles = bikeSorterService.getPriceTitles(ascending);
        // sort, populate and purge bikes
        var bikes = bikeSorterService.sortPriceBikes(bikeSorter.bikes, orderBy, ascending);
        bikes = bikeSorterService.populatePriceBikes(bikes, titles, ascending);
        var response = bikeSorterService.purgeBikes(bikes, titles);
        bikes = response[0];
        titles = response[1];
        // update models
        bikeSorter.titles = titles;
        bikeSorter.categorizedBikes = bikes;
      }
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
        price: [10, 30, 50, 100, 1000],
        inversePrice: [1000, 100, 50, 30, 10],
        lister: [2, 3, 4, 5, 10, 100]
      },
      /*
       * conversion from degree two radian
       */
      convertDegree2Radian: function (deg) {
        return deg * (Math.PI / 180);
      },
      /*
       * find distance between two points using haversine formula
       */
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
      /*
       * titles of bikes to be shown as location breakpoints
       */
      getLocationTitles: function () {
        var length = bikeSorterService.breakpoints.location.length;
        var breakpoints = bikeSorterService.breakpoints.location;
        var titles = [];
        breakpoints.forEach(function (breakpoint, index) {
          if (index < length - 1) {
            titles.push("Less than " + (breakpoint * 1000) + " m");
          }
        });
        titles.push("More than " + (breakpoints[length - 2] * 1000) + " m");
        return titles;
      },
      /*
       * titles of bikes to be shown as price breakpoints
       */
      getPriceTitles: function (ascending) {
        var length = bikeSorterService.breakpoints.price.length,
          titles = [];
        var bounds = ["Less than ", "More than "];
        var breakpoints = ascending ? bikeSorterService.breakpoints.price : bikeSorterService.breakpoints.inversePrice;
        breakpoints.forEach(function (breakpoint, index) {
          if (index < length - 1) {
            titles.push(bounds[0] + breakpoint + " €");
          }
        });
        titles.push(bounds[1] + (breakpoints[length - 2]) + " €");
        return titles;
      },
      /*
       * titles of bikes to be shown as lister breakpoints
       */
      getListerTitles: function () {
        var length = bikeSorterService.breakpoints.lister.length;
        var breakpoints = bikeSorterService.breakpoints.lister;
        var titles = [];
        breakpoints.forEach(function (breakpoint, index) {
          if (index < length - 1) {
            titles.push("Less than " + breakpoint + " bikes");
          }
        });
        titles.push("More than " + breakpoints[length - 2] + " bikes");
        return titles;
      },
      /*
       * sort the bikes w.r.t location in ascending order
       */
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
        return orderBy(bikes, 'latLngDiff', false);
      },
      /*
       * sort the bikes w.r.t location either ascending or descending order
       */
      sortPriceBikes: function (bikes, orderBy, ascending) {
        return orderBy(bikes, 'price_from', !ascending);
      },
      /*
       * categorize bikes w.r.t price in descending order
       */
      descendingPriceCategorizer: function (bikes, categorizedBikes) {
        var breakpoints = bikeSorterService.breakpoints.inversePrice;
        for (var bike in bikes) {
          if (Object.prototype.hasOwnProperty.call(bikes, bike)) {
            for (var breakpoint in breakpoints) {
              breakpoint = parseInt(breakpoint);

              var price = bikes[bike].price_from,
                currentBreakpointPrice = breakpoints[breakpoint],
                nextBreakpointPrice = breakpoints[breakpoint + 1];

              if (nextBreakpointPrice && price < currentBreakpointPrice && price > nextBreakpointPrice) {
                categorizedBikes[breakpoint].bikes.push(bikes[bike]);
                break;
              } else if (nextBreakpointPrice === undefined && price < currentBreakpointPrice) {
                categorizedBikes[breakpoint].bikes.push(bikes[bike]);
                break;
              }
            }
          }
        }
        return categorizedBikes;
      },
      /*
       * categorize bikes w.r.t price in ascending order
       */
      ascendingPriceCategorizer: function (bikes, categorizedBikes) {
        var breakpoints = bikeSorterService.breakpoints.price;
        for (var bike in bikes) {
          if (Object.prototype.hasOwnProperty.call(bikes, bike)) {
            for (var breakpoint in breakpoints) {
              var price = bikes[bike].price_from;
              if (price < breakpoints[breakpoint]) {
                categorizedBikes[breakpoint].bikes.push(bikes[bike]);
                break;
              }
            }
          }
        }
        return categorizedBikes;
      },
      /*
       * get bikes arranged in location based categories
       */
      populateLocationBikes: function (bikes, titles) {
        var breakpoints = bikeSorterService.breakpoints.location;
        var categorizedBikes = [];
        for (var breakpoint in breakpoints) {
          if (Object.prototype.hasOwnProperty.call(breakpoints, breakpoint)) {
            categorizedBikes.push({
              title: titles[breakpoint],
              bikes: []
            });
          }
        }
        // populate location based categorized bikes
        for (var bike in bikes) {
          if (Object.prototype.hasOwnProperty.call(bikes, bike)) {
            for (breakpoint in breakpoints) {
              if (bikes[bike].latLngDiff < breakpoints[breakpoint]) {
                categorizedBikes[breakpoint].bikes.push(bikes[bike]);
                break;
              }
            }
          }
        }
        return categorizedBikes;
      },
      /*
       * get bikes arranged in price based categories
       */
      populatePriceBikes: function (bikes, titles, ascending) {
        var breakpoints = bikeSorterService.breakpoints.price;
        var categorizedBikes = [];
        for (var breakpoint in breakpoints) {
          if (Object.prototype.hasOwnProperty.call(breakpoints, breakpoint)) {
            categorizedBikes.push({
              title: titles[breakpoint],
              bikes: []
            });
          }
        }
        // populate price based categorized bikes
        categorizedBikes = ascending ? bikeSorterService.ascendingPriceCategorizer(
          bikes, categorizedBikes
        ) : bikeSorterService.descendingPriceCategorizer(
          bikes, categorizedBikes
        );
        return categorizedBikes;
      },
      /*
       * remove categories with no bikes
       */
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