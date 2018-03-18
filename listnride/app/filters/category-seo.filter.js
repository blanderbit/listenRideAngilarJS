'use strict';

angular.
  module('listnride').
  filter('categorySeo', ['$translate', function($translate) {
    return function(category) {
      switch(category) {
        // english
        case 'city': return 1;
        case 'race': return 2;
        case 'all-terrain': return 3;
        case 'kids': return 4;
        case 'electric': return 5;
        case 'special': return 6;

        default: return "";
      }
    };
  }]);
