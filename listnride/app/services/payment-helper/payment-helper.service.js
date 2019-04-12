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
    btClient: '',
    btPpInstance: '',
    btThreeDSecure: null,
    fetchClientToken: function() {
      return api.get('/users/' + authentication.userId() + '/payment_methods/new').then(function(response) {
        return response.data.token;
      });
    },
    fetchPaymentMethodNonce: function() {
      return api.get('/users/' + authentication.userId() + '/payment_methods/nonce').then(function(response) {
        return response.data.nonce;
      });
    },
    createBrainTreeClient: function(clientToken) {
      return braintree.client.create({
        authorization: clientToken
      });
    },
    createThreeDSecure: function(btClient) {
      return braintree.threeDSecure.create({
        client: btClient
      });
    },
    createPaypalClient: function(btClient) {
      return braintree.paypalCheckout.create({
        client: btClient
      });
    },
    setupBraintreeClient: function () {
      var self = this;

      return self.fetchClientToken()
        .then(self.createBrainTreeClient)
        .then(function(btClient) {
          self.btClient = btClient;
          return self.btClient;
        })
        .then(self.createThreeDSecure)
        .then(function(threeDSecure) {
          self.btThreeDSecure = threeDSecure;
          return self.btClient;
        })
        .then(self.createPaypalClient)
        .then(
          function(ppClient) {
            self.btPpInstance = ppClient;
            return self;
          },
          function() { return self; }
        );
    },
    authenticateThreeDSecure: function(amount, addFrameCb, removeFrameCb) {
      var self = this;

      return self.setupBraintreeClient()
        .then(self.fetchPaymentMethodNonce)
        .then(function(nonce) {
          return self.btThreeDSecure.verifyCard(
            {
              amount: amount,
              nonce: nonce,
              addFrame: addFrameCb,
              removeFrame: removeFrameCb
            }
          );
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
