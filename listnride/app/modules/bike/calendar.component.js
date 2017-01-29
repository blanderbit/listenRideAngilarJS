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

      calendar.$onChanges = function (changes) {
        if (changes.userId.currentValue && (changes.userId.currentValue !== changes.userId.previousValue)) {
          api.get('/users/' + changes.userId.currentValue).then(function (response) {
            calendar.bikeOwner = response.data;
            initOverview();
            initCalendarPicker();
          })
        }
      };

      function initCalendarPicker() {
        var deregisterRequestsWatcher = $scope.$watch('calendar.requests', function () {
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
            }).bind('datepicker-change', function (event, obj) {
              var start = obj.date1;
              start.setHours(calendar.startTime, 0, 0, 0);
              var end = obj.date2;
              end.setHours(calendar.endTime, 0, 0, 0);

              $scope.$apply(function () {
                calendar.startDate = start;
                calendar.endDate = end;
                dateChange(calendar.startDate, calendar.endDate);
                if (openingHoursAvailable()) {
                  setInitHours();
                }
              });
            });
          }
        });
      }

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
      calendar.event.pickupSlotId;
      calendar.event.returnSlotId;

      var slotDuration = 1;
      var eventYear = 2017;
      var eventMonth = 2;   // Months start at 0, so February = 1

      // Calendar Slots are currently set for Berliner Fahrradschau 2017
      calendar.event.slots = [
        {overnight: false, reserved: false, returnDisabled: true, day: 3, month: eventMonth, year: eventYear, text: "18:00", hour: 18},
        {overnight: false, reserved: false, returnDisabled: true, day: 3, month: eventMonth, year: eventYear, text: "19:00", hour: 19},
        {overnight: false, reserved: false, returnDisabled: true, day: 3, month: eventMonth, year: eventYear, text: "20:00", hour: 20},
        {overnight: false, reserved: false, returnDisabled: true, day: 3, month: eventMonth, year: eventYear, text: "21:00", hour: 21},
        {overnight: false, reserved: false, returnDisabled: true, day: 3, month: eventMonth, year: eventYear, text: "22:00", hour: 22},
        {overnight: true, reserved: false, returnDisabled: true, day: 3, month: eventMonth, year: eventYear, text: "Overnight (10:00 next day)", hour: 10},
        {overnight: false, reserved: false, returnDisabled: true, day: 4, month: eventMonth, year: eventYear, text: "10:00", hour: 10},
        {overnight: false, reserved: false, returnDisabled: true, day: 4, month: eventMonth, year: eventYear, text: "11:00", hour: 11},
        {overnight: false, reserved: false, returnDisabled: true, day: 4, month: eventMonth, year: eventYear, text: "12:00", hour: 12},
        {overnight: false, reserved: false, returnDisabled: true, day: 4, month: eventMonth, year: eventYear, text: "13:00", hour: 13},
        {overnight: false, reserved: false, returnDisabled: true, day: 4, month: eventMonth, year: eventYear, text: "14:00", hour: 14},
        {overnight: false, reserved: false, returnDisabled: true, day: 4, month: eventMonth, year: eventYear, text: "15:00", hour: 15},
        {overnight: false, reserved: false, returnDisabled: true, day: 4, month: eventMonth, year: eventYear, text: "16:00", hour: 16},
        {overnight: false, reserved: false, returnDisabled: true, day: 4, month: eventMonth, year: eventYear, text: "17:00", hour: 17},
        {overnight: false, reserved: false, returnDisabled: true, day: 4, month: eventMonth, year: eventYear, text: "18:00", hour: 18},
        {overnight: true, reserved: false, returnDisabled: true, day: 4, month: eventMonth, year: eventYear, text: "Overnight (10:00 next day)", hour: 10},
        {overnight: false, reserved: false, returnDisabled: true, day: 5, month: eventMonth, year: eventYear, text: "10:00 - 11:00", hour: 10},
        {overnight: false, reserved: false, returnDisabled: true, day: 5, month: eventMonth, year: eventYear, text: "11:00 - 12:00", hour: 11},
        {overnight: false, reserved: false, returnDisabled: true, day: 5, month: eventMonth, year: eventYear, text: "12:00 - 13:00", hour: 12},
        {overnight: false, reserved: false, returnDisabled: true, day: 5, month: eventMonth, year: eventYear, text: "13:00 - 14:00", hour: 13},
        {overnight: false, reserved: false, returnDisabled: true, day: 5, month: eventMonth, year: eventYear, text: "14:00 - 15:00", hour: 14},
        {overnight: false, reserved: false, returnDisabled: true, day: 5, month: eventMonth, year: eventYear, text: "15:00 - 16:00", hour: 15},
        {overnight: false, reserved: false, returnDisabled: true, day: 5, month: eventMonth, year: eventYear, text: "16:00 - 17:00", hour: 16},
        {overnight: false, reserved: false, returnDisabled: true, day: 5, month: eventMonth, year: eventYear, text: "17:00 - 18:00", hour: 17}
      ];

      calendar.event.changePickupSlot = function() {
        // Define picked slot as pickupSlot
        calendar.event.slots[calendar.event.pickupSlotId].pickup = true;
        // Enable all following slots as returnSlots if no booking is inbetween
        var bookingInBetween = false;
        _.each(calendar.event.slots, function(value, index) {
          if (index > calendar.event.pickupSlotId) {
            if (value.reserved) {
              bookingInBetween = true;
            }
            if (bookingInBetween) {
              value.returnDisabled = true;
            } else {
              value.returnDisabled = false;
            }
          } else {
            value.returnDisabled = true;
          }
        });

        var slot = calendar.event.slots[calendar.event.pickupSlotId];
        calendar.startDate = new Date(eventYear, eventMonth, slot.day, slot.hour, 0, 0, 0);

        // Presets returnSlot to be (slotDuration) after pickupSlot 
        calendar.event.returnSlotId = parseInt(calendar.event.pickupSlotId) + slotDuration;
        calendar.event.changeReturnSlot();
        dateChange(calendar.startDate, calendar.endDate);
      };

      calendar.event.changeReturnSlot = function() {
        var slot = calendar.event.slots[calendar.event.returnSlotId];

        if (slot.overnight) {
          calendar.endDate = new Date(eventYear, eventMonth, slot.day + 1, slot.hour, 0, 0, 0);
          console.log(calendar.endDate);
        } else {
          calendar.endDate = new Date(eventYear, eventMonth, slot.day, slot.hour, 0, 0, 0);  
        }

        dateChange(calendar.startDate, calendar.endDate);
      };

      calendar.event.reserved = function() {
        console.log(calendar.requests);
        for (var i = 0; i < calendar.requests.length; i ++) {
          var startDate = new Date(calendar.requests[i].start_date);
          var endDate = new Date(calendar.requests[i].end_date);
          var startDay = startDate.getDate();
          var startTime = startDate.getHours();
          var endTime = endDate.getHours();
          var startYear = startDate.getFullYear();
          var startMonth = startDate.getMonth();

          for (var j = 0; j < calendar.event.slots.length; j ++) {
            if (startYear == eventYear && startMonth == eventMonth && calendar.event.slots[j].day == startDay && calendar.event.slots[j].hour >= startTime && (calendar.event.slots[j].overnight || calendar.event.slots[j].hour + slotDuration <= endTime)) {
              calendar.event.slots[j].reserved = true;
            }
          }
        }
      };

      /* ------------------------------------------------- */

      calendar.availabilityMessage = function($index, date) {
        if (!calendar.isOptionEnabled($index, date)) {
          return ' (closed)'
        }
      };

      calendar.isOptionEnabled = function($index, date) {
        if (date == undefined || !openingHoursAvailable()) {
          return true
        }
        var weekDay = calendar.bikeOwner.opening_hours.hours[date.getDay()];
        if (weekDay !== null) {
          var workingHours = openHours(weekDay);
          return workingHours.includes($index + 6);
        }
        return false
      };

      function openHours(weekDay) {
        var workingHours = [];
        $.each( weekDay, function( key, value ) {
          var from = value.start_at / 3600;
          var until = (value.duration / 3600) + from + 1;
          $.merge( workingHours, _.range(from,until) )
        });
        return workingHours
      }

      function setInitHours() {
        var firstDay = calendar.bikeOwner.opening_hours.hours[calendar.startDate.getDay()];
        var lastDay = calendar.bikeOwner.opening_hours.hours[calendar.endDate.getDay()];
        firstDay = openHours(firstDay);
        lastDay = openHours(lastDay);
        calendar.startTime = firstDay[0];
        calendar.endTime = lastDay[lastDay.length - 1]
      }

      function classifyDate(date) {
        date.setHours(0, 0, 0, 0);
        var now = new Date();
        now.setHours(0, 0, 0, 0);
        if (date.getTime() < now.getTime()) {
          return [false, "date-past", ""];
        } else if (isReserved(date)) {
          return [false, "date-reserved", ""];
        } else if (dateClosed(date)) {
          return [false, "date-closed", ""];
        } else {
          return [true, "date-available", ""];
        }
      }

      function dateClosed(date) {
        if (openingHoursAvailable()) {
          return calendar.bikeOwner.opening_hours.hours[date.getDay()] == null;
        }
        return false
      }

      function openingHoursAvailable() {
        return calendar.bikeOwner && calendar.bikeOwner.opening_hours && calendar.bikeOwner.opening_hours.enabled
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
          console.log('data is invalid');
          calendar.duration = date.duration(undefined, undefined);
          calendar.subtotal = 0;
          calendar.lnrFee = 0;
          calendar.total = 0;
        } else {
          calendar.duration = date.duration(startDate, endDate);
          // Price calculation differs slightly between event rentals (bikeFamily 2) and standard rentals
          if (calendar.bikeFamily == 2) {
            var subtotal = date.subtotal(startDate, endDate, calendar.priceHalfDay, calendar.priceDay, calendar.priceWeek, 4);
          } else {
            var subtotal = date.subtotal(startDate, endDate, calendar.priceHalfDay, calendar.priceDay, calendar.priceWeek);
          }
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
