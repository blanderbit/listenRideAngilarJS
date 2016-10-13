'use strict';

angular.module('requests').component('requests', {
  templateUrl: 'app/modules/requests/requests.template.html',
  controllerAs: 'requests',
  controller: ['$localStorage', '$interval', '$mdMedia', '$mdDialog', '$window', 'api', '$timeout', '$location', '$anchorScroll', 'date',
    function RequestsController($localStorage, $interval, $mdMedia, $mdDialog, $window, api, $timeout, $location, $anchorScroll, date) {
      var requests = this;
      var poller;

      requests.requests = [];
      requests.request = {};
      requests.message = "";
      requests.showChat = false;
      requests.$mdMedia = $mdMedia;
      requests.request.glued = false;
      requests.loadingList = true;
      requests.loadingChat = false;
      requests.request.rideChat;
      requests.request.chatFlow;
      requests.userId = $localStorage.userId;

      api.get('/users/' + $localStorage.userId + '/requests').then(
        function(success) {
          requests.requests = success.data;
          requests.loadingList = false;
        },
        function(error) {
          console.log("Error fetching request list");
          requests.loadingList = false;
        }
      );

      var hideDialog = function() {
        // For small screens, show Chat Dialog again
        if ($mdMedia('xs')) {
          showChatDialog();
        } else {
          $mdDialog.hide();
        }
      }

      // Handles initial request loading
      requests.loadRequest = function(requestId, index) {
        requests.loadingChat = true;
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

      requests.profilePicture = function(request) {
        if ($localStorage.userId == request.user.id) {
          return request.ride.image_file_1.thumb.url;
        } else {
          return request.user.profile_picture.url;
        }
      };

      var reloadRequest = function(requestId) {
        api.get('/requests/' + requestId).then(
          function(success) {
            // On initial load
            if (requests.request.messages == null || requests.request.messages.length != success.data.messages.length) {
              requests.request = success.data;
              requests.request.glued = true;
              requests.request = success.data;
              requests.request.rideChat = $localStorage.userId == requests.request.user.id;
              requests.request.rideChat? requests.request.chatFlow = "rideChat" : requests.request.chatFlow = "listChat";
              requests.loadingChat = false;
            }
            api.post('/requests/' + requestId + '/messages/mark_as_read', {"user_id": $localStorage.userId}).then(
              function (success) {
              },
              function (error) {
                //
              }
            );
          },
          function(error) {
          console.log("Error fetching request!");
          }
        );
      };

      // This function handles booking and all necessary validations
      requests.confirmBooking = function() {
        api.get('/users/' + $localStorage.userId).then(
          function (success) {
            if (success.data.current_payment_method) {
              showBookingDialog();
            } else {
              // User did not enter any payment method yet
              showPaymentDialog();
            }
          },
          function (error) {
            console.log("Error retrieving User Details");
          }
        );
      }

      var showPaymentDialog = function(event) {
        $mdDialog.show({
          controller: PaymentDialogController,
          controllerAs: 'paymentDialog',
          templateUrl: 'app/modules/requests/paymentDialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: false // Only for -xs, -sm breakpoints.
        });
      }

      var showChatDialog = function(event) {
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
        });
      }

      var showBookingDialog = function(event) {
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
        });
      };

      requests.showRatingDialog = function(event) {
        $mdDialog.show({
          controller: RatingDialogController,
          controllerAs: 'ratingDialog',
          templateUrl: 'app/modules/requests/ratingDialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: true // Only for -xs, -sm breakpoints.
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
            reloadRequest(requests.request.id);
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

        // $timeout(function() {
        //   $location.hash('end');
        //   $anchorScroll();
        // }, 2000);

        chatDialog.hide = function() {
          $mdDialog.hide();
        };
      };

      var BookingDialogController = function() {
        var bookingDialog = this;
        bookingDialog.requests = requests;
        bookingDialog.duration = date.duration(requests.request.start_date, requests.request.end_date);

        bookingDialog.hide = hideDialog;

        bookingDialog.book = function() {
          var data = {
            "request": {
              "status": 3
            }
          };
          bookingDialog.hide();
          requests.loadingChat = true;
          api.put("/requests/" + requests.request.id, data).then(
            function(success) {
              reloadRequest(requests.request.id);
            },
            function(error) {
              reloadRequest(requests.request.id);
              console.log("error updating request");
            }
          );
        };
      };

      var PaymentDialogController = function() {
        var paymentDialog = this;

        paymentDialog.openPaymentForm = function() {
          var w = 550;
          var h = 700;
          var left = (screen.width / 2) - (w / 2);
          var top = (screen.height / 2) - (h / 2);

          $window.open("https://listnride-staging.herokuapp.com/v2/users/" + $localStorage.userId + "/payment_methods/new", "popup", "width="+w+",height="+h+",left="+left+",top="+top);
          // For small screens, show Chat Dialog again
          hideDialog();
        }
      };

      var RatingDialogController = function() {
        var ratingDialog = this;

        ratingDialog.rating = 5;

        ratingDialog.rate = function() {
          var data = {
            "rating": {
              "score": ratingDialog.rating,
              "message": ratingDialog.message,
              "author": $localStorage.userId,
            }
          };
          var newStatus;

          if (requests.request.rideChat) {
            data.rating.ride_id = requests.request.ride.id;
            newStatus = 6;
          }
          else {
            data.rating.user_id = requests.request.user.id;
            newStatus = 5
          }

          requests.loadingChat = true;
          ratingDialog.hide();
          api.post('/ratings', data).then(
            function(success) {
              var data = {
                "request": {
                  "status": newStatus
                }
              };
              api.put("/requests/" + requests.request.id, data).then(
                function(success) {
                  reloadRequest(requests.request.id);
                },
                function(error) {
                  reloadRequest(requests.request.id);
                  console.log("error updating request");
                }
              );
              },
            function(error) {
              console.log("Error occured while rating");
            }
          );
        };

        ratingDialog.hide = hideDialog;
      }

    }
  ]
});