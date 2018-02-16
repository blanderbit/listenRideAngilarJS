'use strict';

angular.
  module('listnride').
  factory('voucher', ['$http', '$localStorage', '$mdToast', '$translate', 'ENV', 'api',
    function($http, $localStorage, $mdToast, $translate, ENV, api) {
      return {
        addVoucher: function(voucherCode) {
          var data = {
            "voucher": {
              "code": voucherCode
            }
          };
          api.post('/vouchers', data).then(
            function (success) {
              $mdToast.show(
                $mdToast.simple()
                .textContent($translate.instant('toasts.add-voucher-success'))
                .hideDelay(4000)
                .position('top center')
              );
              return parseInt(success.data.value);
            },
            function (error) {
              $mdToast.show(
                $mdToast.simple()
                .textContent($translate.instant('toasts.add-voucher-error'))
                .hideDelay(4000)
                .position('top center')
              );
            }
          );
        }
      }
    }
  ]);
