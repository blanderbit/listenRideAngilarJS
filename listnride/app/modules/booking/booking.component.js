'use strict'

angular.module('booking', [])
// booking component
  .component('booking', {
    transclude: true,
    templateUrl: 'app/modules/booking/booking.template.html',
    controllerAs: 'booking',
    controller: [
      '$localStorage', '$rootScope', '$scope', '$state', '$stateParams', '$mdToast',
      '$timeout', '$analytics', 'ENV', '$translate', '$filter', 'authentication',
      'api', 'price', 'voucher', 'countryCodeTranslator', 'calendarHelper', 'notification',
      function BookingController(
        $localStorage, $rootScope, $scope, $state, $stateParams, $mdToast, $timeout, $analytics,
        ENV, $translate, $filter, authentication, api, price, voucher, countryCodeTranslator, calendarHelper, notification) {
        var booking = this;
        var btAuthorization = ENV.btKey;
        var btClient;
        var btPpInstance;

        booking.bikeId = $stateParams.bikeId;
        booking.shopBooking = $stateParams.shop;

        booking.startDate = new Date($stateParams.startDate);
        booking.endDate = new Date($stateParams.endDate);

        booking.user = {};
        booking.bike = {};
        booking.phoneConfirmed = 'progress';
        booking.selectedIndex = 0;
        booking.hidden = true;
        booking.tabsDisabled = false;
        booking.voucherCode = "";
        booking.expiryDate = "";
        booking.booked = false;
        booking.processing = false;
        booking.isPremium = false;
        booking.bike.country_code = "";
        booking.user.balance = 0;
        booking.insuranceCountries = ['DE', 'AT'];
        booking.isOpeningHoursLoaded = false;

        var oldExpiryDateLength = 0;
        var expiryDateLength = 0;
        var month = 0;
        var year = 0;

        var getLister = function() {
          api.get('/users/' + booking.bike.user.id).then(
            function (success) {
              booking.openingHours = success.data.opening_hours;
              booking.isOpeningHoursLoaded = true;
            },
            function (error) {
              // Treat opening hours as if non existing
              notification.show(error, 'error');
              booking.openingHours = [];
              booking.isOpeningHoursLoaded = true;
            }
          );
        };

        // Fetch Bike Information
        api.get('/rides/' + booking.bikeId).then(
          function (success) {
            booking.bike = success.data;
            booking.coverageTotal = booking.bike.coverage_total || 0;
            getLister();
            booking.bikeCategory = $translate.instant($filter('category')(booking.bike.category));
            if (booking.bike.size === 0) {
              booking.bikeSize = $translate.instant("search.unisize");
            } else {
              booking.bikeSize = booking.bike.size + " - " + (parseInt(booking.bike.size) + 10) + "cm";
            }
            booking.prices = booking.bike.prices;
            updatePrices();
          },
          function (error) {
            notification.show(error, 'error');
            $state.go('home');
          }
        );

        booking.insuranceAllowed = function () {
          return _.includes(["DE", "AT"], booking.bike.country_code);
        };

        // on lifecycle initialization
        booking.$onInit = function () {
          booking.calendarHelper = calendarHelper;
          booking.authentication = authentication;
          booking.showConfirmButton = true;
          booking.emailPattern = /(?!^[.+&'_-]*@.*$)(^[_\w\d+&'-]+(\.[_\w\d+&'-]*)*@[\w\d-]+(\.[\w\d-]+)*\.(([\d]{1,3})|([\w]{2,}))$)/i;
          booking.phonePattern = /^\+(?:[0-9] ?){6,14}[0-9]$/;
        };

        booking.resetPassword = function() {
          //Set from error if any
          var form = booking.loginForm;
          form.email.$touched = true;
          if (form.email.$modelValue) {
            authentication.forgetGlobal(form.email.$modelValue)
          }
        };

        booking.dateRange = {};

        booking.updateDate = function() {
          if (booking.dateRange.start_date) {
            var startDate = new Date(booking.dateRange.start_date);
            booking.startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 10, 0, 0);
            booking.endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + booking.dateRange.duration, 18, 0, 0);
            booking.startTime = 10;
            booking.endTime = 18;
            booking.subtotal = price.calculatePrices(booking.startDate, booking.endDate, booking.prices).subtotal;
            booking.total = booking.subtotal = price.calculatePrices(booking.startDate, booking.endDate, booking.prices).total;
          }
          // TODO: REMOVE REDUNDANT PRICE CALCULATION CODE
        };

        booking.onTimeChange = function(slot) {
          var slotDate = slot + "Date";
          var slotTime = slot + "Time";
          var date = new Date(booking[slotDate]);
          date.setHours(booking[slotTime], 0, 0, 0);
          booking[slotDate] = date;
          if (!validDates()) {
            booking.startDate = "Invalid Date";
            booking.endDate = "Invalid Date";
          }
          // dateChange(booking.startDate, booking.endDate);
        };

        booking.tabCompleted = function(tabId) {
          return booking.selectedIndex > tabId ? "✔" : "    ";
        };

        booking.addVoucher = function() {
          voucher.addVoucher(booking.voucherCode);
          booking.reloadUser();
          booking.voucherCode = "";
          $analytics.eventTrack('click', {category: 'Request Bike', label: 'Add Voucher'});
        };

        booking.nextDisabled = function() {
          if (!booking.shopBooking) {
            switch (booking.selectedIndex) {
              case 0: return false;
              case 1: return !(booking.phoneConfirmed === 'success' && booking.validAddress && booking.verificationForm.$valid && !booking.processing);
              case 2: return !booking.paymentForm.$valid;
              case 3: return false;
            }
          } else {
            switch (booking.selectedIndex) {
              case 0: return !validDates();
              case 1: return !(booking.phoneConfirmed === 'success' && booking.validAddress && booking.detailsForm.$valid && booking.verificationForm.$valid);
              case 2: return !booking.paymentForm.$valid;
              case 3: return false;
            }
          }
        };

        function validDates() {
          return booking.endDate != "Invalid Date" && booking.startDate.getTime() < booking.endDate.getTime();
        }

        function updatePrices() {
          var prices = price.calculatePrices(booking.startDate, booking.endDate, booking.prices, booking.coverageTotal, booking.isPremium);
          booking.subtotal = prices.subtotal;
          booking.subtotalDiscounted = prices.subtotalDiscounted;
          booking.lnrFee = prices.serviceFee;
          booking.premiumCoverage = prices.premiumCoverage;
          booking.total = Math.max(prices.total - booking.user.balance, 0);
        }

        booking.premiumChange =function() {
          updatePrices()
        };

        booking.resendSms = function() {
          booking.toggleConfirmButton();
          booking.phoneConfirmed = 'progress';
          booking.confirmation_0 = '';
          booking.confirmation_1 = '';
          booking.confirmation_2 = '';
          booking.confirmation_3 = '';
        };

        booking.nextAction = function() {
          switch (booking.selectedIndex) {
            case 0:
              if (booking.shopBooking) {
                booking.selectedIndex = 1;
                setFirstTab(); break;
              } else {
                booking.goNext(); break;
              }
            case 1: booking.saveAddress(); break;
            case 2: booking.tokenizeCard(); break;
            case 3: booking.book(); break;
            default: booking.goNext(); break;
          }
        };

        // Braintree Client Setup
        braintree.client.create({
          authorization: btAuthorization
        }, function (err, client) {
          if (err) {
            // TODO: show braintree errors. Find documentation
            return;
          }
          btClient = client;
          braintree.paypal.create(
            {client: btClient},
            function (ppErr, ppInstance) {
              btPpInstance = ppInstance;
            }
          );
        });

        booking.saveAddress = function() {
          booking.processing = true;
          var address = {
            'locations': {
              '0': {
                "street": booking.address.street + " " + booking.address.streetNumber,
                "zip": booking.address.zip,
                "city": booking.address.city,
                "country": booking.address.country,
                "primary": true
              }
            }
          };
          api.put('/users/' + $localStorage.userId, address).then(
            function (success) {
              booking.processing = false;
              booking.nextTab();
            },
            function (error) {
              booking.processing = false;
              notification.show(error, 'error');
            }
          );
        };

        booking.tokenizeCard = function() {
          notification.show(null, null, 'booking.payment.getting-saved');

          btClient.request({
            endpoint: 'payment_methods/credit_cards',
            method: 'post',
            data: {
              creditCard: {
                number: booking.creditCardNumber,
                expirationDate: booking.expiryDate,
                cvv: booking.securityNumber
              }
            }
          }, function (err, response) {
            if (!err) {
              var data = {
                "payment_method_nonce": response.creditCards[0].nonce,
                "last_four": response.creditCards[0].details.lastFour
              };
              api.post('/users/' + authentication.userId() + '/payment_methods', data).then(
                function (success) {
                  booking.reloadUser();
                },
                function (error) {
                  notification.show(error, 'error');
                }
              );
            }
            // Send response.creditCards[0].nonce to your server
          });
        };

        booking.openPaypal = function() {
          btPpInstance.tokenize({ flow: 'vault' },
            function (tokenizeErr, payload) {
              if (tokenizeErr) {
                return;
              }
              var data = {
                "payment_method_nonce": payload.nonce
              };
              api.post('/users/' + authentication.userId() + '/payment_methods', data).then(
                function (success) {
                  booking.reloadUser();
                },
                function (error) {
                  notification.show(error, 'error');
                }
              );
            }
          );
        };

        booking.reloadUser = function() {
          api.get('/users/' + $localStorage.userId).then(
            function (success) {
              var oldUser = booking.user;
              booking.user = success.data;
              booking.user.firstName = success.data.first_name;
              booking.user.lastName = success.data.last_name;
              booking.creditCardHolderName = booking.user.first_name + " " + booking.user.last_name;
              // if (!booking.shopBooking || Object.keys(oldUser).length > 0) {
                setFirstTab();
              // }
              updatePrices();
              $timeout(function () {
                booking.hidden = false;
              }, 120);
              api.get('/users/' + $localStorage.userId + '/current_payment').then(
                function(response) {
                  booking.user.current_payment_method = response.data;
                },
                function(error) {
                  notification.show(error, 'error');
                }
              );
            },
            function (error) {
              notification.show(error, 'error');
            }
          );
        };

        function setFirstTab() {
          if (!booking.shopBooking || booking.selectedIndex > 0) {
            if (booking.user.status == 3) {
              booking.selectedIndex = 3;
              trackTabLoad();
            }
            else if (booking.user.has_phone_number && booking.user.has_address) {
              booking.selectedIndex = 2;
              trackTabLoad();
            } else {
              booking.selectedIndex = 1;
              trackTabLoad();
            }
          }
        }

        booking.emailSignup = function () {
          var user = {
            email: booking.user.email,
            firstName: booking.user.firstName,
            lastName: booking.user.lastName,
            password: booking.user.password
          }
          booking.authentication.signupGlobal(user);
        };

        booking.prepareUser = function() {
          var user = {
            email: booking.user.email,
            firstName: booking.user.firstName,
            lastName: booking.user.lastName
          }
          if (booking.shopBooking && !booking.authentication.loggedIn()) {
            booking.authentication.signupGlobal(user);
          } else {
            booking.sendSms(booking.verificationForm.phone_number);
          }
        }

        // phone confirmation
        //TODO: move to shared logic
        booking.sendSms = function (numberInput) {
          if (!_.isEmpty(numberInput.$error)) { return }
          var data = {"phone_number": numberInput.$modelValue};
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
              notification.show(error, 'error');
            }
          );
        };

        booking.confirmPhone = function () {
          var form = booking.verificationForm;
          var codeDigits = form.confirmation_0.$viewValue + form.confirmation_1.$viewValue + form.confirmation_2.$viewValue + form.confirmation_3.$viewValue;
          if (codeDigits.length === 4) {
            var data = { "phone_confirmation_code": codeDigits};
            api.post('/confirm_phone', data).then(
              function (success) {
                booking.toggleConfirmButton();
                booking.phoneConfirmed = 'success';
              },
              function (error) {
                notification.show(error, 'error');
                booking.phoneConfirmed = 'error';
              }
            );
          }
        };

        // toggle confirm phone button
        booking.toggleConfirmButton = function () {
          booking.showConfirmButton = !booking.showConfirmButton;
        };

        // controls behavior of "next" button
        booking.goNext = function () {
          switch(booking.selectedIndex) {
            case 0:
              if (booking.shopBooking) {
                setFirstTab();
              }
            case 2:
              booking.tokenizeCard(); break;
            default:
              booking.nextTab(); break
          }
        };

        // go to next tab
        booking.nextTab = function () {
          booking.selectedIndex = booking.selectedIndex + 1;
          trackTabLoad();
        };

        // go to previous tab
        booking.previousTab = function () {
          booking.selectedIndex = booking.selectedIndex - 1;
          trackTabLoad();
        };

        function trackTabLoad() {
          $("#scroll-body").scrollTop(0);
          switch (booking.selectedIndex) {
            case 0: $analytics.eventTrack('load', {category: 'Request Bike', label: 'Sign Up Tab'}); break;
            case 1: $analytics.eventTrack('load', {category: 'Request Bike', label: 'Details Tab'}); break;
            case 2: $analytics.eventTrack('load', {category: 'Request Bike', label: 'Payment Tab'}); break;
            case 3: $analytics.eventTrack('load', {category: 'Request Bike', label: 'Summary Tab'}); break;
          }
        }

        booking.updateExpiryDate = function () {
          expiryDateLength = booking.expiryDate.toString().length;
          month = booking.expiryDate.toString().split("/")[0];
          year = booking.expiryDate.toString().split("/")[1];
          if (expiryDateLength == 1 && oldExpiryDateLength != 2 && parseInt(month) > 1) {
            booking.expiryDate = "0" + booking.expiryDate + "/";
          }
          if (expiryDateLength == 2 && oldExpiryDateLength < 2) {
            booking.expiryDate += "/";
          }
          if (oldExpiryDateLength == 4 && expiryDateLength == 3) {
            booking.expiryDate = month;
          }
          oldExpiryDateLength = expiryDateLength;
        };

        booking.validateExpiryDate = function() {
          var dateInput = booking.paymentForm.expiryDate;
          if (expiryDateLength != 5) {
            dateInput.$setValidity('dateFormat', false);
          } else {
            if (year > 18 && year < 25 && month >= 1 && month <= 12) {
              dateInput.$setValidity('dateFormat', true);
            }
            else if (year == 18 && month >= 2 && month <= 12) {
              dateInput.$setValidity('dateFormat', true);
            }
            else {
              dateInput.$setValidity('dateFormat', false);
            }
          }
        };

        // TODO: This needs to be refactored, rootScopes are very bad practice
        // go to next tab on user create success
        $rootScope.$on('user_created', function () {
          if (booking.shopBooking) {
            booking.sendSms(booking.verificationForm.phone_number);
          } else {
            booking.reloadUser();
          }
        });

        // go to next tab on user login success
        $rootScope.$on('user_login', function () {
          booking.reloadUser();
        });

        angular.element(document).ready(function () {
          // set User data if registered
          if (authentication.loggedIn()) {
            booking.reloadUser();
          } else {
            booking.hidden = false;
          }
        });

        booking.fillAddress = function(place) {
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
        };

        booking.book = function () {
          $analytics.eventTrack('click', {category: 'Request Bike', label: 'Request Now'});
          booking.inProcess = true;
          var startDate = booking.startDate;
          var endDate = booking.endDate;

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
            ride_id: booking.bikeId,
            start_date: startDate_utc.toISOString(),
            end_date: endDate_utc.toISOString(),
            instant: booking.shopBooking,
            insurance: {
              premium: booking.isPremium
            }
          };


          api.post('/requests', data).then(
            function(success) {
              $analytics.eventTrack('Book', {  category: 'Request Bike', label: 'Request'});
              if (!booking.shopBooking) {
                $state.go('requests', {requestId: success.data.id});
              }
              booking.booked = true;
            },
            function(error) {
              booking.inProcess = false;
              notification.show(error, 'error');
            }
          );
        };
      }
    ]
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
  })
  // overview tab ui component
  .component('calendarTab', {
    templateUrl: 'app/modules/booking/calendar-tab.template.html',
    require: {parent: '^booking'},
    controllerAs: 'calendar'
  });
