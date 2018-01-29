'use strict'

angular.module('booking', [])
// booking component
  .component('booking', {
    transclude: true,
    templateUrl: 'app/modules/booking/booking.template.html',
    controllerAs: 'booking',
    controller: [
      '$localStorage', '$rootScope', '$scope', '$state', '$mdToast',
      '$timeout', '$translate', '$filter', 'authentication',
      'api', 'price', 'voucher',
      function BookingController(
        $localStorage, $rootScope, $scope, $state, $mdToast, $timeout,
        $translate, $filter, authentication, api, price, voucher) {
        var booking = this;
        var btAuthorization = 'sandbox_g42y39zw_348pk9cgf3bgyw2b';
        var btClient;
  
        // TODO: Remove hardcorded values for testing receipt module
        booking.startDate = new Date();
        booking.endDate = new Date();
        booking.endDate.setDate(booking.startDate.getDate() + 1);
        booking.bikeId = 1;
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
        // END TODO

        booking.user = {};
        booking.confirmation = '';
        booking.phoneConfirmed = 'progress';
        booking.selectedIndex = 0;
        booking.steps = {
          'signin': false,
          'details': false,
          'payment': false
        };
        booking.hidden = true;
        booking.tabsDisabled = false;
        booking.subtotal = price.calculatePrices(booking.startDate, booking.endDate, booking.prices).subtotal;
        booking.voucherCode = "";
  
        // Fetch Bike Information
        api.get('/rides/' + booking.bikeId).then(
          function (success) {
            console.log(success.data);
            booking.bike = success.data;
            booking.bikeCategory = $translate.instant($filter('category')(booking.bike.category));
            booking.bikeSize = booking.bike.size + " - " + (parseInt(booking.bike.size) + 10) + "cm";
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
        }
  
        booking.addVoucher = function() {
          voucher.addVoucher(booking.voucherCode);
          booking.reloadUser();
          booking.voucherCode = "";
        }
  
        booking.nextDisabled = function() {
          //TODO: find way to get Form here
          switch (booking.selectedIndex) {
            case 0: return false;
            case 1: return booking.phoneConfirmed !== 'success';
            case 2: return true;
            case 3: return true;
            // case 3: return !details.detailsForm.$valid;
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
                  $scope.$apply(booking.nextTab());
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
              console.log(booking.user.balance);
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
          booking.selectedIndex = booking.selectedIndex + 1;
        };
  
        // go to previous tab
        booking.previousTab = function () {
          booking.selectedIndex = booking.selectedIndex - 1;
        };
  
        // TODO: This needs to be refactored, rootScopes are very bad practice
        // go to next tab on user create success
        $rootScope.$on('user_created', function () {
          booking.userAuth()
        });
  
        // go to next tab on user login success
        $rootScope.$on('user_login', function () {
          booking.userAuth()
        });
  
        angular.element(document).ready(function () {
          // set User data if registered
          if (authentication.loggedIn()) {
            console.log('user already logged in');
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
        }
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
