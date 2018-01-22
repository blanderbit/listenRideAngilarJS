'use strict';

angular.
  module('listnride').
  filter('category', ['$translate', function($translate) {
    return function(categoryId) {
      switch(categoryId) {
        case 1: return 'seo.city';
        case 10: return 'list.subcategory.1.dutch-bike';
        case 11: return 'list.subcategory.1.touring-bike';
        case 12: return 'list.subcategory.1.fixie';
        case 13: return 'list.subcategory.1.single-speed';

        case 2: return 'seo.race';
        case 20: return 'list.subcategory.2.road-bike';
        case 21: return 'list.subcategory.2.triathlon';
        case 22: return 'list.subcategory.2.indoor';

        case 3: return 'seo.all-terrain';
        case 30: return 'list.subcategory.3.tracking';
        case 31: return 'list.subcategory.3.enduro';
        case 32: return 'list.subcategory.3.freeride';
        case 33: return 'list.subcategory.3.cross-country';
        case 34: return 'list.subcategory.3.downhill';
        case 35: return 'list.subcategory.3.cyclocross';

        case 4: return 'seo.kids';
        case 40: return 'list.subcategory.4.city';
        case 41: return 'list.subcategory.4.all-terrain';
        case 42: return 'list.subcategory.4.road';

        case 5: return 'seo.electro';
        case 50: return 'list.subcategory.5.pedelec';
        case 51: return 'list.subcategory.5.e-bike';

        case 6: return 'seo.special';
        case 60: return 'list.subcategory.6.folding-bike';
        case 61: return 'list.subcategory.6.tandem';
        case 62: return 'list.subcategory.6.cruiser';
        case 63: return 'list.subcategory.6.cargo-bike';
        case 64: return 'list.subcategory.6.recumbent';
        case 65: return 'list.subcategory.6.mono-bike';

        default: return "";
      }
    };
  }]);
