'use strict';

angular
  .module('listnride')
  .factory('paymentHelper', [
    'ENV',
    'api',
    'authentication',
    'notification',
    PaymentHelperController
  ]);


function PaymentHelperController(ENV, api, authentication, notification) {
  return {
    btAuthorization: ENV.btKey,
    btClient: '',
    btPpInstance: '',
    setupBraintreeClient: function () {
      var self = this;
      braintree.client.create({
        authorization: self.btAuthorization
      }, function (err, client) {
        if (err) {
          // TODO: show braintree errors. Find documentation
          return;
        }
        self.btClient = client;
        braintree.paypal.create({
          client: self.btClient
        }, function (ppErr, ppInstance) {
          self.btPpInstance = ppInstance;
        });
      });
    },
    btPostCreditCard: function(creditCardData, cb, cbError) {
      notification.show(null, null, 'booking.payment.getting-saved');
      var self = this;
      self.btClient.request({
        endpoint: 'payment_methods/credit_cards',
        method: 'post',
        data: {
          creditCard: {
            number: creditCardData.creditCardNumber,
            expirationDate: creditCardData.expiryDate,
            cvv: creditCardData.securityNumber
          }
        }
      }, function (err, response) {
        if (!err) {
          var data = {
            "payment_method": {
              "payment_method_nonce": response.creditCards[0].nonce,
              "last_four": response.creditCards[0].details.lastFour,
              "card_type": response.creditCards[0].details.cardType,
              "payment_type": "credit-card"
            }
          };
          api.post('/users/' + authentication.userId() + '/payment_methods', data).then(
            function () {
              if (typeof cb == 'function') cb(data.payment_method);
            },
            function (error) {
              if (typeof cbError == 'function') cbError();
              notification.show(error, 'error');
            }
          );
        }
      });
    },
    btPostPaypal: function(cb) {
      this.btPpInstance.tokenize({ flow: 'vault' },
        function (tokenizeErr, payload) {
          if (tokenizeErr) return;

          var data = {
            "payment_method": {
              "payment_method_nonce": payload.nonce,
              "email": payload.details.email,
              "payment_type": "paypal-account"
            }
          };

          api.post('/users/' + authentication.userId() + '/payment_methods', data).then(
            function () {
              cb(data.payment_method);
            },
            function (error) {
              notification.show(error, 'error');
            }
          );
        }
      );
    },
    updatePaymentUserData: function(currentPaymentData, newData) {
      return Object.assign({}, newData);
    },
    getPaymentShortDescription: function(paymentData) {
      switch (paymentData.payment_type) {
        case 'credit-card':
          return '**** **** **** ' + paymentData.last_four;
        case 'paypal-account':
          return paymentData.email;
        default:
          notification.show(null, null, 'shared.errors.unexpected-payment-type');
          return false;
      }
    }
  }
}