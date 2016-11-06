'use strict';

angular.module('listnride').factory('date', ['$translate',
  function($translate) {

    return {
      duration: function(startDate, endDate) {
        if (startDate === undefined || endDate === undefined) {
          return "0 " + $translate.instant("shared.days") + " , 0 " + $translate.instant("shared.hours");
        } else {
          var startDate = new Date(startDate);
          var endDate = new Date(endDate);
          var diff = Math.abs(startDate - endDate);

          var seconds = (diff / 1000) | 0;
          diff -= seconds * 1000;
          var minutes = (seconds / 60) | 0;
          seconds -= minutes * 60;
          var hours = (minutes / 60) | 0;
          minutes -= hours * 60;
          var days = (hours / 24) | 0;
          hours -= days * 24;
          var weeks = (days / 7) | 0;
          days -= weeks * 7;

          var weeksLabel = (weeks == 1)? $translate.instant("shared.week") : $translate.instant("shared.weeks");
          var daysLabel = (days == 1)? $translate.instant("shared.day") : $translate.instant("shared.days");
          var hoursLabel = (hours == 1)? $translate.instant("shared.hour") : $translate.instant("shared.hours");

          var displayDuration = "";

          if (weeks > 0)
            displayDuration += weeks + " " + weeksLabel;
          if (days > 0)
            displayDuration += (weeks > 0)? (", " + days + " " + daysLabel) : (days + " " + daysLabel);
          if (hours > 0)
            displayDuration += (days > 0 || weeks > 0)? (", " + hours + " " + hoursLabel) : (hours + " " + hoursLabel);

          return displayDuration;
        }
      },
    
      subtotal: function(startDate, endDate, priceHalfDay, priceDay, priceWeek) {
        if (startDate === undefined || endDate === undefined) {
          return 0;
        } else {
          var diff = Math.abs(startDate - endDate);

          var seconds = (diff / 1000) | 0;
          diff -= seconds * 1000;
          var minutes = (seconds / 60) | 0;
          seconds -= minutes * 60;
          var hours = (minutes / 60) | 0;
          minutes -= hours * 60;
          var days = (hours / 24) | 0;
          hours -= days * 24;
          var weeks = (days / 7) | 0;
          days -= weeks * 7;

          var value = priceWeek * weeks;
          value += priceDay * days;

          if (weeks == 0 && days == 0) {
            value += (hours <= 6)? priceHalfDay * 1 : priceDay * 1;
          } else {
            if (0 < hours && hours < 6) {
                value += (priceHalfDay * 1);
            } else if (hours >= 6) {
                value += (priceDay * 1);
            }
          }

          if (weeks == 0 && value > priceWeek) {
            value = priceWeek * 1;
          }

          return value;
        }
      }

    };

  }
]);