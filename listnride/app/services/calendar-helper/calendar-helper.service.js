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

      var isAvailable = true;
      var isDateToday = moment().startOf('day').isSame(moment(date).startOf('day'));

      if (!openingHours && !isDateToday) return isAvailable;

      if (isDateToday) {
        isAvailable = $index + 6 >= moment().hour() + 1;
      }

      if (openingHours && checkIsOpeningHoursEnabled(openingHours)) {
        var weekDay = openingHours.hours[getWeekDay(date)];
        if (!_.isEmpty(weekDay)) {
          var workingHours = openHours(weekDay);
          return workingHours.includes($index + 6) && isAvailable;
        }
      }

      return isAvailable;
    };

    var isTimeInTimeslots = function(hour, timeslots) {
      let timeslotsRange = [];
      _.forEach(timeslots, function(timeslot) {
        let timeslotRange = _.range(timeslot.start_time.hour, timeslot.end_time.hour + 1);
        timeslotsRange = [...timeslotsRange, ...timeslotRange]
      })
      return _.includes(timeslotsRange, hour);
    };

    var isDayAvailable = function(openingHours, date) {
      if (!openingHoursAvailable(openingHours)) return false;

      return _.isEmpty(openingHours.hours[getWeekDay(date)]);
    };

    function getInitHours(openingHours, startDate, endDate) {
      var openTime = {};
      if (openingHoursAvailable(openingHours)) {
        var firstDay = openingHours.hours[getWeekDay(startDate)];
        var lastDay = openingHours.hours[getWeekDay(endDate)];

            firstDay = openHours(firstDay);
            lastDay = openHours(lastDay);
            openTime.startTime = firstDay[0];
            openTime.endTime = lastDay[lastDay.length - 1];
      } else {
            openTime.startTime = 10; // default opening time
            openTime.endTime = 20; // default closing time
      }

      // If date today
      if (moment(startDate).isSame(moment(), 'day')) {
        var hour_now = moment().add(1, 'hours').hour();
        if (hour_now < 6) { hour_now = 6 }
        if (hour_now < openTime.startTime && openingHoursAvailable()) {
          hour_now = openTime.startTime
        }
        openTime.startTime = hour_now;
      }
      openTime.startDate = setStartDate(openTime.startTime, startDate);
      openTime.endDate = moment(endDate).hour(openTime.endTime)._d;
      return openTime;
    }

    function openingHoursAvailable(openingHours) {
      return !!openingHours && checkIsOpeningHoursEnabled(openingHours) && _.some(openingHours.hours, Array)
    }

    function checkIsOpeningHoursEnabled(openingHours) {
      if (openingHours.enabled !== undefined) {
        return openingHours.enabled
      }
      return true;
    }

    function setStartDate(startTime, startDate) {
      return moment(startDate).hour(startTime)._d;
    }

    function countTimeslots(requestStart, requestEnd, timeslots) {
      var startTime = moment.utc(requestStart).format('HH');
      var endTime = moment.utc(requestEnd).format('HH');
      let dateTimeRange = _.range(startTime, +endTime + 1);

      let prev_time = null;
      let used_part_day_slots = 0;

      _.forEach(timeslots, (timeslot) => {
        let timeSlotRange = _.range(timeslot.start_time.hour, timeslot.end_time.hour+1);
        let in_slot = !!_.intersection(timeSlotRange, dateTimeRange).length;
        let extreme_time = (prev_time == timeslot.start_time.hour && !!_.find([startTime, endTime], prev_time));

        if (in_slot && !extreme_time) used_part_day_slots += 1

        prev_time = timeslot.end_time.hour;
      });

      return used_part_day_slots;
    }

    return {
      isTimeAvailable,
      isDayAvailable,
      getInitHours,
      checkIsOpeningHoursEnabled,
      isTimeInTimeslots,
      countTimeslots
    };
  }]);
