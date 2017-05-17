'use strict';

angular.
  module('listnride').
  filter('category', ['$translate', function($translate) {

    return function(categoryId) {
      switch(categoryId) {
        case 10: return $translate.instant('list.subcategory.1.dutch-bike'); break;
        case 11: return $translate.instant('list.subcategory.1.touring-bike'); break;
        case 12: return $translate.instant('list.subcategory.1.fixie'); break;
        case 13: return $translate.instant('list.subcategory.1.single-speed'); break;

        case 20: return $translate.instant('list.subcategory.2.road-bike'); break;
        case 21: return $translate.instant('list.subcategory.2.triathlon'); break;
        case 22: return $translate.instant('list.subcategory.2.indoor'); break;

        case 30: return $translate.instant('list.subcategory.3.tracking'); break;
        case 31: return $translate.instant('list.subcategory.3.enduro'); break;
        case 32: return $translate.instant('list.subcategory.3.freeride'); break;
        case 33: return $translate.instant('list.subcategory.3.cross-country'); break;
        case 34: return $translate.instant('list.subcategory.3.downhill'); break;
        case 35: return $translate.instant('list.subcategory.3.cyclocross'); break;

        case 40: return $translate.instant('list.subcategory.4.city'); break;
        case 41: return $translate.instant('list.subcategory.4.all-terrain'); break;
        case 42: return $translate.instant('list.subcategory.4.road'); break;

        case 50: return $translate.instant('list.subcategory.5.pedelec'); break;
        case 51: return $translate.instant('list.subcategory.5.e-bike'); break;

        case 60: return $translate.instant('list.subcategory.6.folding-bike'); break;
        case 61: return $translate.instant('list.subcategory.6.tandem'); break;
        case 62: return $translate.instant('list.subcategory.6.cruiser'); break;
        case 63: return $translate.instant('list.subcategory.6.cargo-bike'); break;
        case 64: return $translate.instant('list.subcategory.6.recumbent'); break;
        case 65: return $translate.instant('list.subcategory.6.mono-bike'); break;

        default: return ""; break;
      }
    }

  }]);
