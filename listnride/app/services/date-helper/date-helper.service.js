angular
  .module('listnride')
  .factory('dateHelper', function(
    $translate
  ) {
    let calculateDays = function(startDate, endDate) {
        var hours = Math.abs(endDate - startDate) / (1000*60*60);
        return Math.max(1, Math.ceil(hours / 24));
    };
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    return {
      getMonthLangKey: (monthIndex) => monthNames[monthIndex],
      durationDays: function(startDate, endDate) {
        return calculateDays(startDate, endDate);
      },
      durationDaysNew: function(startDate, endDate) {
        // to count difference only by 'days' we need reset time there
        let m_startDate = moment.isMoment(startDate) ? startDate : this.m_getDateUTC(startDate);
        let m_endDate = moment.isMoment(endDate) ? endDate : this.m_getDateUTC(endDate);

        m_startDate = moment(m_startDate).startOf('day');
        m_endDate = moment(m_endDate).startOf('day');

        return m_endDate.diff(m_startDate, 'days');
      },
      durationDaysPretty: function(startDate, endDate) {
        var days = calculateDays(startDate, endDate);
        var weeks = (days / 7) | 0;
        var output = "";
        days -= weeks * 7;
        var weeksLabel = (weeks == 1) ? $translate.instant('shared.week') : $translate.instant('shared.weeks');
        var daysLabel = (days == 1) ? $translate.instant('shared.day') : $translate.instant('shared.days');
        if (weeks > 0)
          output += weeks + " " + weeksLabel;
        if (days > 0)
                output += (weeks > 0) ? (", " + days + " " + daysLabel) : (days + " " + daysLabel);
        return output;
      },
      duration: function(startDate, endDate, invalidDays) {
        if (startDate === undefined || endDate === undefined) {
          return "0 " + $translate.instant("shared.days") + " , 0 " + $translate.instant("shared.hours");
        } else {
          var diff = this.diff(startDate, endDate)

          var seconds = (diff / 1000) | 0;
          diff -= seconds * 1000;
          var minutes = (seconds / 60) | 0;
          seconds -= minutes * 60;
          var hours = (minutes / 60) | 0;
          minutes -= hours * 60;
          var days = (hours / 24) | 0;
          hours -= days * 24;
          days = days - invalidDays;
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
      diff: function(startDate, endDate) {
        return Math.abs(new Date(startDate) - new Date(endDate));
      },
      getDateUTC(dateObject) {
        return new Date(
          Date.UTC(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate(), dateObject.getHours())
        );
      },
      m_getDateUTC(dateObject) {
        return moment.utc([dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate(), dateObject.getHours()]);
      },
      isOnlyOneSlotPicked({
        timeslots,
        dayTimeRange
      }) {
        let isHalfDay = false;
        let timeslotIndex = null;

        // dayTimeRange can't contain hours that are not in timeslots
        // so we should exclude not valid numbers that can appear
        let timeslotsRange = _.flatMapDeep(_.map(timeslots, (timeslot) => _.range(timeslot.start_time.hour, timeslot.end_time.hour + 1)));
        dayTimeRange = _.intersection(timeslotsRange, dayTimeRange);

        // check if only one timeslot is picked
        _.forEach(timeslots, (timeslot, index) => {
          if (!isHalfDay) {
            let timeSlotRange = _.range(timeslot.start_time.hour, timeslot.end_time.hour + 1);
            let intersection = _.intersection(timeSlotRange, dayTimeRange);
            let extremeTime = intersection.toString() == timeslot.end_time.hour;

            if (intersection.length > 0 && !extremeTime) {
              isHalfDay = intersection.toString() == dayTimeRange.toString();
              if (isHalfDay) timeslotIndex = index;
            }
          }
        });

        return {isHalfDay, timeslotIndex}
      }

    };

  }
);
