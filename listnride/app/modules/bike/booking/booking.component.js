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
        booking.selectedIndex = 0;
      };

      // toggle confirm phone button
      booking.toggleConfirmButton = function () {
        booking.showConfirmButton = !booking.showConfirmButton;
      };

      // go to next tab
      booking.nextTab = function () {
        console.log("booking: ", booking);
        booking.selectedIndex = booking.selectedIndex + 1;
      };

      // go to previous tab
      booking.previousTab = function () {
        booking.selectedIndex = booking.selectedIndex - 1;
      };
    }]
  })
  // personal tab ui component
  .component('personalTab', {
    templateUrl: 'app/modules/bike/booking/personal-tab.template.html',
    require: {parent: '^booking'},
    controllerAs: 'personal'
  })
  // payment tab ui component
  .component('paymentTab', {
    templateUrl: 'app/modules/bike/booking/payment-tab.template.html',
    require: {parent: '^booking'},
    controllerAs: 'payment'
  })
  // overview tab ui component
  .component('overviewTab', {
    templateUrl: 'app/modules/bike/booking/overview-tab.template.html',
    require: {parent: '^booking'},
    controllerAs: 'overview'
  });
