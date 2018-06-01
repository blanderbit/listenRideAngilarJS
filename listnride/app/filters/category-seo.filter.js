'use strict';

angular.
  module('listnride').
  filter('categorySeo', ['$translate', function($translate) {
    return function(category) {
      // only english
      switch(category) {
        // Old categories with new key number
        // TODO: temporary, remove after @alexander will know about keywords
        case 'city': return 1;
        case 'electric': return 2;
        case 'race': return 3;
        case 'all-terrain': return 4;
        case 'transport': return 5;
        case 'kids': return 6;
        case 'special': return 7;

        // New categories
        // TODO: uncomment when @alexander will know about keywords
        //
        // case 'urban': return 1;
        // case 'e-bike': return 2;
        // case 'road': return 3;
        // case 'all-terrain': return 4;
        // case 'transport': return 5;
        // case 'kids': return 6;
        // case 'special': return 7;

        default: return "";
      }
    };
  }]);
