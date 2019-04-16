'use strict';

angular
  .module('paypalCheckoutButton', [])
  .directive('paypalCheckoutButton', ['paymentHelper', 'ENV', function(paymentHelper, ENV) {

    function initPaypalCheckoutButton($scope, btClient, buttonId) {
      return braintree.paypalCheckout.create({
        client: btClient
      }).then(function (paypalCheckoutInstance) {
        paypal.Button.render({
          env: ENV.brainTreeEnv, // 'production' or 'sandbox'

          payment: function () {
            return paypalCheckoutInstance.createPayment({
              flow: 'vault'
            });
          },

          onAuthorize: function (data) {
            return paypalCheckoutInstance.tokenizePayment(data)
              .then(paymentHelper.savePaypalPaymentMethod)
              .then($scope.onSuccess);
          },

          onCancel: function (data) {
            console.log('checkout.js payment cancelled', JSON.stringify(data, 0, 2));
          },

          onError: function (err) {
            console.error('checkout.js error', err);
          }
        }, buttonId);
      });
    }

    return {
      restrict: 'E',
      templateUrl: 'app/modules/shared/paypal-checkout-button/paypal-checkout-button.template.html',
      scope: {
        onSuccess: '<'
      },
      link: function ($scope, element, attrs) {
        paymentHelper.setupBraintreeClient().then(function(btClient) {
          initPaypalCheckoutButton($scope, btClient, '#paypal-checkout');
        });
      }
    };
  }]);
