'use strict';

angular.
module('listnride').
filter('map_category', function() {

  return function (bikes, categories) {
    if (bikes == undefined) {
      return [];
    }

    var categoryValues = Object.keys(categories).map(function(key) {
        return categories[key];
    });

    var allFalse = categoryValues.every(function(value) {
      return value === false;
    });

    if (allFalse) {
      return bikes;
    }

    var categoryMap = [
      "city",
      "race",
      "allterain",
      "kids",
      "ebikes",
      "special"
    ];

    return bikes.filter(function(bike) {
      return (categories[categoryMap[(bike.category / 10) - 1]] === true);
    });
  }

});