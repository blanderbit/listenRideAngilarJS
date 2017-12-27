'use strict'

angular.module('booking', [])
  // booking component
  .component('booking', {
    transclude: true,
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
  // personal tab ui component
  .component('personalTab', {
    templateUrl: 'app/modules/bike/booking/personal-tab.template.html',
    require: { booking: '^booking' },
    controllerAs: 'personal'
  })
  // payment tab ui component
  .component('paymentTab', {
    templateUrl: 'app/modules/bike/booking/payment-tab.template.html',
    require: { booking: '^booking' },
    controllerAs: 'payment'
  })
  // overview tab ui component
  .component('overviewTab', {
    templateUrl: 'app/modules/bike/booking/overview-tab.template.html',
    require: { booking: '^booking' },
    controllerAs: 'overview'
  })
