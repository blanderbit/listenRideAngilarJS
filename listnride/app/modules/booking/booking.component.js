'use strict'

angular.module('booking', [])
// booking component
  .component('booking', {
    transclude: true,
    templateUrl: 'app/modules/booking/booking.template.html',
    controllerAs: 'booking',
    controller: [
      '$localStorage', '$rootScope', '$scope', '$state', '$stateParams', '$mdToast',
      '$timeout', '$translate', '$filter', 'authentication',
      'api', 'price', 'voucher',
      function BookingController(
        $localStorage, $rootScope, $scope, $state, $stateParams, $mdToast, $timeout,
        $translate, $filter, authentication, api, price, voucher) {
        var booking = this;
        var btAuthorization = 'sandbox_g42y39zw_348pk9cgf3bgyw2b';
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
          console.log(booking.selectedIndex);
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
          btClient.request({
            endpoint: 'payment_methods/credit_cards',
            method: 'post',
            data: {
              creditCard: {
                number: booking.creditCardNumber,
                expirationDate: booking.month_expiry + '/' + booking.year,
                cvv: booking.securityNumber
              }
            }
          }, function (err, response) {
            if (!err) {
              var data = {
                // "payment_method": {
                //   "payment_method_nonce": response.creditCards[0].nonce
                // }
                "payment_method_nonce": response.creditCards[0].nonce
              };
              api.post('/users/' + authentication.userId() + '/payment_methods',
                {
                  "payment_method_nonce": response.creditCards[0].nonce,
                  "phone_nr": '',
                  "device_data": {}
                }).then(
                function (success) {
                  booking.nextTab();
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
                      console.log(error);
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
              console.log(booking.user);
              booking.creditCardHolderName = booking.user.first_name + " " + booking.user.last_name;
              if (booking.user.has_payout_method) {
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
          console.log("gets triggered!");
          booking.selectedIndex = booking.selectedIndex + 1;
        };

        // go to previous tab
        booking.previousTab = function () {
          booking.selectedIndex = booking.selectedIndex - 1;
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
              // calendar.current_request = success.data;
              // calendar.current_request.glued = true;
              // calendar.current_request.rideChat = $localStorage.userId == calendar.current_request.user.id;
              // calendar.current_request.rideChat ? calendar.current_request.chatFlow = "rideChat" : calendar.current_request.chatFlow = "listChat";

              // if (calendar.current_request.rideChat) {
              //   calendar.current_request.rating = calendar.current_request.lister.rating_lister + calendar.current_request.lister.rating_rider;
              //   if (calendar.current_request.lister.rating_lister != 0 && calendar.current_request.lister.rating_rider != 0) {
              //     calendar.current_request.rating = calendar.current_request.rating / 2
              //   }
              // }
              // else {
              //   calendar.current_request.rating = calendar.current_request.user.rating_lister + calendar.current_request.user.rating_rider;
              //   if (calendar.current_request.user.rating_lister != 0 && calendar.current_request.user.rating_rider != 0) {
              //     calendar.current_request.rating = calendar.current_request.rating / 2
              //   }
              // }
              // calendar.current_request.rating = Math.round(calendar.current_request.rating);
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
