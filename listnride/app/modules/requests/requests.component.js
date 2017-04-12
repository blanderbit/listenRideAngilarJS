'use strict';

angular.module('requests',[]).component('requests', {
  templateUrl: 'app/modules/requests/requests.template.html',
  controllerAs: 'requests',
  controller: ['$localStorage', '$interval', '$mdMedia', '$mdDialog', '$window', 'moment', 'api', '$timeout', '$location', '$anchorScroll', '$state', '$stateParams', '$translate', 'date', 'accessControl', 'ENV',
    function RequestsController($localStorage, $interval, $mdMedia, $mdDialog, $window, moment, api, $timeout, $location, $anchorScroll, $state, $stateParams, $translate, date, accessControl, ENV) {
      if (accessControl.requireLogin()) {
        return;
      }

      var requests = this;
      var poller;

      // total requests for rider or lister
      requests.riderRequests = [];
      requests.listerRequests = [];
      requests.selectedTab = 0;

      requests.filters = {
        options: ['all requests', 'current rentals', 'pending rentals', 'upcoming rentals', 'past rentals', 'expired requests'],
        riderSelected: 0,
        listerSelected: 0,
        applyFilter: function (request, selected) {
          selected = parseInt(selected);
          // all requests for selected tab (rider or lister)
          switch (selected) {
            case 0: requests.filterBikes(request); break;
            case 1: requests.filterCurrentRentals(request); break;
            case 2: requests.filterPendingRequests(request); break;
            case 3: requests.filterUpcomingRentals(request); break;
            case 4: requests.filterPastRentals(request); break;
            case 5: requests.filterExpiredRequests(request); break;
          }
        }
      };
      // selected request for rider or lister
      requests.riderRequest = {};
      requests.listerRequest = {};
      
      requests.message = "";
      requests.showChat = false;
      requests.$mdMedia = $mdMedia;
      
      requests.riderRequests.glued = false;
      requests.listerRequests.glued = false;
      
      requests.loadingList = true;
      requests.loadingChat = false;
      
      requests.riderRequests.rideChat;
      requests.riderRequests.rideChat;
      requests.listerRequests.chatFlow;
      requests.listerRequests.chatFlow;

      requests.userId = $localStorage.userId;

      api.get('/users/' + $localStorage.userId + '/requests').then(
        function(success) {
          requests.selectedTab = 0;
          // get all requests
          requests.allRequests = success.data;
          // get all requests for lister
          requests.filterBikes('listerRequests');
          // get all requests for rider
          requests.filterBikes('riderRequests');
          requests.loadingList = false;
          if ($stateParams.requestId) {
            requests.loadRequest($stateParams.requestId);
          }
        },
        function() {
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
      };

      // Handles initial request loading
      requests.loadRequest = function(requestId, userId) {
        $state.go(".", { requestId: requestId }, {notify: false});
        requests.loadingChat = true;
        // Cancel the poller
        $interval.cancel(poller);
        // Clear former request
        $localStorage.userId === userId ? requests.listerRequest = {} : requests.riderRequest = {};
        // Load the new request and activate the poller
        reloadRequest(requestId, userId);
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
            // if user id matches to current user
            // select the lister tab
            var selectedRequest = '';
            if (success.data.user.id === $localStorage.userId) {
              requests.selectedTab = 1;
              selectedRequest = 'listerRequest';
            } else {
              requests.selectedTab = 0;
              selectedRequest = 'riderRequest';
            }
            
            // On initial load
            if (requests[selectedRequest].messages == null || requests[selectedRequest].messages.length != success.data.messages.length) {
              requests[selectedRequest] = success.data;
              requests[selectedRequest].glued = true;
              requests[selectedRequest] = success.data;
              requests[selectedRequest].rideChat = $localStorage.userId == requests[selectedRequest].user.id;
              requests[selectedRequest].rideChat ? requests[selectedRequest].chatFlow = "rideChat" : requests[selectedRequest].chatFlow = "listChat";

              if (requests[selectedRequest].rideChat) {
                requests[selectedRequest].rating = requests[selectedRequest].lister.rating_lister + requests[selectedRequest].lister.rating_rider;
                if (requests[selectedRequest].lister.rating_lister != 0 && requests[selectedRequest].lister.rating_rider != 0) {
                  requests[selectedRequest].rating = requests[selectedRequest].rating / 2
                }
              }
              else {
                requests[selectedRequest].rating = requests[selectedRequest].user.rating_lister + requests[selectedRequest].user.rating_rider;
                if (requests[selectedRequest].user.rating_lister != 0 && requests[selectedRequest].user.rating_rider != 0) {
                  requests[selectedRequest].rating = requests[selectedRequest].rating / 2
                }
              }
              requests[selectedRequest].rating = Math.round(requests[selectedRequest].rating);

              requests.loadingChat = false;
            }
            api.post('/requests/' + requestId + '/messages/mark_as_read', {"user_id": $localStorage.userId}).then(
              function () {
              },
              function () {
                //
              }
            );
          },
          function() {
            requests.loadingChat = false;
          }
        );
      };

      // This function handles booking and all necessary validations
      requests.confirmBooking = function() {
        api.get('/users/' + $localStorage.userId).then(
          function (success) {
            if (requests.listerRequest.subtotal == 0 || success.data.current_payment_method) {
              showBookingDialog();
            } else {
              // User did not enter any payment method yet
              showPaymentDialog();
            }
          },
          function () {
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
      };

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
      };

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
      requests.sendMessage = function(request) {
        requests[request].glued = true
        if( requests.message ) {
          var data = {
            "request_id": requests[request].id,
            "sender": $localStorage.userId,
            "content": requests.message,
            "is_read": false
          };
          var message = {
            "message": data
          };
          requests[request].messages.push(data);
          api.post('/messages', message).then(function() {
            reloadRequest(requests[request].id);
          }, function() {
          });
        } else {
          requests.confirmBooking(request);
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
            function() {
              reloadRequest(requests.request.id);
            },
            function() {
              reloadRequest(requests.request.id);
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

          var locale = $translate.use();
          $window.open(ENV.userEndpoint + $localStorage.userId + "/payment_methods/new?locale="+locale, "popup", "width="+w+",height="+h+",left="+left+",top="+top);
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
              "author_id": $localStorage.userId,
            }
          };
          var newStatus;

          if (requests.riderRequest.rideChat) {
            data.rating.ride_id = requests.riderRequest.ride.id;
            newStatus = 6;
          }
          else {
            data.rating.user_id = requests.riderRequest.user.id;
            newStatus = 5
          }

          requests.loadingChat = true;
          ratingDialog.hide();
          api.post('/ratings', data).then(
            function() {
              var data = {
                "request": {
                  "status": newStatus
                }
              };
              api.put("/requests/" + requests.riderRequest.id, data).then(
                function() {
                  reloadRequest(requests.riderRequest.id);
                },
                function() {
                  reloadRequest(requests.riderRequest.id);
                }
              );
            },
            function() {
            }
          );
        };

        ratingDialog.hide = hideDialog;
      };

      /**
       * filter lister/rider requests from all requests
       * DOM filtering is avoid b/c of performance overhead
       * @return {requests} returns requests based on provided filter
       * @param {string} request type of request (as a lister or as a rider)
       */
      requests.filterBikes = function (request) {
        requests[request] = requests.allRequests.filter(function (response) {
          var condition = response.user.id === $localStorage.userId;
          return (request === 'listerRequests') ? condition : !condition;
        });
      };

      /**
       * All rentals which are currently rented out.
       * Within Request Start Date and End Date.
       * @return {requests} current rentals
       * @param {string} request type of request (as a lister or as a rider) 
       */
      requests.filterCurrentRentals = function (request) {
        // filter for lister or rider
        requests.filterBikes(request);
        // filter for pending requests
        requests[request] = requests[request].filter(function (response) {
          return (response.status === 3);
        });
      };

      /**
       * It is a request sent by rider, but not yet accepted by the lister. 
       * The pending request moves to Upcoming Rentals as soon as the lister
       * accepted and the rider accepted and paid
       * @return {requests} pending requests
       * @param {string} request type of request (as a lister or as a rider)
       */
      requests.filterPendingRequests = function (request) {
        // filter for lister or rider
        requests.filterBikes(request);
        // filter for pending requests
        requests[request] = requests[request].filter(function (response) {
          return (response.status === 1 || response.status === 2);
        });
      };

      /**
       * It is a request sent by rider, but not yet accepted by the lister. 
       * The pending request moves to Upcoming Rentals as soon as the lister
       * accepted and the rider accepted and paid
       * @return {requests} upcoming rentals
       * @param {string} request type of request (as a lister or as a rider)
       */
      requests.filterUpcomingRentals = function (request) {
        // filter for lister or rider
        requests.filterBikes(request);
        // filter for pending requests
        requests[request] = requests[request].filter(function (response) {
          var currentDate = Date.parse(new Date());
          var startDate = Date.parse(response.start_date);
          return (response.status === 3 && (startDate > currentDate));
        });
      };

      /**
       * Rentals accepted and paid but are now in the past,
       * meaning 24h after the End Date.
       * @return {requests} past rentals
       * @param {string} request type of request (as a lister or as a rider)
       */
      requests.filterPastRentals = function (request) {
        // filter for lister or rider
        requests.filterBikes(request);
        // filter for pending requests
        requests[request] = requests[request].filter(function (response) {
          var currentDate = Date.parse(new Date());
          var endDate = Date.parse(response.end_date);
          return (response.status === 3 && (endDate < currentDate));
        });
      };

      /**
       * These were the pending requests
       * but their end time is now over
       * @return {requests} expired requests
       * @param {string} request type of request (as a lister or as a rider)
       */
      requests.filterExpiredRequests = function (request) {
        // filter for lister or rider
        requests.filterBikes(request);
        // filter for pending requests
        requests[request] = requests[request].filter(function (response) {
          var currentDate = Date.parse(new Date());
          var endDate = Date.parse(response.end_date);
          return ((response.status === 1 || response.status === 2) && (endDate < currentDate));
        });
      };
    }
  ]
});