'use strict'

angular.module('booking', [])
// booking component
  .component('booking', {
    transclude: true,
    templateUrl: 'app/modules/booking/booking.template.html',
    controllerAs: 'booking',
    controller: ['$localStorage', '$rootScope', '$mdToast', 'authentication', 'api',
      function BookingController($localStorage, $rootScope, $mdToast, authentication, api) {
      var booking = this;

      booking.user = {};
      booking.confirmation = '';
      booking.phoneConfirmed = 'progress';

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


      // set User data if registered
      if ($localStorage.userId !== 'undefined') {
        booking.user.firstName = $localStorage.firstName;
        booking.user.lastName = $localStorage.lastName;
        booking.user.email = $localStorage.email;
      }

      // on lifecycle initialization
      booking.$onInit = function () {
        booking.authentication = authentication;
        booking.showConfirmButton = true;
        booking.selectedIndex = 0;
        booking.emailPattern = /(?!^[.+&'_-]*@.*$)(^[_\w\d+&'-]+(\.[_\w\d+&'-]*)*@[\w\d-]+(\.[\w\d-]+)*\.(([\d]{1,3})|([\w]{2,}))$)/i;
        booking.phonePattern = /^\+(?:[0-9] ?){6,14}[0-9]$/;
      };



      // phone confirmation
      //TODO: move to shared logic
      booking.sendSms = function (number) {
        var data = {"phone_number": number.$modelValue};
        booking.toggleConfirmButton();
        api.post('/users/' + $localStorage.userId + '/update_phone', data).then(
          function (success) {
            $mdToast.show(
              $mdToast.simple()
                .textContent('An SMS with a confirmation code was sent to you just now.')
                .hideDelay(4000)
                .position('top center')
            );
          },
          function (error) {
          }
        );
      };

      booking.confirmPhone = function () {
        var codeDigits = _.values(booking.confirmation).filter(Number);
        if (codeDigits.length === 4) {
          var data = { "confirmation_code": codeDigits.join('') };
          api.post('/users/' + $localStorage.userId + '/confirm_phone', data).then(
            function (success) {
              booking.phoneConfirmed = 'success';
            },
            function (error) {
              booking.phoneConfirmed = 'error';
            }
          );
        }
      };

      // toggle confirm phone button
      booking.toggleConfirmButton = function () {
        booking.showConfirmButton = !booking.showConfirmButton;
      };

      // go to next tab
      booking.nextTab = function () {
        booking.selectedIndex = booking.selectedIndex + 1;
      };

      // go to previous tab
      booking.previousTab = function () {
        booking.selectedIndex = booking.selectedIndex - 1;
      };

        booking.fillAddress = function(place) {
          debugger
          var components = place.address_components;
          if (components) {
            var desiredComponents = {
              "street_number": "",
              "route": "",
              "locality": "",
              "country": "",
              "postal_code": ""
            };

            for (var i = 0; i < components.length; i++) {
              var type = components[i].types[0];
              if (type in desiredComponents) {
                desiredComponents[type] = components[i].long_name;
              }
            }

            booking.user.street = desiredComponents.route + " " + desiredComponents.street_number;
            booking.user.zip = desiredComponents.postal_code;
            booking.user.city = desiredComponents.locality;
            booking.user.country = desiredComponents.country;
          }
        }
      }]
  })
  // signup tab ui component
  .component('signupTab', {
    templateUrl: 'app/modules/booking/signup-tab.template.html',
    require: {parent: '^booking'},
    controllerAs: 'signup'
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
