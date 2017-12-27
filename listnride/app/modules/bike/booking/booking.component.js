'use strict'

// TODO: make it part of bike module. No separate module required
angular.module('booking', []).component('booking', {
  templateUrl: 'app/modules/bike/booking/booking.template.html',
  controllerAs: 'booking',
  controller: ['authentication', function BookingController(authentication) {
    var booking = this;

    // on lifecycle initialization
    booking.$onInit = function () {
      booking.authentication = authentication;
      booking.showConfirmButton = true;
    };

    // toggle confirm phone button
    booking.toggleConfirmButton = function(){
      booking.showConfirmButton = !booking.showConfirmButton;
    }
  }]
});