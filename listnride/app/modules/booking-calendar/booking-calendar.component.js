'use strict';

angular.module('bookingCalendar', []).component('bookingCalendar', {
  templateUrl: 'app/modules/booking-calendar/booking-calendar.template.html',
  controllerAs: 'booking-calendar',
  controller: ['$state', '$translate', '$translatePartialLoader', '$stateParams', 'ENV',
    function BookingCalendarController($state, $translate, $tpl, $stateParams, ENV) {
      var bookingCalendar = this;

      bookingCalendar.$onInit = function () {

      }

    }
  ]
});