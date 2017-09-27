'use strict';

angular
.module('listnride')
.factory('bikeOptions', [
  function() {

    return {
      accessoryOptions: function() {
        return [
          {model: "has_lock", label: "lock", iconFileName: "accessoire_lock.svg"},
          {model: "has_helmet", label: "helmet", iconFileName: "accessoire_helmet.svg"},
          {model: "has_lights", label: "lights", iconFileName: "accessoire_lights.svg"},
          {model: "has_basket", label: "basket", iconFileName: "accessoire_basket.svg"},
          {model: "has_trailer", label: "trailer", iconFileName: "accessoire_trailer.svg"},
          {model: "has_childseat", label: "childseat", iconFileName: "accessoire_childseat.svg"}
        ]
      },

      sizeOptions: function() {
        return [
          {value: 155, label: "155 cm - 165 cm"},
          {value: 165, label: "165 cm - 175 cm"},
          {value: 175, label: "175 cm - 185 cm"},
          {value: 185, label: "185 cm - 195 cm"},
          {value: 195, label: "195 cm - 205 cm"}
        ];
      },

      kidsSizeOptions: function() {
        return [
          {value: 85, label: "85 cm - 95 cm"},
          {value: 95, label: "95 cm - 105 cm"},
          {value: 105, label: "105 cm - 115 cm"},
          {value: 115, label: "115 cm - 125 cm"},
          {value: 125, label: "125 cm - 135 cm"},
          {value: 135, label: "135 cm - 145 cm"},
          {value: 145, label: "145 cm - 155 cm"}
        ];
      },

      categoryOptions: function() {
        return [
          {value: 1, label: "city", iconFileName: "biketype_1.svg"},
          {value: 2, label: "race", iconFileName: "biketype_2.svg"},
          {value: 3, label: "all terrain", iconFileName: "biketype_3.svg"},
          {value: 4, label: "kids", iconFileName: "biketype_4.svg"},
          {value: 5, label: "electro", iconFileName: "biketype_5.svg"},
          {value: 6, label: "special", iconFileName: "biketype_6.svg"}
        ];
      },

      subcategoryOptions: function() {
        return {
          "1": [
            {value: 0, label: "dutch-bike"},
            {value: 1, label: "touring-bike"},
            {value: 2, label: "fixie"},
            {value: 3, label: "single-speed"}
          ],
          "2": [
            {value: 0, label: "road-bike"},
            {value: 1, label: "triathlon"},
            {value: 2, label: "indoor"}
          ],
          "3": [
            {value: 0, label: "tracking"},
            {value: 1, label: "enduro"},
            {value: 2, label: "freeride"},
            {value: 3, label: "cross-country"},
            {value: 4, label: "downhill"},
            {value: 5, label: "cyclocross"}
          ],
          "4": [
            {value: 0, label: "city"},
            {value: 1, label: "all-terrain"},
            {value: 2, label: "road"},
          ],
          "5": [
            {value: 0, label: "pedelec"},
            {value: 1, label: "e-bike"},
          ],
          "6": [
            {value: 0, label: "folding-bike"},
            {value: 1, label: "tandem"},
            {value: 2, label: "cruiser"},
            {value: 3, label: "cargo-bike"},
            {value: 4, label: "recumbent"},
            {value: 5, label: "mono-bike"}
          ],
        };
      },

      setCustomPrices: function (data) {
        data.price_2_days = Math.round(2 * data.price_daily * (100 - data.discount_daily) / 100);
        data.price_3_days = Math.round(3 * data.price_daily * (100 - data.discount_daily) / 100);
        data.price_4_days = Math.round(4 * data.price_daily * (100 - data.discount_daily) / 100);
        data.price_5_days = Math.round(5 * data.price_daily * (100 - data.discount_daily) / 100);
        data.price_6_days = Math.round(6 * data.price_daily * (100 - data.discount_daily) / 100);
        data.price_7_days = Math.round(7 * data.price_daily * (100 - data.discount_weekly) / 100);
        data.price_8_days = Math.round(8 * data.price_daily * (100 - data.discount_daily) / 100);
        data.price_30_days = Math.round(30 * data.price_daily * (100 - data.discount_daily) / 100);
        return data;
      }
    };
  }
]);