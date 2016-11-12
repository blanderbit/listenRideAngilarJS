(function () {
  'use strict';
  angular.
    module('listnride').
    filter('category', function () {

      return function (categoryId) {
        switch (categoryId) {
          case 10: return "Holland";
          case 11: return "Touring";
          case 12: return "Fixie";
          case 13: return "Single Speed";

          case 20: return "Roadbike";
          case 21: return "Triathlon";
          case 22: return "Indoor";

          case 30: return "Trecking";
          case 31: return "Enduro";
          case 32: return "Freeride";
          case 33: return "Cross Country";
          case 34: return "Downhill";
          case 35: return "Cyclocross";

          case 40: return "Children City";
          case 41: return "Children Allterrain";
          case 42: return "Children Road";

          case 50: return "Pedelec";
          case 51: return "E-Bike";

          case 60: return "Folding";
          case 61: return "Tandem";
          case 62: return "Cruiser";
          case 63: return "Cargo";
          case 64: return "Recumbent";
          case 65: return "Mono";

          default: return "";
        }
      };
    });
})();