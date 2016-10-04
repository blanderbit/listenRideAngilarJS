'use strict';

angular.
  module('listnride').
  factory('verification', ['$mdDialog', '$mdToast', '$interval', '$localStorage', '$state', 'api',
    function($mdDialog, $mdToast, $interval, $localStorage, $state, api) {

      var VerificationDialogController = function(lister) {
        var verificationDialog = this;
        var poller = $interval(function() {
          reloadUser();
        }, 5000);

        verificationDialog.lister = lister;

        verificationDialog.selectedIndex;
        verificationDialog.activeTab = 1;
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
                console.log(success.data);
              }
              verificationDialog.user = success.data;
              console.log(verificationDialog.newUser.description);
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
              $state.go('list');
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
            case 2: uploadDescription(); verificationDialog.selectedIndex += 1; break;
            case 3: verificationDialog.selectedIndex += 1; break;
            case 4: verificationDialog.selectedIndex += 1; break;
            case 5: uploadAddress(); $mdDialog.hide(); break;
          }
        };

        verificationDialog.nextDisabled = function() {
          switch (verificationDialog.activeTab) {
            case 1: return false;
            case 2: return !verificationDialog.descriptionForm.$valid;
            case 3: return verificationDialog.user.status == 0
            case 4: return !verificationDialog.user.confirmed_phone;
            case 5: return !verificationDialog.addressForm.$valid;
          }
        };

        verificationDialog.hide = function() {
          $mdDialog.hide();
        };
      };

      var openDialog = function(lister) {
        $mdDialog.show({
          controller: VerificationDialogController,
          locals: {
            lister: "blabla"
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