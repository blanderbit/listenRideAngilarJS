'use strict';

angular.module('listnride')
  .factory('bikeOptions', [function () {
    return {
      accessoryOptions: function () {
        return [
          {model: "has_lock", label: "lock", iconFileName: "accessoire_lock.svg"},
          {model: "has_helmet", label: "helmet", iconFileName: "accessoire_helmet.svg"},
          {model: "has_lights", label: "lights", iconFileName: "accessoire_lights.svg"},
          {model: "has_basket", label: "basket", iconFileName: "accessoire_basket.svg"},
          {model: "has_trailer", label: "trailer", iconFileName: "accessoire_trailer.svg"},
          {model: "has_childseat", label: "childseat", iconFileName: "accessoire_childseat.svg"}
        ]
      },

      sizeOptions: function () {
        return [
          {value: 155, label: "155 cm - 165 cm"},
          {value: 165, label: "165 cm - 175 cm"},
          {value: 175, label: "175 cm - 185 cm"},
          {value: 185, label: "185 cm - 195 cm"},
          {value: 195, label: "195 cm - 205 cm"}
        ];
      },

      kidsSizeOptions: function () {
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

      categoryOptions: function () {
        return [
          {value: 1, label: "city", iconFileName: "biketype_1.svg"},
          {value: 2, label: "race", iconFileName: "biketype_2.svg"},
          {value: 3, label: "all terrain", iconFileName: "biketype_3.svg"},
          {value: 4, label: "kids", iconFileName: "biketype_4.svg"},
          {value: 5, label: "electro", iconFileName: "biketype_5.svg"},
          {value: 6, label: "special", iconFileName: "biketype_6.svg"}
        ];
      },

      subcategoryOptions: function () {
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

      // estimate prices for several days
      // based on daily price && daily and weekly discounts
      setCustomPrices: function (data) {
        // daily price updates
        for (var day = 1; day < 6; day += 1) {
          data.prices[day].price = Math.round((day + 1) * data.prices[0].price * ((100 - data.discounts.daily) / 100));
        }
        // week price update
        data.prices[6].price = Math.round(7 * data.prices[0].price * ((100 - data.discounts.weekly) / 100));
        // additional day price update
        data.prices[7].price = Math.round(1 * data.prices[0].price * ((100 - data.discounts.weekly) / 100));
        // month price update
        data.prices[8].price = Math.round(28 * data.prices[0].price * ((100 - data.discounts.weekly) / 100));

        return data.prices;
      },

      // estimate prices for several days
      // based on daily price && daily and weekly discounts
      resetCustomPrices: function (data) {
        // daily price updates
        for (var day = 1; day < 6; day += 1) {
          data.prices[day].price = (day + 1) * data.prices[0].price * Math.round((100 - data.discounts.daily) / 100);
        }
        // week price update
        data.prices[6].price = 7 * data.prices[0].price * Math.round((100 - data.discounts.weekly) / 100);
        // additional day price update
        data.prices[7].price = 1 * data.prices[0].price * Math.round((100 - data.discounts.weekly) / 100);
        // month price update
        data.prices[8].price = 28 * data.prices[0].price * Math.round((100 - data.discounts.weekly) / 100);

        return data.prices;
      },

      // server to client transformation
      transformPrices: function (originalPrices) {
        var prices = [];

        // daily and weekly price updates
        for (var day = 0; day < 7; day += 1) {
          prices[day] = {
            id: originalPrices[day].id,
            price: Math.round((day + 1) * (originalPrices[day].price)),
            start_at: originalPrices[day].start_at
          };
        }

        // additional day price update
        prices.push({
          id: originalPrices[7].id,
          price: Math.round((originalPrices[7].price)),
          start_at: originalPrices[7].start_at
        });

        // month price update
        prices.push({
          id: originalPrices[8].id,
          price: Math.round(28 * (originalPrices[8].price)),
          start_at: originalPrices[8].start_at
        });

        return prices;
      },

      // client to server transformation
      inverseTransformPrices: function (transformedPrices, isListMode) {
        var prices = [];
        var start_at_seconds = [0, 86400, 172800, 259200, 345600, 432000, 518400, 604800, 691200, 2419200];

        // listing a bike
        if (isListMode) {
          // daily and weekly price updates
          for (var day = 0; day < 7; day += 1) {
            prices[day] = {
              price: (transformedPrices[day].price / (day + 1)),
              start_at: transformedPrices[day].start_at || start_at_seconds[day]
            };
          }

          // additional day price update
          prices.push({
            price: (transformedPrices[7].price),
            start_at: transformedPrices[7].start_at || start_at_seconds[7]
          });

          // month price update
          prices.push({
            price: (transformedPrices[8].price / 28),
            start_at: transformedPrices[8].start_at || start_at_seconds[8]
          });
        }
        // editing a bike
        else {
          // daily and weekly price updates
          for (var day = 0; day < 7; day += 1) {
            prices[day] = {
              id: transformedPrices[day].id || 0,
              price: (transformedPrices[day].price / (day + 1)),
              start_at: transformedPrices[day].start_at || start_at_seconds[7]
            };
          }

          // additional day price update
          prices.push({
            id: transformedPrices[7].id || 0,
            price: (transformedPrices[7].price),
            start_at: transformedPrices[7].start_at || 0
          });

          // month price update
          prices.push({
            id: transformedPrices[8].id || 0,
            price: (transformedPrices[8].price / 28),
            start_at: transformedPrices[8].start_at || 0
          });
        }

        return prices;
      }
    };
  }]);