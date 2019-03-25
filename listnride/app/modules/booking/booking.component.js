'use strict'

angular.module('booking', [])
// booking component
  .component('booking', {
    transclude: true,
    templateUrl: 'app/modules/booking/booking.template.html',
    controllerAs: 'booking',
    controller: [
      '$localStorage', '$rootScope', '$scope', '$state', '$stateParams',
      '$timeout', '$analytics', '$translate', '$filter', 'authentication',
      'api', 'price', 'voucher', 'calendarHelper', 'notification', 'paymentHelper', 'bikeCluster',
       function BookingController(
        $localStorage, $rootScope, $scope, $state, $stateParams, $timeout, $analytics,
        $translate, $filter, authentication, api, price, voucher, calendarHelper, notification, paymentHelper, bikeCluster) {
        var booking = this;

        booking.$onInit = function () {
          // VARIABLES
          booking.showConfirmButton = true;
          booking.emailPattern = /(?!^[.+&'_-]*@.*$)(^[_\w\d+&'-]+(\.[_\w\d+&'-]*)*@[\w\d-]+(\.[\w\d-]+)*\.(([\d]{1,3})|([\w]{2,}))$)/i;
          booking.phonePattern = /^\+(?:[0-9] ?){6,14}[0-9]$/;
          booking.tabOrder = {
            'calendar': 0,
            'sign-in': 1,
            'details': 2,
            'payment': 3,
            'overview': 4
          }
          // get StateParams
          booking.bikeId = $stateParams.bikeId;
          booking.shopBooking = $stateParams.shop;
          // booking from SHOP PLUGIN starts without information about dates
          booking.startDate = $stateParams.startDate ? new Date($stateParams.startDate) : null;
          booking.endDate = $stateParams.endDate ? new Date($stateParams.endDate) : null;
          // default
          booking.user = {};
          booking.bike = {};
          booking.phoneConfirmed = 'progress';
          booking.selectedIndex = 0;
          booking.hidden = false;
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
          booking.creditCardData = {}
          booking.paymentDescription = '';

          // METHODS
          booking.calendarHelper = calendarHelper;
          booking.authentication = authentication;
          booking.savePaymentOption = savePaymentOption;
          booking.sendCode = sendCode;

          // INVOCATIONS
          paymentHelper.setupBraintreeClient();
          getBikeData();

          // After material tabs inited
          $timeout(function () {
            authentication.loggedIn() ? booking.reloadUser() : setFirstTab();
          }, 0);

        };

        function getBikeData() {
          api.get('/rides/' + booking.bikeId).then(
            function (success) {
              booking.bike = success.data.current;
              booking.coverageTotal = booking.bike.coverage_total || 0;
              booking.bikeCategory = $translate.instant($filter('category')(booking.bike.category));
              booking.bikeSize = booking.bike.size === 0 ? $translate.instant("search.unisize") : booking.bike.size + " - " + (parseInt(booking.bike.size) + 10) + "cm";
              booking.pickedBikeSize = $state.params.size ? $state.params.size : booking.bike.size;
              booking.prices = booking.bike.prices;
              getLister();
              updatePrices();


              // EVENT BIKE LOGIC
              if (booking.bike.family == 35) {
                booking.coverageTotal = 0;
                booking.bike.event = {
                  id: 35,
                  name: 'Cycling World',
                  date: '23032019',
                  duration: 2,
                  type: 'slot',
                  slot_range: 2,
                  insurance: false
                }
              }

              // CLUSTER BIKE LOGIC
              if (booking.bike.is_cluster) {
                booking.cluster = success.data.cluster;
                booking.bikeClusterSizes = booking.cluster.sizes;
                bikeCluster.getSizeTranslations(booking.bikeClusterSizes);

                // remove primary bike from variations array
                booking.cluster.variations = _.filter(booking.cluster.variations, function (variant) {
                  return variant.id !== booking.bike.id;
                });


                // change some params to cluster merged params
                booking.bike.accessories = booking.cluster.accessories;
                booking.bike.ratings = booking.cluster.ratings;
              }
            },
            function (error) {
              notification.show(error, 'error');
              $state.go('home');
            }
          );
        }

        function getLister() {
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
        }

        booking.insuranceAllowed = function () {
          return insuranceCountry() && eventBikeIncludeInsurance();
        };

        function insuranceCountry() {
          return _.includes(booking.insuranceCountries, booking.bike.country_code)
        }

        function eventBikeIncludeInsurance() {
          return booking.bike.event ? booking.bike.event.insurance : true;
        }

        booking.resetPassword = function() {
          //Set from error if any
          var form = booking.loginForm;
          form.email.$touched = true;
          if (form.email.$modelValue) {
            authentication.forgetGlobal(form.email.$modelValue)
          }
        };

        function getTabNameByOrder(index) {
          return (_.invert(booking.tabOrder))[index];
        }

        function updateState (params) {
          $state.go(
            $state.current,
            params,
            { notify: false }
          );
        };

        // ===============================
        // >>>> START BOOKING CALENDAR TAB
        // ===============================

        booking.dateRange = {};

        booking.updateDate = function() {
          if (booking.dateRange.start_date) {
            var startDate = new Date(booking.dateRange.start_date);
            booking.startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 10, 0, 0);
            booking.endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + booking.dateRange.duration, 18, 0, 0);
            updatePrices();
            setInitHours();
            booking.isDateValid = validDates();
            bikeCluster.updateCluster(booking, booking.startDate, booking.endDate, $scope);
          }
          // TODO: REMOVE REDUNDANT PRICE CALCULATION CODE
        };

        function setInitHours() {
          var openTime = calendarHelper.getInitHours(booking.openingHours, booking.startDate, booking.endDate);
          booking.startTime = openTime.startTime;
          booking.endTime = openTime.endTime;
          booking.startDate = openTime.startDate;
          booking.endDate = openTime.endDate;
        }

        booking.onTimeChange = function(slot) {
          var slotDate = slot + "Date"; // startDate, endDate
          var slotTime = slot + "Time"; // startTime, endTime
          var date = new Date(booking[slotDate]);
          date.setHours(booking[slotTime], 0, 0, 0);
          booking[slotDate] = date;

          validDates();
        };

        function validDates() {
          return booking.startDate && booking.endDate &&
            booking.endDate != "Invalid Date" &&
            booking.startDate.getTime() < booking.endDate.getTime();
        }

        // =================================
        // START BOOKING CALENDAR TAB <<<<<<
        // =================================

        booking.tabCompleted = function(label) {
          return booking.selectedIndex > booking.tabOrder[label] ? "✔" : "    ";
        };

        booking.addVoucher = function() {
          voucher.addVoucher(booking.voucherCode).then(function(response){
            $analytics.eventTrack('click', {category: 'Request Bike', label: 'Add Voucher'});
            booking.voucherCode = "";
            booking.reloadUser();
          }, null);
        };

        booking.nextDisabled = function() {
          switch (getTabNameByOrder(booking.selectedIndex)) {
            case 'calendar': return !validDates();
            case 'sign-in': return false;
            case 'details': return !checkValidDetails();
            case 'payment': return !checkValidPayment();
            case 'overview': return false;
          }
        };

        function checkValidDetails() {
          return booking.phoneConfirmed === 'success' &&
                 booking.validAddress &&
                 booking.verificationForm.$valid &&
                 !booking.processing
        }

        function checkValidPayment() {
          return booking.paymentMethod === 'current' || booking.paymentForm.$valid;
        }

        function updatePrices() {
          var prices = price.calculatePrices(booking.startDate, booking.endDate, booking.prices, booking.coverageTotal, booking.isPremium, booking.shopBooking);
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

        booking.nextAction = function () {
          switch (getTabNameByOrder(booking.selectedIndex)) {
            case 'calendar': {
              updateState({startDate: booking.startDate, endDate: booking.endDate});
              setFirstTab();
              break;
            }
            case 'sign-in': setFirstTab(); break;
            case 'details': booking.saveAddress(); break;
            case 'payment': booking.savePaymentOption(); break;
            case 'overview': booking.book(); break;
            default: setFirstTab(); break;
          }
        };

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
          paymentHelper.btPostCreditCard(booking.creditCardData, onSuccessPaymentValidation);
        };

        booking.openPaypal = function() {
          paymentHelper.btPostPaypal(onSuccessPaymentValidation);
        };

        function savePaymentOption() {
          if (booking.paymentMethod === 'current') {
            booking.nextTab();
          } else {
            booking.tokenizeCard();
          }
        }

        function onSuccessPaymentValidation(data) {
          updatePaymentInformation(data);
          // reset form and data after success
          booking.creditCardData = {}
          booking.paymentForm.$setPristine();
          booking.paymentForm.$setUntouched();
          // go to next tab
          booking.nextTab();
        }

        function updatePaymentInformation(data) {
          booking.user.payment_method = paymentHelper.updatePaymentUserData(booking.user.payment_method, data);
          booking.paymentDescription = paymentHelper.getPaymentShortDescription(booking.user.payment_method);
          booking.paymentMethod = booking.user.payment_method ? 'current' : '';
        }

        booking.reloadUser = function() {
          api.get('/users/' + $localStorage.userId).then(
            function (success) {
              booking.user = success.data;
              booking.user.firstName = success.data.first_name;
              booking.user.lastName = success.data.last_name;
              booking.creditCardHolderName = booking.user.first_name + " " + booking.user.last_name;

              booking.paymentMethod = booking.user.payment_method ? 'current' : '';

              // Autocomplete phone number if it's confirmed already
              if (booking.user.has_phone_number) {
                booking.phoneConfirmed = 'success';
                booking.verificationForm.phone_number = '+' + success.data.phone_number;
                booking.phone_number = '+' + success.data.phone_number;
              }

              if (booking.user.payment_method) {
                booking.paymentDescription = paymentHelper.getPaymentShortDescription(booking.user.payment_method);
              }

              setFirstTab();

              updatePrices();
              $timeout(function () {
                booking.hidden = false;
              }, 120);
            },
            function (error) {
              notification.show(error, 'error');
            }
          );
        };

        function setFirstTab() {
          if (!isDateSet()) {
            booking.selectedIndex = booking.tabOrder['calendar'];
          } else if (!authentication.loggedIn()) {
            booking.selectedIndex = booking.tabOrder['sign-in'];
          } else if (!validUserDetails()) {
            booking.selectedIndex = booking.tabOrder['details'];
          } else if(!booking.user.payment_method) {
            booking.selectedIndex = booking.tabOrder['payment'];
          } else {
            booking.selectedIndex = booking.tabOrder['overview'];
          }
          trackTabLoad();
        }

        function isDateSet() {
          return booking.startDate && booking.endDate;
        }

        function validUserDetails() {
          return booking.user.confirmed_phone && booking.user.has_address;
        }

        booking.emailSignup = function () {
          var user = {
            email: booking.user.email,
            firstName: booking.user.firstName,
            lastName: booking.user.lastName,
            password: booking.user.password,
            isShop: !!booking.shopBooking
          }
          booking.authentication.signupGlobal(user);
        };

        function sendCode() {
          if (!booking.authentication.loggedIn()) return setFirstTab();

          booking.sendSms(booking.verificationForm.phone_number);
        }

        // phone confirmation
        //TODO: move to shared logic
        booking.sendSms = function (numberInput) {
          if (!_.isEmpty(numberInput.$error)) { return }
          var data = {"phone_number": numberInput.$modelValue};
          booking.toggleConfirmButton();
          api.put('/users/' + $localStorage.userId + '/update_phone', data).then(
            function (success) {
              notification.show(success, null, 'booking.details.sms-confirmation-message');
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

        // TODO: This needs to be refactored, rootScopes are very bad practice
        // go to next tab on user create success
        $rootScope.$on('user_created', function () {
            booking.reloadUser();
        });

        // go to next tab on user login success
        $rootScope.$on('user_login', function () {
          booking.reloadUser();
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
            instant: !!booking.shopBooking,
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
