'use strict';

angular.module('requests').component('requests', {
  templateUrl: 'app/modules/requests/requests.template.html',
  controllerAs: 'requests',
  controller: ['$localStorage', '$interval', '$mdMedia', '$mdDialog', 'api', '$timeout', '$location', '$anchorScroll',
    function RequestsController($localStorage, $interval, $mdMedia, $mdDialog, api, $timeout, $location, $anchorScroll) {
      var requests = this;
      var poller;

      requests.requests = [];
      requests.request = {};
      requests.message = "";
      requests.showChat = false;
      requests.$mdMedia = $mdMedia;
      requests.request.glued = false;

      api.get('/users/' + $localStorage.userId + '/requests').then(function(success) {
        requests.requests = success.data;
      }, function(error) {
        console.log("Error fetching request list");
      });

      // Handles initial request loading
      requests.loadRequest = function(requestId) {
        // Cancel the poller
        $interval.cancel(poller);
        // Clear former request
        requests.request = {};
        // Load the new request and activate the poller
        reloadRequest(requestId);
        poller = $interval(function() {
            reloadRequest(requestId);
        }, 10000);

        // For small screens, disable the embedded chat and show chat in a fullscreen dialog instead
        if ($mdMedia('xs')) {
          requests.showChat = false;
          showChatDialog();
        } else {
          requests.showChat = true;
        }
      };

      var reloadRequest = function(requestId) {
        api.get('/requests/' + requestId).then(function(success) {
          // If message count changed, apply new data
          if (requests.request.messages == null || requests.request.messages.length != success.data.messages.length) {
            requests.request = success.data;
            requests.request.glued = true;
          }
          // If request loads initially, decide whether it's a rideChat or listChat
          if (requests.request.messages == null) {
            requests.request.rideChat = $localStorage.userId == requests.request.user.id;
          }
        }, function(error) {
          console.log("Error fetching request");
        });
      };

      // This function handles booking and all necessary validations
      var confirmBooking = function() {
        console.log("test");
        api.get('/users/' + $localStorage.userId).then(
          function (success) {
            if (success.data.current_payment_method) {
              console.log("User has pm");
            } else {
              console.log("user has no pm");
            }
          },
          function (error) {
            console.log("Error retrieving User Details");
          }
        );
      }

      var showChatDialog = function() {
        $mdDialog.show({
          controller: ChatDialogController,
          controllerAs: 'chatDialog',
          templateUrl: 'app/modules/requests/chatDialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: true // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          //
        }, function() {
          //
        });
      }

      var showBookingDialog = function() {
        $mdDialog.show({
          controller: BookingDialogController,
          controllerAs: 'bookingDialog',
          templateUrl: 'app/modules/requests/bookingDialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: true // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          //
        }, function() {
          //
        });
      };

      // Fires if scope gets destroyed and cancels poller
      requests.$onDestroy = function() {
        $interval.cancel(poller);
      };

      // Sends a new message by directly appending it locally and posting it to the API
      requests.sendMessage = function() {
        requests.request.glued = true
        if( requests.message ) {
          var data = {
            "request_id": requests.request.id,
            "sender": $localStorage.userId,
            "content": requests.message,
            "is_read": false
          };
          var message = {
            "message": data
          };
          requests.request.messages.push(data);
          api.post('/messages', message).then(function(success) {
            reloadRequest();
          }, function(error) {
            console.log("Error occured sending message");
          });
        } else {
          confirmBooking();
        }
        requests.message = "";
      };

      var ChatDialogController = function() {
        var chatDialog = this;
        chatDialog.requests = requests;

        $timeout(function() {
          $location.hash('end');
          $anchorScroll();
        }, 2000);

        chatDialog.hide = function() {
          $mdDialog.hide();
          // showBookingDialog();
        };
      };

      var BookingDialogController = function() {
        var bookingDialog = this;

        bookingDialog.hide = function() {
          // For small screens, show Chat Dialog again
          if ($mdMedia('xs')) {
            showChatDialog();
          } else {
            $mdDialog.hide();
          }
        };
      };

    }
  ]
});