'use strict';

angular.
  module('listnride').
  factory('verification', ['$mdDialog', '$mdToast', '$interval', '$localStorage', '$state', 'api', 'Upload',
    function($mdDialog, $mdToast, $interval, $localStorage, $state, api, Upload) {

      var VerificationDialogController = function(lister) {
        var verificationDialog = this;
        var poller = $interval(function() {
          reloadUser();
        }, 5000);

        verificationDialog.lister = lister;
        console.log(verificationDialog.lister);

        verificationDialog.selectedIndex;
        verificationDialog.activeTab = 1;
        verificationDialog.firstName = $localStorage.firstName;
        verificationDialog.profilePicture = false;

        $state.current.name == "home" ? verificationDialog.firstTime = true : verificationDialog.firstTime = false;
        // Fires if scope gets destroyed and cancels poller
        verificationDialog.$onDestroy = function() {
          $interval.cancel(poller);
        };

        var reloadUser = function() {
          api.get('/users/' + $localStorage.userId).then(
            function (success) {
              if (verificationDialog.newUser == null) {
                verificationDialog.newUser = success.data;
              }
              verificationDialog.user = success.data;
            },
            function (error) {
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
              "profile_picture": verificationDialog.profilePicture
            }
          };

          Upload.upload({
            method: 'PUT',
            url: api.getApiUrl() + '/users/' + $localStorage.userId,
            data: profilePicture,
            headers: {
              'Authorization': $localStorage.auth
          }
        }).then(
          function(response) {
            console.log(response.data);
            $localStorage.profilePicture = response.data.profile_picture.profile_picture.url;
          },
          function(error) {
            console.log("Error while uploading profile picture", error);
          }
        );
        };

        var uploadAddress = function() {
          var data = {
            "user": {
              "street": verificationDialog.newUser.street, 
              "zip": verificationDialog.newUser.zip,
              "city": verificationDialog.newUser.city,
              "country": verificationDialog.newUser.country
            }
          };
          api.put('/users/' + $localStorage.userId, data).then(
            function (success) {
              $mdToast.show(
                $mdToast.simple()
                .textContent('Congratulations, your profile was successfully verified!')
                .hideDelay(4000)
                .position('top center')
              );
            },
            function (error) {

            }
          );
        }

        verificationDialog.resendEmail = function() {
          api.post('/users/' + $localStorage.userId + '/resend_confirmation_mail').then(
            function (success) {
              $mdToast.show(
                $mdToast.simple()
                .textContent('Verification email was sent to your email address')
                .hideDelay(4000)
                .position('top center')
              );
            },
            function (error) {
              
            }
          );
        };

        verificationDialog.sendSms = function() {
          var data = {
            "phone_number": verificationDialog.newUser.phone_number
          };
          api.post('/users/' + $localStorage.userId + '/update_phone', data).then(
            function (success) {
              console.log("Successfully updated phone number");
              $mdToast.show(
                $mdToast.simple()
                .textContent('An SMS with a confirmation code was sent to you right now.')
                .hideDelay(4000)
                .position('top center')
              );
            },
            function (error) {
              console.log("error updating phone number");
            }
          );
        };

        verificationDialog.confirmPhone = function() {
          var data = {
            "confirmation_code": verificationDialog.newUser.confirmation_code
          };
          api.post('/users/' + $localStorage.userId + '/confirm_phone', data).then(
            function (success) {
              $mdToast.show(
                $mdToast.simple()
                .textContent('Successfully verified phone number.')
                .hideDelay(4000)
                .position('top center')
              );
            },
            function (error) {
              console.log("Could not verify phone number");
            }
          );
        };

        verificationDialog.uploadAddress = function() {
          var data = {
            "user": {
              "street": verificationDialog.newUser.street,
              "zip": verificationDialog.newUser.zip,
              "city": verificationDialog.newUser.city,
              "country": verificationDialog.newUser.country
            }
          };
          api.put('/users/' + $localStorage.userId, data).then(
            function (success) {
              $mdToast.show(
                $mdToast.simple()
                .textContent('You\'ve successfully verified your profile, thank you!')
                .hideDelay(5000)
                .position('top center')
              );
            },
            function (error) {
              console.log("error updating address");
            }
          );
        };

        verificationDialog.next = function() {
          switch (verificationDialog.activeTab) {
            case 1: verificationDialog.selectedIndex += 1; break;
            case 2: uploadPicture(); verificationDialog.selectedIndex += 1; break;
            case 3: uploadDescription(); verificationDialog.selectedIndex += 1; break;
            case 4: verificationDialog.selectedIndex += 1; break;
            case 5: verificationDialog.selectedIndex += 1; break;
            case 6: uploadAddress(); $mdDialog.hide(); break;
          }
        };

        verificationDialog.nextDisabled = function() {
          switch (verificationDialog.activeTab) {
            case 1: return false;
            case 2: return !verificationDialog.profilePicture;
            case 3: return !verificationDialog.descriptionForm.$valid;
            case 4: return verificationDialog.user.status == 0
            case 5: return !verificationDialog.user.confirmed_phone;
            case 6: return !verificationDialog.addressForm.$valid;
          }
        };

        verificationDialog.hide = function() {
          $mdDialog.hide();
        };
      };

      var openDialog = function(lister, event) {
        $mdDialog.show({
          controller: VerificationDialogController,
          locals: {
            lister: lister
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
      }

      return {
        openDialog: openDialog
      }
    }
  ]);