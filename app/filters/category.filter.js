'use strict';

angular.
  module('listnride').
  filter('category', function() {

    return function(categoryId) {
      switch(categoryId) {
        case 10: return "Holland"; break;
        case 11: return "Touring"; break;
        case 12: return "Fixie"; break;
        case 13: return "Single Speed"; break;

        case 20: return "Roadbike"; break;
        case 21: return "Triathlon"; break;
        case 22: return "Indoor"; break;

        case 30: return "Trecking"; break;
        case 31: return "Enduro"; break;
        case 32: return "Freeride"; break;
        case 33: return "Cross Country"; break;
        case 34: return "Downhill"; break;
        case 35: return "Cyclocross"; break;

        case 40: return "Children City"; break;
        case 41: return "Children Allterrain"; break;
        case 42: return "Children Road"; break;

        case 50: return "Pedelec"; break;
        case 51: return "E-Bike"; break;

        case 60: return "Folding"; break;
        case 61: return "Tandem"; break;
        case 62: return "Cruiser"; break;
        case 63: return "Cargo"; break;
        case 64: return "Recumbent"; break;
        case 65: return "Mono"; break;

        default: return ""; break;
      }
    }

  });