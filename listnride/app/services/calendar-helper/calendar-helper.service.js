'use strict';

angular.module('listnride')
  .factory('calendarHelper', ['$translate', function ($translate) {

    var getWeekDay = function(date) {
      var dayOfWeek = date.getDay() - 1;
      if (dayOfWeek == - 1) {
        dayOfWeek = 6;
      }
      return dayOfWeek;
    };

    var openHours = function(weekDay) {
      var workingHours = [];
      $.each( weekDay, function( key, value ) {
        var from = value.start_at / 3600;
        var until = (value.duration / 3600) + from + 1;
        $.merge( workingHours, _.range(from,until) )
      });
      return workingHours
    };

    var isTimeAvailable = function($index, openingHours, date) {
      if (date === undefined) return true;

      var isDateToday = moment().startOf('day').isSame(moment(date).startOf('day'));
      if (isDateToday) return $index + 6 >= moment().hour() + 1;

      if (!openingHours) return true;

      var weekDay = openingHours.hours[getWeekDay(date)];
      if (weekDay !== null) {
        var workingHours = openHours(weekDay);
        return workingHours.includes($index + 6);
      }
      return true;
    };

    var isDayAvailable = function(openingHours, date) {
      if (!openingHours) return false;

      return _.isEmpty(openingHours.hours[getWeekDay(date)]);
    };

    return {
      isTimeAvailable: isTimeAvailable,
      isDayAvailable: isDayAvailable
    };
  }]);
