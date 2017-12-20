'use strict'

angular.module('bike').component('booking', {
  templateUrl: 'app/modules/bike/booking/booking.template.html',
  bindings: {
    booking: '<'
  },
  controllerAs: 'booking',
  controller: ['BookingService', function BookingController() {
    var booking = this;
    console.log("booking: ", booking);
  }]
});