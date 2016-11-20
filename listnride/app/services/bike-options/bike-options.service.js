'use strict';

angular
.module('listnride')
.factory('bikeOptions', [
  function() {

    return {
      accessoryOptions: function() {
        return [
          {model: "has_lock", label: "lock"},
          {model: "has_helmet", label: "helmet"},
          {model: "has_lights", label: "lights"},
          {model: "has_basket", label: "basket"},
          {model: "has_trailer", label: "trailer"},
          {model: "has_childseat", label: "childseat"}
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
          {value: 1, label: "city"},
          {value: 2, label: "race"},
          {value: 3, label: "all terrain"},
          {value: 4, label: "kids"},
          {value: 5, label: "electro"},
          {value: 6, label: "special"}
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
      }

    };

  }
]);