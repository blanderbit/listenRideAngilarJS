'use strict'

angular.module('booking', [])
  // personal tab ui component
  .component('personalTab', {templateUrl: 'app/modules/bike/booking/personal-tab.template.html'})
  // payment tab ui component
  .component('paymentTab', {templateUrl: 'app/modules/bike/booking/payment-tab.template.html'})
  // overview tab ui component
  .component('overviewTab', {templateUrl: 'app/modules/bike/booking/overview-tab.template.html'})
  // booking component
  .component('booking', {
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
      booking.toggleConfirmButton = function () {
        booking.showConfirmButton = !booking.showConfirmButton;
      }
    }]
  })
