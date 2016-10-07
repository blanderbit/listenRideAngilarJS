'use strict';

angular.module('bike').component('calendar', {
  templateUrl: 'app/modules/bike/calendar.template.html',
  controllerAs: 'calendar',
  bindings: {
    bikeId: '<',
    userId: '<',
    priceHalfDay: '<',
    priceDay: '<',
    priceWeek: '<',
    requests: '<'
  },
  controller: ['$scope', '$localStorage', '$state', '$mdDialog', 'date', 'api', 'authentication', 'verification',
    function CalendarController($scope, $localStorage, $state, $mdDialog, date, api, authentication, verification) {
      var calendar = this;
      calendar.loggedIn = authentication.loggedIn();
      calendar.owner = calendar.userId == $localStorage.userId;

      initOverview();

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
              dateChange(calendar.startDate, calendar.endDate);
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
        dateChange(calendar.startDate, calendar.endDate);
      };

      calendar.onBikeRequest = function() {
        $mdDialog.hide();
        api.get('/users/' + $localStorage.userId).then(
          function (success) {
            var user = success.data;
            if (user.has_address && user.confirmed_phone && user.status >= 1) {
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
            }
            else {
              verification.openDialog();
            }
          },
          function (error) {

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

      function initOverview() {
        calendar.startTime = 10;
        calendar.endTime = 18;

        calendar.duration = date.duration(undefined, undefined);
        calendar.subtotal = 0;
        calendar.lnrFee = 0;
        calendar.total = 0;

        calendar.formValid = false;
        calendar.datesValid = false;
      }

      function dateChange(startDate, endDate) {
        if (calendar.isDateInvalid()) {
          calendar.duration = date.duration(undefined, undefined);
          calendar.subtotal = 0;
          calendar.lnrFee = 0;
          calendar.total = 0;
        } else {
          calendar.duration = date.duration(startDate, endDate);
          var subtotal = date.subtotal(startDate, endDate, calendar.priceHalfDay, calendar.priceDay, calendar.priceWeek);
          var fee = subtotal * 0.125;
          var tax = fee * 0.19;
          calendar.subtotal = subtotal;
          calendar.lnrFee = fee + tax;
          calendar.total = subtotal + fee + tax;
        }
      }

    }
  ]
});
