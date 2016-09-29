'use strict';

angular.module('bike').component('calendar', {
  templateUrl: 'app/modules/bike/calendar.template.html',
  controllerAs: 'calendar',
  bindings: {
    bikeId: '<',
    requests: '<'
  },
  controller: ['$scope', '$localStorage', '$state', 'api',
    function CalendarController($scope, $localStorage, $state, api) {
      var calendar = this;

      calendar.startTime = 10;
      calendar.endTime = 18;

      $scope.$watch('calendar.requests', function() {
        if (calendar.requests !== undefined) {
          angular.element('#bikeCalendar').dateRangePicker({
            alwaysOpen: true,
            container: '#bikeCalendar',
            beforeShowDay: classifyDate,
            inline: true,
            selectForward: true,
            showShortcuts: false,
            showTopbar: false,
            singleMonth: true,
            startOfWeek: 'monday'
          }).bind('datepicker-change', function(event, obj) {
            var start = obj.date1;
            start.setHours(calendar.startTime, 0, 0, 0);
            var end = obj.date2;
            end.setHours(calendar.endTime, 0, 0, 0);

            $scope.$apply(function() {
              calendar.startDate = start;
              calendar.endDate = end;
            })
          });
        }
      });

      calendar.onTimeChange = function(slot) {
        var slotDate = slot + "Date";
        var slotTime = slot + "Time";
        var date = new Date(calendar[slotDate]);
        date.setHours(calendar[slotTime], 0, 0, 0);
        calendar[slotDate] = date;
      };

      calendar.onBikeRequest = function() {
        var data = {
          user_id: $localStorage.userId,
          ride_id: calendar.bikeId,
          start_date: calendar.startDate.toISOString(),
          end_date: calendar.endDate.toISOString()
        };

        api.post('/requests', data).then(
          function(response) {
            $state.go('requests');
            console.log("Success", response);
          },
          function(error) {
            console.log("Error posting request", error);
          }
        );
      };

      calendar.isFormInvalid = function() {
        return calendar.bikeId === undefined || calendar.startDate === undefined ||
          (calendar.startDate !== undefined  && calendar.startDate.getTime() >= calendar.endDate.getTime());
      };

      calendar.isDateInvalid = function() {
        return calendar.startDate !== undefined  &&
          calendar.startDate.getTime() >= calendar.endDate.getTime();
      };

      calendar.getNumber = function(number) {
        return new Array(number);
      }

      function classifyDate(date) {
        date.setHours(0, 0, 0, 0);
        var now = new Date();
        now.setHours(0, 0, 0, 0);
        if (date.getTime() < now.getTime()) {
          return [false, "date-past", ""];
        } else if (isReserved(date)) {
          return [false, "date-reserved", ""];
        } else {
          return [true, "date-available", ""];
        }
      }

      function isReserved(date) {
        for (var i = 0; i < calendar.requests.length; ++i) {
          var start = new Date(calendar.requests[i].start_date);
          start.setHours(0,0,0,0);
          var end = new Date(calendar.requests[i].end_date);
          end.setHours(0,0,0,0);

          if (start.getTime() <= date.getTime()
            && date.getTime() <= end.getTime()) {
            return true;
          }
        }
        return false;
      }

    }
  ]
});
