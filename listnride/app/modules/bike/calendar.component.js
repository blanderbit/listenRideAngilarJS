'use strict';

angular.module('bike').component('calendar', {
  templateUrl: 'app/modules/bike/calendar.template.html',
  controllerAs: 'calendar',
  bindings: {
    bikeId: '<',
    bikeFamily: '<',
    userId: '<',
    priceHalfDay: '<',
    priceDay: '<',
    priceWeek: '<',
    requests: '<'
  },
  controller: ['$scope', '$localStorage', '$state', '$mdDialog', '$translate', 'date', 'api', 'authentication', 'verification',
    function CalendarController($scope, $localStorage, $state, $mdDialog, $translate, date, api, authentication, verification) {
      var calendar = this;
      calendar.authentication = authentication;

      initOverview();

      var deregisterRequestsWatcher = $scope.$watch('calendar.requests', function() {
        if (calendar.requests !== undefined) {
          deregisterRequestsWatcher();
          calendar.owner = calendar.userId == $localStorage.userId;
          if (calendar.bikeFamily == 2) {
            calendar.event.reserved();
          }
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
            if (calendar.bikeFamily == 2 || (user.has_address && user.confirmed_phone && user.status >= 1)) {
              var data = {
                user_id: $localStorage.userId,
                ride_id: calendar.bikeId,
                start_date: calendar.startDate.toISOString(),
                end_date: calendar.endDate.toISOString()
              };

              api.post('/requests', data).then(
                function(response) {
                  $state.go('requests', {requestId: response.data.id});
                  console.log("Success", response);
                },
                function(error) {
                  console.log("Error posting request", error);
                }
              );
            }
            else {
              verification.openDialog(false);
            }
          },
          function (error) {

          }
        );
      };

      calendar.promptAuthentication = function(event) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
          .title($translate.instant('calendar.log-in-to-request-title'))
          .textContent($translate.instant('calendar.log-in-to-request-description'))
          .targetEvent(event)
          .ok($translate.instant('forms.log-in'))
          .cancel($translate.instant('forms.sign-up'));

        $mdDialog.show(confirm).then(function() {
          authentication.showLoginDialog();
        }, function() {
          authentication.showSignupDialog();
        });
      };

      calendar.isFormInvalid = function() {
        return calendar.bikeId === undefined || calendar.startDate === undefined || 
          (calendar.startDate !== undefined  && calendar.startDate.getTime() >= calendar.endDate.getTime());
      };

      calendar.isDateInvalid = function() {
        return calendar.startDate !== undefined  &&
          calendar.startDate.getTime() >= calendar.endDate.getTime();
      };

      /* ---------- CODE FOR THE EVENT CALENDAR ---------- */

      calendar.event = {};
      calendar.event.slotId;

      var slotDuration = 2;
      var eventYear = 2016;
      var eventMonth = 10;

      calendar.event.slots = [
        {overnight: false, reserved: false, day: 21, month: eventMonth, year: eventYear, text: "18:00 - 20:00", startTime: 18},
        {overnight: false, reserved: false, day: 21, month: eventMonth, year: eventYear, text: "20:00 - 22:00", startTime: 20},
        {overnight: true, reserved: false, day: 21, month: eventMonth, year: eventYear, text: "Overnight (22:00 - 10:00)", startTime: 22},
        {overnight: false, reserved: false, day: 22, month: eventMonth, year: eventYear, text: "10:00 - 12:00", startTime: 10},
        {overnight: false, reserved: false, day: 22, month: eventMonth, year: eventYear, text: "12:00 - 14:00", startTime: 12},
        {overnight: false, reserved: false, day: 22, month: eventMonth, year: eventYear, text: "14:00 - 16:00", startTime: 14},
        {overnight: false, reserved: false, day: 22, month: eventMonth, year: eventYear, text: "16:00 - 18:00", startTime: 16},
        {overnight: false, reserved: false, day: 22, month: eventMonth, year: eventYear, text: "18:00 - 20:00", startTime: 18},
        {overnight: false, reserved: false, day: 22, month: eventMonth, year: eventYear, text: "20:00 - 22:00", startTime: 20},
        {overnight: true, reserved: false, day: 22, month: eventMonth, year: eventYear, text: "Overnight (22:00 - 10:00)", startTime: 22},
        {overnight: false, reserved: false, day: 23, month: eventMonth, year: eventYear, text: "10:00 - 12:00", startTime: 10},
        {overnight: false, reserved: false, day: 23, month: eventMonth, year: eventYear, text: "12:00 - 14:00", startTime: 12},
        {overnight: false, reserved: false, day: 23, month: eventMonth, year: eventYear, text: "14:00 - 16:00", startTime: 14},
        {overnight: false, reserved: false, day: 23, month: eventMonth, year: eventYear, text: "16:00 - 18:00", startTime: 16}
      ];

      calendar.event.changeSlot = function() {
        var slot = calendar.event.slots[calendar.event.slotId];
        calendar.startDate = new Date(eventYear, eventMonth - 1, slot.day, slot.startTime, 0, 0, 0);

        if (slot.overnight) {
          calendar.endDate = new Date(eventYear, eventMonth - 1, slot.day + 1, 10, 0, 0, 0);
        }
        else {
          calendar.endDate = new Date(eventYear, eventMonth - 1, slot.day, slot.startTime + slotDuration, 0, 0, 0);
        }

        dateChange(calendar.startDate, calendar.endDate);
      };

      calendar.event.reserved = function() {
        for (var i = 0; i < calendar.requests.length; i ++) {
          console.log(i);
          var startDate = new Date(calendar.requests[i].start_date);
          var endDate = new Date(calendar.requests[i].end_date);

          var startDay = startDate.getDate();
          var endDay
          var startTime = startDate.getHours();
          var endTime = endDate.getHours();
          var startYear = startDate.getFullYear();
          var startMonth = startDate.getMonth();

          console.log(startDay, startTime, endTime);

          for (var j = 0; j < calendar.event.slots.length; j ++) {
            if (startYear == eventYear && startMonth == eventMonth - 1 && calendar.event.slots[j].day == startDay && calendar.event.slots[j].startTime >= startTime && (calendar.event.slots[j].overnight || calendar.event.slots[j].startTime + slotDuration <= endTime)) {
              calendar.event.slots[j].reserved = true;
            }
          }
        }
      };

      /* ------------------------------------------------- */

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