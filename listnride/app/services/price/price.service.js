'use strict';

angular.module('listnride').factory('price', ['$translate', 'date',
  function($translate, date) {
    return {
      // Calculates the prices for the calendar and booking overview
      // Note that this is just a preview-calculation, the actual data
      // gets calculated in the backend.
      calculatePrices: function (startDate, endDate, prices, coverageTotal, isPremiumCoverage, isShopUser, isInsuredCountry) {
        var result = {
          subtotal: 0,
          subtotalDiscounted: 0,
          serviceFee: 0,
          coverageTotal: coverageTotal || 0, // [0,1000,2000,3000,4000,5000]
          premiumCoverage: isPremiumCoverage ? 3 : 0, // premium Coverage price is static 3 euro
          total: 0
        };

        var RIDER_TAX = 0.125;
        var VAT_TAX = 0.19;

        if (startDate !== undefined && endDate !== undefined) {
          var days = date.durationDays(startDate, endDate);
        }
        // Check if days are valid
        if (days <= 0) return result;

        // Subtotal here is only to show the price without all Fee and discounts
        result.subtotal = days * prices[0].price;

        // Calc days with daily discount
        if (days < 8) {
          result.subtotalDiscounted = prices[days - 1].price * days;
        } else if (days <= 28) {
          result.subtotalDiscounted = prices[6].price * 7 + (days - 7) * prices[7].price;
        } else {
          result.subtotalDiscounted = prices[8].price * days;
        }

        // Calculate Coverage Fee
        result.premiumCoverage = result.premiumCoverage * days;

        result.serviceFee = 0;
        if (!isShopUser) {
          // Service Fee is 12,5% and includes 0,19% MwSt
          result.serviceFee += (result.subtotalDiscounted * RIDER_TAX * VAT_TAX) + (result.subtotalDiscounted * RIDER_TAX);
        } else {
          // add VAT only if user came from shop and insured country
          result.serviceFee += isInsuredCountry ? result.subtotalDiscounted * RIDER_TAX * VAT_TAX : 0;
        }
        result.serviceFee += (result.coverageTotal / 1000) * days;
        result.total = result.subtotalDiscounted + result.serviceFee + result.premiumCoverage;
        return result;
      },

      // proposes custom prices through daily price acc. to a scheme of us
      // without using custom discounts
      proposeCustomPrices: function (data) {
        var basePrice = data.prices[0].price * (1/1.25);

        data.prices[1].price = Math.round(basePrice * 2);
        data.prices[2].price = Math.round(basePrice * 2.7);
        data.prices[3].price = Math.round(basePrice * 3.3);
        data.prices[4].price = Math.round(basePrice * 3.9);
        data.prices[5].price = Math.round(basePrice * 4.4);
        data.prices[6].price = Math.round(basePrice * 4.9);
        data.prices[7].price = Math.round(data.prices[0].price * 0.35);
        data.prices[8].price = Math.round(data.prices[7].price * 28);

        return data.prices;
      },

      // estimate prices for several days
      // based on daily price && daily and weekly discounts
      setCustomPrices: function (data) {
        var base = data.prices[0].price;
        // from 2 to 6 days
        for (var day = 1; day < 6; day += 1) {
          // if daily discount not 0
          if (data.discounts.daily > 1) {
            data.prices[day].price = Math.round((day + 1) * base * ((100 - parseFloat(data.discounts.daily)) / 100));
          } else {
            data.prices[day].price = Math.round((day + 1) * base);
          }
        }
        // week price update
        data.prices[6].price = Math.round(7 * base * ((100 - parseFloat(data.discounts.weekly)) / 100));
        // additional day price update
        data.prices[7].price = Math.round(1 * base * ((100 - parseFloat(data.discounts.weekly)) / 100));
        // month price update
        data.prices[8].price = Math.round(28 * base * ((100 - parseFloat(data.discounts.weekly)) / 100));

        return data.prices;
      },

      // server to client transformation
      // all prices are calculated based on daily price
      // daily price is user provided always as integer
      transformPrices: function (originalPrices, discounts) {

        var prices = [];

        // no change to daily price
        prices[0] = {
          id: originalPrices[0].id,
          price: parseInt(originalPrices[0].price),
          start_at: originalPrices[0].start_at
        };
        // daily and weekly price updates
        for (var day = 1; day < 6; day += 1) {
          prices[day] = {
            id: originalPrices[day].id,
            price: Math.round((day + 1) * originalPrices[day].price),
            start_at: originalPrices[day].start_at
          };
        }

        // weekly price update
        prices.push({
          id: originalPrices[6].id,
          price: Math.round(7 * originalPrices[6].price),
          start_at: originalPrices[6].start_at
        });

        // additional day price update
        prices.push({
          id: originalPrices[7].id,
          price: Math.round(1 * originalPrices[7].price),
          start_at: originalPrices[7].start_at
        });

        // month price update
        prices.push({
          id: originalPrices[8].id,
          price: Math.round(28 * originalPrices[8].price),
          start_at: originalPrices[8].start_at
        });
        return prices;
      },

      // client to server transformation
      inverseTransformPrices: function (transformedPrices, isListMode) {
        var prices = [];
        var start_at_seconds = [0, 86400, 172800, 259200, 345600, 432000, 518400, 604800, 2419200];

        // no change to daily price
        prices[0] = {
          id: transformedPrices[0].id,
          price: parseInt(transformedPrices[0].price),
          start_at: transformedPrices[0].start_at || start_at_seconds[0]
        };

        // listing a bike
        if (isListMode) {
          // daily and weekly price updates
          for (var day = 1; day < 7; day += 1) {
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
          for (var day = 1; day < 7; day += 1) {
            prices[day] = {
              id: transformedPrices[day].id,
              price: (transformedPrices[day].price / (day + 1)),
              start_at: transformedPrices[day].start_at
            };
          }

          // additional day price update
          prices.push({
            id: transformedPrices[7].id,
            price: (transformedPrices[7].price),
            start_at: transformedPrices[7].start_at
          });

          // month price update
          prices.push({
            id: transformedPrices[8].id,
            price: (transformedPrices[8].price / 28),
            start_at: transformedPrices[8].start_at
          });
        }
        return prices;
      }
    };
  }
]);
