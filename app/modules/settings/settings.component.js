'use strict';

angular.module('settings').component('settings', {
  templateUrl: 'app/modules/settings/settings.template.html',
  controllerAs: 'settings',
  controller: ['$localStorage', '$window', '$mdToast', '$translate', 'api', 'access_control', 'sha256', 'Base64', 'Upload',
    function SettingsController($localStorage, $window, $mdToast, $translate, api, access_control, sha256, Base64, Upload) {
      if (access_control.requireLogin()) {
        return;
      }

      var settings = this;
      settings.user = {};
      settings.loaded = false;
      settings.payoutMethod = {};
      settings.password = "";

      api.get('/users/' + $localStorage.userId).then(
        function(response) {
          settings.user = response.data;
          console.log(settings.user)
          settings.loaded = true;
        },
        function(error) {
          console.log("Error retrieving User", error);
        }
      );

      settings.addPayoutMethod = function() {
        var data = {
          "payment_method": settings.payoutMethod
        };

        data.payment_method.user_id = $localStorage.userId;

        if (settings.payoutMethod.family == 1) {
          data.payment_method.email = "";
        }
        else {
          data.payment_method.iban = "";
          data.payment_method.bic = "";
        }

        api.post('/users/' + $localStorage.userId + '/payment_methods', data).then(
          function (success) {
            $mdToast.show(
              $mdToast.simple()
              .textContent($translate.instant('toasts.add-payout-success'))
              .hideDelay(4000)
              .position('top center')
            );
          },
          function (error) {
            $mdToast.show(
              $mdToast.simple()
              .textContent($translate.instant('toasts.error'))
              .hideDelay(4000)
              .position('top center')
            );
          }
        );
      };

      settings.addVoucher = function() {
        var data = {
          "voucher": {
            "code": settings.voucherCode
          }
        };

        api.post('/vouchers', data).then(
          function (success) {
            settings.user.balance = parseInt(settings.user.balance) + parseInt(success.data.value);
            settings.voucherCode = "";
            $mdToast.show(
              $mdToast.simple()
              .textContent($translate.instant('toasts.add-voucher-success'))
              .hideDelay(4000)
              .position('top center')
            );
          },
          function (error) {
            settings.voucherCode = "";
            $mdToast.show(
              $mdToast.simple()
              .textContent($translate.instant('toasts.add-voucher-error'))
              .hideDelay(4000)
              .position('top center')
            );
          }
        );
      };

      settings.updateUser = function() {
        var data = {
          "user": {
            "description": settings.user.description,
            "profile_picture": settings.profilePicture,
            "street": settings.user.street,
            "zip": settings.user.zip,
            "city": settings.user.city,
            "country": settings.user.country
          }
        };

        if (settings.password && settings.password.length >= 6) {
          console.log("Updating Password");
          data.user.password_hashed = sha256.encrypt(settings.password);
        }

        Upload.upload({
          method: 'PUT',
          url: api.getApiUrl() + '/users/' + $localStorage.userId,
          data: data,
          headers: {
            'Authorization': $localStorage.auth
          }
        }).then(
          function (success) {
            $mdToast.show(
              $mdToast.simple()
              .textContent($translate.instant('toasts.update-profile-success'))
              .hideDelay(4000)
              .position('top center')
            );
            settings.user = success.data;
            $localStorage.profilePicture = success.data.profile_picture.profile_picture.url;
            var encoded = Base64.encode(success.data.email + ":" + success.data.password_hashed);
            $localStorage.auth = 'Basic ' + encoded;
          },
          function (error) {
            $mdToast.show(
              $mdToast.simple()
              .textContent($translate.instant('toasts.error'))
              .hideDelay(4000)
              .position('top center')
            );
          }
        );
      }

      settings.openPaymentWindow = function() {
        var w = 550;
          var h = 700;
          var left = (screen.width / 2) - (w / 2);
          var top = (screen.height / 2) - (h / 2);

          $window.open("https://api.listnride.com/v2/users/" + $localStorage.userId + "/payment_methods/new", "popup", "width="+w+",height="+h+",left="+left+",top="+top);
      };
    }
  ]
});
