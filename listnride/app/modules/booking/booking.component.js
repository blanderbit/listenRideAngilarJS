'use strict'

angular.module('booking', [])
// booking component
  .component('booking', {
    transclude: true,
    templateUrl: 'app/modules/booking/booking.template.html',
    controllerAs: 'booking',
    controller: ['authentication', function BookingController(authentication) {
      var booking = this;

      // TODO: Remove hardcorded values for testing receipt module
      booking.startDate = new Date();
      booking.endDate = new Date();
      booking.endDate.setDate(booking.startDate.getDate() + 1);

      booking.prices = [
        {
          id: 7921,
          start_at: 0,
          price: "20.0"
        },
        {
          id: 7922,
          start_at: 86400,
          price: "20.0"
        },
        {
          id: 7923,
          start_at: 172800,
          price: "20.0"
        },
        {
          id: 7924,
          start_at: 259200,
          price: "20.0"
        },
        {
          id: 7925,
          start_at: 345600,
          price: "20.0"
        },
        {
          id: 7926,
          start_at: 432000,
          price: "20.0"
        },
        {
          id: 7927,
          start_at: 518400,
          price: "10.0"
        },
        {
          id: 7928,
          start_at: 604800,
          price: "10.0"
        },
        {
          id: 7929,
          start_at: 2419200,
          price: "10.0"
        }
      ];

      // on lifecycle initialization
      booking.$onInit = function () {
        booking.authentication = authentication;
        booking.showConfirmButton = true;
        booking.selectedIndex = 0;
        booking.emailPattern = /(?!^[.+&'_-]*@.*$)(^[_\w\d+&'-]+(\.[_\w\d+&'-]*)*@[\w\d-]+(\.[\w\d-]+)*\.(([\d]{1,3})|([\w]{2,}))$)/i;
        booking.phonePattern = /^\+(?:[0-9] ?){6,14}[0-9]$/;
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
  // sign in tab ui component
  .component('signInTab', {
    templateUrl: 'app/modules/booking/sign-in-tab.template.html',
    require: {parent: '^booking'},
    controllerAs: 'signIn'
  })
  // details tab ui component
  .component('detailsTab', {
    templateUrl: 'app/modules/booking/details-tab.template.html',
    require: {parent: '^booking'},
    controllerAs: 'details'
  })
  // payment tab ui component
  .component('paymentTab', {
    templateUrl: 'app/modules/booking/payment-tab.template.html',
    require: {parent: '^booking'},
    controllerAs: 'payment'
  })
  // overview tab ui component
  .component('overviewTab', {
    templateUrl: 'app/modules/booking/overview-tab.template.html',
    require: {parent: '^booking'},
    controllerAs: 'overview'
  });
