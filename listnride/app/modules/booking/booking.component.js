'use strict'

angular.module('booking', [])
// booking component
  .component('booking', {
    transclude: true,
    templateUrl: 'app/modules/booking/booking.template.html',
    controllerAs: 'booking',
    controller: [
      '$localStorage', '$rootScope', '$scope', '$state', '$stateParams', '$mdToast',
      '$timeout', 'ENV', '$translate', '$filter', 'authentication',
      'api', 'price', 'voucher',
      function BookingController(
        $localStorage, $rootScope, $scope, $state, $stateParams, $mdToast, $timeout, ENV,
        $translate, $filter, authentication, api, price, voucher) {
        var booking = this;
        var btAuthorization = ENV.btKey;
        var btClient;

        booking.startDate = new Date($stateParams.startDate);
        booking.endDate = new Date($stateParams.endDate);
        booking.bikeId = $stateParams.bikeId;

        booking.user = {};
        booking.confirmation = '';
        booking.phoneConfirmed = 'progress';
        booking.selectedIndex = 0;
        booking.hidden = true;
        booking.tabsDisabled = false;
        booking.voucherCode = "";
        booking.expiryDate = "";

        var oldExpiryDateLength = 0;
        var expiryDateLength = 0;
        var month = 0;
        var year = 0;

        // Fetch Bike Information
        api.get('/rides/' + booking.bikeId).then(
          function (success) {
            booking.bike = success.data;
            booking.bikeCategory = $translate.instant($filter('category')(booking.bike.category));
            booking.bikeSize = booking.bike.size + " - " + (parseInt(booking.bike.size) + 10) + "cm";
            booking.prices = booking.bike.prices;
            booking.subtotal = price.calculatePrices(booking.startDate, booking.endDate, booking.prices).subtotal;
          },
          function (error) {
            $state.go('home');
          }
        );

        // on lifecycle initialization
        booking.$onInit = function () {
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

        booking.tabCompleted = function(tabId) {
          return booking.selectedIndex > tabId ? "✔" : "    ";
        };

        booking.addVoucher = function() {
          voucher.addVoucher(booking.voucherCode);
          booking.reloadUser();
          booking.voucherCode = "";
        };

        booking.nextDisabled = function() {
          switch (booking.selectedIndex) {
            case 0: return false;
            case 1: return !(booking.phoneConfirmed === 'success' && booking.detailsForm.$valid);
            case 2: return !booking.paymentForm.$valid;
            case 3: return false;
          }
        };

        booking.resendSms = function() {
          booking.toggleConfirmButton();
          booking.confirmation = {0: '', 1: '', 2: '', 3: ''}
        };

        booking.nextAction = function() {
          switch (booking.selectedIndex) {
            case 0: booking.goNext(); break;
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
            return;
          }
          btClient = client;
        });

        booking.saveAddress = function() {
          var data = {
            "user": {
              "street": booking.user.street,
              "zip": booking.user.zip,
              "city": booking.user.city,
              "country": booking.user.country
            }
          };
          api.put('/users/' + $localStorage.userId, data).then(
            function (success) {
              booking.nextTab();
            },
            function (error) {
              $mdToast.show(
                $mdToast.simple()
                  .textContent("Address Error message")
                  .hideDelay(4000)
                  .position('top center')
              );
            }
          );
        };

        booking.tokenizeCard = function() {
          $mdToast.show(
            $mdToast.simple()
              .textContent('Payment Method gets saved..')
              .hideDelay(4000)
              .position('top center')
          );
          
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
                  // booking.nextTab();
                  booking.reloadUser();
                },
                function (error) {
                }
              );
            }
            // Send response.creditCards[0].nonce to your server
          });
        };

        booking.openPaypal = function() {
          braintree.paypal.create({
              client: btClient
            },
            function (ppErr, ppInstance) {
              ppInstance.tokenize({ flow: 'vault' },
                function (tokenizeErr, payload) {
                  if (tokenizeErr) {
                    return;
                  }
                  var data = {
                    "payment_method_nonce": payload.nonce
                  };
                  api.post('/users/' + authentication.userId() + '/payment_methods', data).then(
                    function (success) {
                      $scope.$apply(booking.nextTab());
                    },
                    function (error) {
                    }
                  );
                }
              );
            }
          )
        };

        booking.reloadUser = function() {
          api.get('/users/' + $localStorage.userId).then(
            function (success) {
              booking.user = success.data;
              booking.creditCardHolderName = booking.user.first_name + " " + booking.user.last_name;
              if (booking.user.status == 3) {
                booking.selectedIndex = 3;
              }
              else if (booking.user.has_phone_number && booking.user.has_address) {
                booking.selectedIndex = 2;
              } else {
                booking.selectedIndex = 1;
              }
              $timeout(function () {
                booking.hidden = false;
              }, 120);
              api.get('/users/' + $localStorage.userId + '/current_payment').then(
                function(response) {
                  booking.user.current_payment_method = response.data;
                },
                function(error) {

                }
              );
            },
            function (error) {
            }
          );
        };

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
            }
          );
        };

        booking.confirmPhone = function () {
          var form = booking.detailsForm;
          var codeDigits = form.confirmation_0.$viewValue + form.confirmation_1.$viewValue + form.confirmation_2.$viewValue + form.confirmation_3.$viewValue;
          if (codeDigits.length === 4) {
            var data = { "confirmation_code": codeDigits};
            api.post('/users/' + $localStorage.userId + '/confirm_phone', data).then(
              function (success) {
                booking.toggleConfirmButton();
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

        // controls behavior of "next" button
        booking.goNext = function () {
          switch(booking.selectedIndex) {
            case 2:
              booking.tokenizeCard(); break;
            default:
              booking.nextTab(); break
          }
        };

        // go to next tab
        booking.nextTab = function () {
          booking.selectedIndex = booking.selectedIndex + 1;
        };

        // go to previous tab
        booking.previousTab = function () {
          booking.selectedIndex = booking.selectedIndex - 1;
        };

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
          booking.reloadUser();
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
            end_date: endDate_utc.toISOString()
          };


          api.post('/requests', data).then(
            function(success) {
              $state.go('requests', {requestId: success.data.id});
              $analytics.eventTrack('Book', {  category: 'Request Bike', label: 'Request'});
            },
            function(error) {
              booking.inProcess = false;
              $mdToast.show(
                $mdToast.simple()
                // .textContent(error.data.errors[0].detail)
                  .textContent("There was an error requesting the bike")
                  .hideDelay(4000)
                  .position('top center')
              );
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
  });
