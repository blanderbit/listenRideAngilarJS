'use strict';

angular.
  module('listnride').
  factory('verification', ['$mdDialog', '$mdToast','$q', '$interval', '$localStorage', '$state', '$translate', '$mdMedia', '$analytics', 'api', 'Upload', 'notification',
    function($mdDialog, $mdToast, $q, $interval, $localStorage, $state, $translate, $mdMedia, $analytics, api, Upload, notification) {
      var VerificationDialogController = function(lister, invited, callback) {
        var verificationDialog = this;
        var poller = $interval(function() {
          reloadUser();
        }, 5000);

        verificationDialog.loaded = false;
        verificationDialog.lister = lister;
        verificationDialog.invited = invited;
        verificationDialog.callback = callback;
        verificationDialog.selectedIndex;
        verificationDialog.activeTab = 1;
        verificationDialog.firstName = $localStorage.firstName;
        verificationDialog.profilePicture = false;
        verificationDialog.hasProfilePicture = false;
        verificationDialog.sentConfirmationSms = false;
        verificationDialog.croppedDataUrl = false;
        verificationDialog.validateObj = {size: {max: '20MB'}};
        verificationDialog.invalidFiles = {};
        verificationDialog.mobileScreen = $mdMedia('xs');
        verificationDialog.business = false;

        $state.current.name === "home" ? verificationDialog.firstTime = true : verificationDialog.firstTime = false;
        // Fires if scope gets destroyed and cancels poller
        verificationDialog.$onDestroy = function() {
          $interval.cancel(poller);
        };

        var reloadUser = function() {
          api.get('/users/' + $localStorage.userId).then(
            function (success) {
              if (verificationDialog.newUser == null) {
                verificationDialog.newUser = success.data;
                if (success.data.profile_picture.profile_picture.url != "https://s3.eu-central-1.amazonaws.com/listnride/assets/default_profile_picture.jpg") {
                  verificationDialog.hasProfilePicture = true;
                }
              }
              verificationDialog.user = success.data;
              verificationDialog.business = success.data.has_business;
              verificationDialog.loaded = true;
            },
            function (error) {
              verificationDialog.loaded = true;
              console.log("Error fetching User Details");
            }
          );
        };

        reloadUser();

        var uploadDescription = function() {
          var data = {
            "user": {
              "description": verificationDialog.newUser.description
            }
          };
          api.put('/users/' + $localStorage.userId, data).then(
            function (success) {
              console.log("Successfully updated description");
            },
            function (error) {
              console.log("Error updating description");
            }
          );
        };

        var uploadPicture = function() {
            var profilePicture = {
            "user": {
              "profile_picture": Upload.dataUrltoBlob(verificationDialog.croppedDataUrl, verificationDialog.profilePicture.name)
            }
          };

          Upload.upload({
            method: 'PUT',
            url: api.getApiUrl() + '/users/' + $localStorage.userId,
            data: profilePicture,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + $localStorage.accessToken
            }
          }).then(
            function(response) {
              $localStorage.profilePicture = response.data.profile_picture.profile_picture.url;
            },
            function(error) {
              console.log("Error while uploading profile picture", error);
            }
          );
        };

        var uploadAddress = function() {
          var address = {
            'locations': {
              '0': {
                "street": verificationDialog.address.street + ' ' + verificationDialog.address.streetNumber,
                "zip": verificationDialog.address.zip,
                "city": verificationDialog.address.city,
                "country": verificationDialog.address.country,
                "primary": true
              }
            }
          };

          api.put('/users/' + $localStorage.userId, address).then(
            function (success) {
              if (!verificationDialog.business) {
                notification.showToast($translate.instant('toasts.profile-verified'));
                verificationDialog.hide();
              }
            },
            function (error) {
              notification.showToast($translate.instant('toasts.address-save-error'));
              verificationDialog.hide();
            }
          );
        };

        var uploadCompany = function() {
          var business = {
            'business': {
              'vat': verificationDialog.newUser.vat
            }
          };

          api.put('/businesses/' + verificationDialog.user.business.id, business).then(
            function (success) {
              if (callback) {callback()}
              $mdDialog.hide();
              notification.showToast($translate.instant('toasts.profile-verified'));
            },
            function (error) {
              notification.showToast(error.data.errors[0].detail);
            }
          );
        };

        verificationDialog.resendEmail = function() {
          api.post('/send_confirmation_email').then(
            function (success) {
              notification.showToast($translate.instant('toasts.verification-email-sent'));
            },
            function (error) {

            }
          );
        };

        verificationDialog.sendSms = function () {
          sendSms(verificationDialog.newUser.phone_number).then(function () {
            verificationDialog.sentConfirmationSms = true;
          }, function () {
            notification.showToast($translate.instant('toasts.uniq-phone'));
            verificationDialog.sentConfirmationSms = false;
          });
        };

        verificationDialog.confirmPhone = function() {
          confirmPhone(verificationDialog.newUser.confirmation_code);
        };

        verificationDialog.next = function() {
          switch (verificationDialog.activeTab) {
            case 1: verificationDialog.selectedIndex += 1; break;
            case 2: uploadPicture(); verificationDialog.selectedIndex += 1; break;
            case 3: uploadDescription(); verificationDialog.selectedIndex += 1; break;
            case 4: verificationDialog.selectedIndex += 1; break;
            case 5: verificationDialog.selectedIndex += 1; break;
            case 6: uploadAddress(); showUploadCompany(); break;
            case 7: uploadCompany(); break;
          }
        };

        verificationDialog.isAddressValid = function() {
          return verificationDialog.validAddress;
        };

        verificationDialog.nextDisabled = function() {
          switch (verificationDialog.activeTab) {
            case 1: return false;
            case 2: return !verificationDialog.profilePicture;
            case 3: return !verificationDialog.descriptionForm.$valid;
            case 4: return verificationDialog.user.status == 0
            case 5: return !verificationDialog.user.confirmed_phone;
            case 6: return !verificationDialog.isAddressValid();
            case 7: return !verificationDialog.companyForm.$valid;
          }
        };

        var showUploadCompany = function() {
          if (verificationDialog.business) {
            verificationDialog.selectedIndex += 1
          }
        };

        verificationDialog.hide = function() {
          $mdDialog.hide();
        };

      };

      var openDialog = function(lister, invited, event, callback) {
        $mdDialog.show({
          controller: VerificationDialogController,
          locals: {
            lister: lister,
            invited: invited,
            callback: callback
          },
          controllerAs: 'verificationDialog',
          templateUrl: 'app/services/verification/verification.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: false,
          escapeToClose: false,
          fullscreen: true
        });
      };

      var sendSms = function (model) {
        // payload
        var data = {"phone_number": model};
        // promise
        var deferred = $q.defer();
        // api call
        api.put('/users/' + $localStorage.userId + '/update_phone', data).then(
          // resolve api: success
          function (success) {
            notification.showToast($translate.instant('toasts.sms-was-sent'));
            // resolve the promise
            deferred.resolve(success);
          },
          // reject api: error
          function (error) {
            // reject the promise
            notification.show(error, 'error');
            deferred.reject(error);
          }
        );
        // return promise to caller
        return deferred.promise;
      };

      var confirmPhone = function (code) {
        // payload
        var data = { "phone_confirmation_code": code };
        // promise
        var deferred = $q.defer();
        // api call
        api.post('/confirm_phone', data).then(
          // resolve api: success
          function (success) {
            notification.showToast($translate.instant('toasts.phone-verified'));
            // resolve the promise
            deferred.resolve(success);
            $analytics.eventTrack('Profile Verified', {  category: 'Sign Up', label: 'Phone Number Verified'});
          },
          // reject api: error
          function (error) {
            notification.showToast($translate.instant('toasts.verification-code-error'));
            // reject the promise
            deferred.reject(error);
          }
        );
        // return promise to caller
        return deferred.promise;
      };

      return {
        openDialog: openDialog,
        sendSms: sendSms,
        confirmPhone: confirmPhone
      };
    }
  ]);
