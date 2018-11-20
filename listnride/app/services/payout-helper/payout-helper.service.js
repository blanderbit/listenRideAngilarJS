'use strict';

angular
  .module('listnride')
  .factory('payoutHelper', [
    'api',
    'authentication',
    'notification',
    PayoutHelperController
  ]);

// authentication.userId()
function PayoutHelperController(api, authentication, notification) {
  return {
    postPayout: function (formData, payment_type, cb, cbError) {
      var data = {
        "payout_method": {
          'payment_type': payment_type,
          'first_name': formData.first_name,
          'last_name': formData.last_name,
          'email': formData.email,
          'iban': formData.iban,
          'bic': formData.bic
        }
      };

      api.post('/users/' + authentication.userId() + '/payout_methods', data).then(
        function (success) {
          if (typeof cb == 'function') cb(data);
          notification.show(success, null, 'toasts.add-payout-success');
        },
        function (error) {
          notification.show(error, 'error');
          if (typeof cbError == 'function') cbError();
        }
      );
    }
  }
}
