'use strict';
angular.module('bike').component('calendar', {
  templateUrl: 'app/modules/bike/calendar/calendar.template.html',
  controllerAs: 'calendar',
  bindings: {
    bike: '<',
    bikeCluster: '<',
    bikeId: '<',
    bikeFamily: '<',
    bikeSize: '<',
    bikeClusterSizes: '<',
    bikeAvailabilities: '<',
    userId: '<',
    priceHalfDay: '<',
    priceDay: '<',
    priceWeek: '<',
    prices: '<',
    requests: '<',
    coverageTotal: '<',
    countryCode: '<',
    cluster: '<'
  },
  controller: ['$scope',
      '$localStorage',
      '$state',
      '$mdDialog',
      '$translate',
      '$mdToast',
      '$mdMedia',
      '$window',
      '$analytics',
      'date',
      'price',
      'api',
      'authentication',
      'verification',
      'ENV',
      'calendarHelper',
      'notification',
      'bikeCluster',
    function CalendarController($scope, $localStorage, $state, $mdDialog, $translate, $mdToast,
                                $mdMedia, $window, $analytics, date, price, api, authentication,
                                verification, ENV, calendarHelper, notification, bikeCluster) {
      var calendar = this;
      calendar.authentication = authentication;
      calendar.calendarHelper = calendarHelper;
      calendar.requested = false;

      calendar.$onChanges = function (changes) {
        if (changes.userId.currentValue && (changes.userId.currentValue !== changes.userId.previousValue)) {
          updateDynamicData();
          api.get('/users/' + changes.userId.currentValue).then(function (response) {
            calendar.bikeOwner = response.data;
            calendar.pickedBikeSize = $state.params.size ? $state.params.size : calendar.bikeSize;
            initOverview();
            initCalendarPicker();
          });
        }
      };

      // some data we don't have on component init
      function updateDynamicData() {
        calendar.freeBike = calendar.prices[0].price <= 0;
      }

      function initCalendarPicker() {
        var deregisterRequestsWatcher = $scope.$watch('calendar.requests', function () {
          if (calendar.requests !== undefined) {
            deregisterRequestsWatcher();
            calendar.owner = calendar.userId == $localStorage.userId;
            if (calendar.bikeFamily == calendar.event.familyId) {
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
              startOfWeek: 'monday',
              language: $translate.preferredLanguage(),
            }).bind('datepicker-change', function (event, obj) {
              var start = obj.date1;
              start.setHours(calendar.startTime, 0, 0, 0);
              var end = obj.date2;
              end.setHours(calendar.endTime, 0, 0, 0);

              $scope.$apply(function () {
                calendar.startDate = start;
                calendar.endDate = end;
                setInitHours();
                dateChange(calendar.startDate, calendar.endDate);
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

      calendar.onBooking = function(){
        $mdDialog.hide();
        $state.go('booking', {
          bikeId: calendar.pickAvailableBike(),
          startDate: calendar.startDate,
          endDate: calendar.endDate
        });
      };

      calendar.pickAvailableBike = function () {
        if (calendar.pickedBikeSize !== calendar.bikeSize) {
          return calendar.cluster.rides[calendar.pickedBikeSize][0].id;
        } else {
          return calendar.bikeId;
        }
      }

      calendar.onBikeRequest = function() {
        $mdDialog.hide();
        calendar.requested = true;
        api.get('/users/' + $localStorage.userId).then(
          function (success) {
            calendar.rider = success.data;
            verifyOnConfirm();
          },
          function (error) {
            notification.show(error, 'error');
          }
        );
      };


      function verifyOnConfirm() {
        if (calendar.bikeFamily == calendar.event.familyId || isUserVerified()) {
          calendar.confirmBooking();
        }
        else {
          calendar.requested = false;
          verification.openDialog(false, false, false, calendar.confirmBooking);
        }
      }

      function isUserVerified() {
        return calendar.rider.has_address && calendar.rider.confirmed_phone && calendar.rider.status >= 1;
      }

      calendar.promptAuthentication = function(event) {
        authentication.showSignupDialog(false, true, event);
      };

      calendar.isFormInvalid = function() {
        return !calendar.bikeId || !calendar.isDateValid();
      };

      calendar.isDateValid = function() {
        return calendar.startDate && calendar.endDate &&
          calendar.startDate.getTime() < calendar.endDate.getTime();
      }

      /* ---------- CODE FOR THE EVENT CALENDAR 1 ---------- */

      //TODO: We need to update this not scalable example of code.

      calendar.event = {};
      calendar.event.pickupSlotId;
      calendar.event.returnSlotId;
      calendar.event.slots= [];
      calendar.event.familyId = 35; // cwd event
      calendar.freeBike = false; //
      calendar.event.days = _.range(23, 25);

      var slotDuration = 2;
      var eventYear = 2019;
      var eventMonth = 2;   // Months start at 0

      _.forEach(calendar.event.days, function(day) {
        generateSlot(day)
      });

      function generateSlot(day) {
        _.forEach(_.range(9, 20, 2), function(hour) {
          var slot = {
            pickupEnabled: hour !== 19,
            overnight: false,
            reserved: false,
            day: day,
            month: eventMonth,
            year: eventYear,
            text: hour + ":00 - "+ (hour + 2) + ":00",
            hour: hour
          };
          calendar.event.slots.push(slot)
        });
      };

      calendar.event.changePickupSlot = function() {
        // Define picked slot as pickupSlot
        calendar.event.slots[calendar.event.pickupSlotId].pickup = true;
        // Enable all following slots as returnSlots if no booking is in between
        var bookingInBetween = false;
        _.each(calendar.event.slots, function(value, index) {
          if (index >= calendar.event.pickupSlotId) {
            if (value.reserved && calendar.event.slots[index-1].reserved) {
              bookingInBetween = true;
            }
            value.returnDisabled = bookingInBetween;
          } else {
            value.returnDisabled = true;
          }
        });

        var slot = calendar.event.slots[calendar.event.pickupSlotId];
        calendar.startDate = new Date(eventYear, eventMonth, slot.day, slot.hour, 0, 0, 0);

        // Presets returnSlot to be (slotDuration) after pickupSlot
        calendar.event.returnSlotId = parseInt(calendar.event.pickupSlotId);
        // calendar.event.returnSlotId = parseInt(calendar.event.pickupSlotId) + slotDuration;
        calendar.event.changeReturnSlot();
        dateChange(calendar.startDate, calendar.endDate);
      };

      calendar.event.changeReturnSlot = function() {
        var slot = calendar.event.slots[calendar.event.returnSlotId];

        if (slot.overnight) {
          calendar.endDate = new Date(eventYear, eventMonth, slot.day + 1, slot.hour + 2, 0, 0, 0);
        } else {
          calendar.endDate = new Date(eventYear, eventMonth, slot.day, slot.hour + 2, 0, 0, 0);
        }

        dateChange(calendar.startDate, calendar.endDate);
      };

      calendar.event.reserved = function() {
        for (var i = 0; i < calendar.requests.length; i ++) {
          var startDate = new Date(calendar.requests[i].start_date_tz);
          var endDate = new Date(calendar.requests[i].end_date_tz);

          var startDay = startDate.getDate();
          var startTime = moment.utc(calendar.requests[i].start_date_tz).format('HH')
          var endTime = moment.utc(calendar.requests[i].end_date_tz).format('HH')
          var startYear = startDate.getFullYear();
          var startMonth = startDate.getMonth();

          for (var j = 0; j < calendar.event.slots.length; j ++) {
            if (startYear == eventYear &&
                startMonth == eventMonth &&
                calendar.event.slots[j].day == startDay &&
                startTime == calendar.event.slots[j].hour) {
                // Additional Rule: Add this rule to disable time slots before already booked by this user
                // && (calendar.event.slots[j].overnight || calendar.event.slots[j].hour + slotDuration <= endTime))
              calendar.event.slots[j].reserved = true;
              calendar.event.slots[j].text = calendar.event.slots[j].text.split(" ", 1) + ' ('+ $translate.instant('calendar.booked')+')';
              // calendar.event.slots[j].text = calendar.event.slots[j].text + " (booked)";
            }
          }
        }
      };

      /* ------------------------------------------------- */

      calendar.availabilityMessage = function($index, date) {
        if (!calendar.isOptionEnabled($index, calendar.bikeOwner.opening_hours, date)) {
          return openingHoursAvailable() ?  ' ('+ $translate.instant('calendar.status-closed')+')' : ' ('+($translate.instant('calendar.status-in-past'))+')';
        }
      };

      calendar.isOptionEnabled = calendarHelper.isTimeAvailable;


      // This function handles booking and all necessary validations
      calendar.confirmBooking = function () {
        if (calendar.bikeFamily === calendar.event.familyId || calendar.rider.status === 3) {
          showBookingDialog();
        } else {
          // User did not enter any payment method yet
          showPaymentDialog();
        }
      };

      calendar.insuranceCountry = function () {
        if (!!calendar.countryCode) { return _.includes(["DE", "AT"], calendar.countryCode) }
      };

      var showBookingDialog = function (event) {
        $mdDialog.show({
          controller: BookingDialogController,
          controllerAs: 'bookingDialog',
          templateUrl: 'app/modules/bike/calendar/bookingDialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: true // Only for -xs, -sm breakpoints.
        });
      };

      var BookingDialogController = function () {
        var bookingDialog = this;
        bookingDialog.errors = {};
        bookingDialog.inProcess = false;
        bookingDialog.calendar = calendar;
        bookingDialog.total = totalPriceCalculator();
        bookingDialog.balance = calendar.rider.balance;
        bookingDialog.hide = hideDialog;

        bookingDialog.book = function () {
          bookingDialog.inProcess = true;
          var startDate = calendar.startDate;
          var endDate = calendar.endDate;

          // The local timezone-dependent dates get converted into neutral,
          // non-timezone utc dates, preserving the actually selected date values
          var startDate_utc = new Date(
            Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours())
          );
          var endDate_utc = new Date(
            Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endDate.getHours())
          );

          var data = {
            user_id: $localStorage.userId,
            ride_id: calendar.bikeId,
            start_date: startDate_utc.toISOString(),
            end_date: endDate_utc.toISOString()
          };

          api.post('/requests', data).then(
            function(success) {
              calendar.current_request = success.data;
              calendar.current_request.glued = true;
              calendar.current_request.rideChat = $localStorage.userId == calendar.current_request.user.id;

              calendar.current_request.chatFlow = calendar.current_request.rideChat ? "rideChat" : "listChat";
              calendar.current_request.userType = calendar.current_request.rideChat ? "lister" : "user";
              calendar.current_request.userData = calendar.current_request[calendar.current_request.userType];

              calendar.current_request.rating = calendar.current_request.userData.rating_lister + calendar.current_request.userData.rating_rider;
              if (calendar.current_request.userData.rating_lister != 0 &&
                  calendar.current_request.userData.rating_rider != 0) {
                calendar.current_request.rating = calendar.current_request.rating / 2;
              }

              calendar.current_request.rating = Math.round(calendar.current_request.rating);
              $state.go('requests', {requestId: success.data.id});
              bookingDialog.hide();
              $analytics.eventTrack('Book', {  category: 'Request Bike', label: 'Request'});
            },
            function(error) {
              bookingDialog.inProcess = false;
              calendar.requested = false;
              notification.show(error, 'error');
            }
          );
        };

        bookingDialog.cancel = function () {
          bookingDialog.hide();
          calendar.requested = false;
          $analytics.eventTrack('Cancel', {  category: 'Request Bike', label: 'Cancel Request'});
        }
      };

      var showPaymentDialog = function (event) {
        $mdDialog.show({
          controller: PaymentDialogController,
          controllerAs: 'paymentDialog',
          templateUrl: 'app/modules/bike/calendar/paymentDialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: false // Only for -xs, -sm breakpoints.
        });
      };

      var PaymentDialogController = function () {
        var paymentDialog = this;

        paymentDialog.openPaymentForm = function () {
          var w = 550;
          var h = 700;
          var left = (screen.width / 2) - (w / 2);
          var top = (screen.height / 2) - (h / 2);

          var locale = $translate.use();
          $window.open(ENV.userEndpoint + $localStorage.userId + "/payment_methods/new?locale=" + locale, "popup", "width=" + w + ",height=" + h + ",left=" + left + ",top=" + top);
          // For small screens, show Chat Dialog again
          hideDialog();
          calendar.requested = false;
        }
      };

      var hideDialog = function () {
        // For small screens, show Chat Dialog again
        if ($mdMedia('xs')) {
          showChatDialog();
        } else {
          $mdDialog.hide();
        }
      };

      var showChatDialog = function (event) {
        $mdDialog.show({
          controller: ChatDialogController,
          controllerAs: 'chatDialog',
          templateUrl: 'app/modules/bike/calendar/chatDialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: true // Only for -xs, -sm breakpoints.
        });
      };

      var ChatDialogController = function () {
        var chatDialog = this;
        chatDialog.request = calendar.current_request;
        chatDialog.hide = function () {
          $mdDialog.hide();
        };
      };

      function totalPriceCalculator() {
        var total = calendar.total - calendar.rider.balance;
        total >= 0 ? total : total = 0;
        return total
      }

      function getWeekDay(date) {
        var dayOfWeek = date.getDay() - 1;
        if (dayOfWeek == - 1) {
          dayOfWeek = 6;
        }
        return dayOfWeek
      }

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
        if (openingHoursAvailable()) {
          var firstDay = calendar.bikeOwner.opening_hours.hours[getWeekDay(calendar.startDate)];
          var lastDay = calendar.bikeOwner.opening_hours.hours[getWeekDay(calendar.endDate)];
          firstDay = openHours(firstDay);
          lastDay = openHours(lastDay);
          calendar.startTime = firstDay[0];
          calendar.endTime = lastDay[lastDay.length - 1];
          setStartDate(calendar.startTime);
          calendar.endDate = moment(calendar.endDate).hour(calendar.endTime)._d;
        } else {
          calendar.startTime = 10;
          setStartDate(calendar.startTime);
        }
        // If date today
        if (moment(calendar.startDate).isSame(moment(), 'day')) {
          var hour_now = moment().add(1, 'hours').hour();
          if (hour_now < 6) { hour_now = 6 }
          if (hour_now < calendar.startTime && openingHoursAvailable()) {
            hour_now = calendar.startTime
          }
          calendar.startTime = hour_now;
          setStartDate(hour_now);
        }
      }

      function setStartDate(startTime) {
        calendar.startDate = moment(calendar.startDate).hour(startTime)._d;
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
        var isDateClose = false;

        // check if opening hours exist
        if (openingHoursAvailable()) {
          isDateClose = isDateClose || _.isEmpty(calendar.bikeOwner.opening_hours.hours[getWeekDay(date)]);
        }

        // check if availabilities exist and concat with previous results
        if (!_.isEmpty(calendar.bikeAvailabilities)) {
          isDateClose = isDateClose || bikeNotAvailable(date);
        }

        return isDateClose;
      }

      function bikeNotAvailable(date) {
        var result = false;
        _.forEach(calendar.bikeAvailabilities, function(slot) {
          var start_at = moment(slot.start_date).subtract(1, 'd');
          var end_at = moment(slot.start_date).add(slot.duration, 'd');
          if (result) return result;
          result = result || moment(date).isBetween(start_at, end_at, null, '[]') // all inclusive
        });
        return result
      }

      function openingHoursAvailable() {
        return calendar.bikeOwner &&
          !!calendar.bikeOwner.opening_hours &&
          calendarHelper.checkIsOpeningHoursEnabled(calendar.bikeOwner.opening_hours) &&
          _.some(calendar.bikeOwner.opening_hours.hours, Array)
      }

      // The data for cluster bike will be reserved only if all bikes in cluster reserved on this date
      function isReserved(date) {
        return isReservedPrimary(date) && isAllClusterReserved(date);
      }

      function isReservedDate(date, requests) {
        for (var i = 0; i < requests.length; ++i) {
          var start = new Date(requests[i].start_date_tz);
          start.setHours(0, 0, 0, 0);
          var end = new Date(requests[i].end_date_tz);
          end.setHours(0, 0, 0, 0);

          if (start.getTime() <= date.getTime() &&
            date.getTime() <= end.getTime()) {
            return true;
          }
        }
        return false;
      }

      function isReservedPrimary(date) {
        return isReservedDate(date, calendar.requests);
      }

      function isAllClusterReserved(date) {
        // for single bike always return true
        if (!calendar.bike.is_cluster) return true;

        var isClusterBikeReserved = true;
        _.forEach(calendar.bikeCluster.variations, function(variant) {
          isClusterBikeReserved = isClusterBikeReserved && isReservedDate(date, variant.requests)
        });

        return isClusterBikeReserved;
      }

      function initOverview() {
        calendar.startTime = 10;
        calendar.endTime = 18;

        calendar.duration = date.duration(undefined, undefined, 0);
        calendar.subtotal = 0;
        calendar.lnrFee = 0;
        calendar.total = 0;

        calendar.formValid = false;
        calendar.datesValid = false;
      }

      // TODO: Replace custom receipt with modular receipt component in calendar template
      function dateChange(startDate, endDate) {
        if (calendar.isDateValid()) {
          var invalidDays = countInvalidDays(startDate, endDate);
          calendar.duration = date.duration(startDate, endDate, invalidDays);
          calendar.durationDays = date.durationDays(startDate, endDate);
          var prices = price.calculatePrices(startDate, endDate, calendar.prices, calendar.coverageTotal);
          calendar.subtotal = prices.subtotal;
          calendar.discount = prices.subtotal - prices.subtotalDiscounted;
          calendar.discountRelative = calendar.discount / calendar.durationDays;
          calendar.lnrFee = prices.serviceFee;
          calendar.total = prices.total;

          if (calendar.cluster) {
            bikeCluster.getAvailableClusterBikes(calendar.cluster.id, startDate, endDate).then(function (response) {
              // return new rides that are available in current period
              calendar.cluster.rides = response.data.rides;
              bikeCluster.markAvailableSizes(calendar.bikeClusterSizes, calendar.cluster.rides);

              // update scope one more time
              _.defer(function () {
                $scope.$apply();
              });
            });
          }

        } else {
          calendar.duration = date.duration(undefined, undefined, 0);
          calendar.subtotal = 0;
          calendar.lnrFee = 0;
          calendar.total = 0;
        }
      }

      function countInvalidDays(startDate, endDate){
        var totalDays = Math.abs( startDate.getDate() - endDate.getDate() ) + 1;
        var currentDay = new Date(endDate);
        currentDay.setHours(0, 0, 0, 0);
        var i = 0;
        var invalidDays = 0;
        while (i < totalDays) {
          i++;
          if (isReserved(currentDay)) invalidDays++;
          currentDay.setDate(currentDay.getDate() - 1);
          currentDay.setHours(0, 0, 0, 0);
        }
        return invalidDays;
      }
    }
  ]
});
