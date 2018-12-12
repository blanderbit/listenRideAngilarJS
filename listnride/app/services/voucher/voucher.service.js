'use strict';

angular.
  module('listnride').
  factory('voucher', ['api', 'notification',
    function (api, notification) {
      return {
        addVoucher: function(voucherCode) {
          var data = {
            "voucher": {
              "code": voucherCode
            }
          };

          return api.post('/vouchers', data).then(
            function (success) {
              notification.show(success, null, 'toasts.add-voucher-success');
              return parseInt(success.data.value);
            },
            function (error) {
              notification.show(error, 'error');
            }
          );
        }
      }
    }
  ]);
