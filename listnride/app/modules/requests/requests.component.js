'use strict';

angular.module('requests', []).component('requests', {
  templateUrl: 'app/modules/requests/requests.template.html',
  controllerAs: 'requests',
  controller: ['$localStorage',
    '$interval',
    '$filter',
    '$mdMedia',
    '$mdDialog',
    '$window',
    'api',
    '$timeout',
    '$location',
    '$anchorScroll',
    '$state',
    '$stateParams',
    '$translate',
    'date',
    'accessControl',
    'ENV',
    function RequestsController($localStorage, $interval, $filter,
      $mdMedia, $mdDialog, $window, api,
      $timeout, $location, $anchorScroll,
      $state, $stateParams, $translate, date,
      accessControl, ENV) {
      if (accessControl.requireLogin()) {
        return;
      } 

      var requests = this;
      requests.selected = 0;
      var poller;
      requests.filters = {
        options: [
          'requests.filters.all-requests',
          'requests.filters.current-rentals',
          'requests.filters.pending-requests',
          'requests.filters.upcoming-rentals',
          'requests.filters.past-rentals',
          'requests.filters.expired-requests'
        ],
        selected: 0,
        type: 'all',
        applyFilter: function (selected) {
          requests.filters.selected = parseInt(selected);
          // all requests for selected tab (rider or lister)
          switch (requests.filters.selected) {
            case 0: requests.filterBikes(); break;
            case 1: requests.filterCurrentRentals(); break;
            case 2: requests.filterPendingRequests(); break;
            case 3: requests.filterUpcomingRentals(); break;
            case 4: requests.filterPastRentals(); break;
            case 5: requests.filterExpiredRequests(); break;
          }
        }
      };

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
        function (success) {
          requests.all_requests = $filter('orderBy')(success.data, '-created_at', true);
          requests.requests = angular.copy(requests.all_requests);
          requests.loadingList = false;
          requests.selected = $stateParams.requestId ? $stateParams.requestId : requests.requests[0].id;
          requests.loadRequest(requests.selected);
        },
        function () {
          requests.loadingList = false;
        }
      );

      var hideDialog = function () {
        // For small screens, show Chat Dialog again
        if ($mdMedia('xs')) {
          showChatDialog();
        } else {
          $mdDialog.hide();
        }
      };
      /**
       * called whenever user: 
       *    1- changes the switch (All, Lister, Rider)
       *    2- changes filter (all, current, pending, upcoming, past, expired)
       * @returns {void}
       */
      var selectDefaultRequest = function () {
        $timeout(function () {
          if (requests.requests.length > 0) {
            requests.selected = requests.requests[0].id;
            requests.loadRequest(requests.selected, false);
          }
        }, 200);
      };

      // Handles initial request loading
      requests.loadRequest = function (requestId, showDialog) {
        requests.selected = requestId;
        $state.go(".", { requestId: requestId }, { notify: false });
        requests.loadingChat = true;
        // Cancel the poller
        $interval.cancel(poller);
        // Clear former request
        requests.request = {};
        // Load the new request and activate the poller
        reloadRequest(requestId);
        poller = $interval(function () {
          reloadRequest(requestId);
        }, 10000);

        // For small screens, disable the embedded chat and show chat in a fullscreen dialog instead
        if ($mdMedia('xs')) {
          requests.showChat = false;
          if (showDialog) showChatDialog();
        } else {
          requests.showChat = true;
        }
      };

      requests.profilePicture = function (request) {
        if ($localStorage.userId == request.user.id) {
          return request.ride.image_file_1.thumb.url;
        } else {
          return request.user.profile_picture.url;
        }
      };

      var reloadRequest = function (requestId) {
        api.get('/requests/' + requestId).then(
          function (success) {
            // On initial load
            if (requests.request.messages == null || requests.request.messages.length != success.data.messages.length) {
              requests.request = success.data;
              requests.request.glued = true;
              requests.request = success.data;
              requests.request.rideChat = $localStorage.userId == requests.request.user.id;
              requests.request.rideChat ? requests.request.chatFlow = "rideChat" : requests.request.chatFlow = "listChat";

              if (requests.request.rideChat) {
                requests.request.rating = requests.request.lister.rating_lister + requests.request.lister.rating_rider;
                if (requests.request.lister.rating_lister != 0 && requests.request.lister.rating_rider != 0) {
                  requests.request.rating = requests.request.rating / 2
                }
              }
              else {
                requests.request.rating = requests.request.user.rating_lister + requests.request.user.rating_rider;
                if (requests.request.user.rating_lister != 0 && requests.request.user.rating_rider != 0) {
                  requests.request.rating = requests.request.rating / 2
                }
              }
              requests.request.rating = Math.round(requests.request.rating);

              requests.loadingChat = false;
            }
            api.post('/requests/' + requestId + '/messages/mark_as_read', { "user_id": $localStorage.userId }).then(
              function () {
              },
              function () {
                //
              }
            );
          },
          function () {
            requests.loadingChat = false;
          }
        );
      };

      var updateStatus = function (statusId) {
        var data = {
          "request": {
            "status": statusId
          }
        };

        api.put("/requests/" + requests.request.id, data).then(
          function (success) {
            reloadRequest(requests.request.id);
          },
          function (error) {
            reloadRequest(requests.request.id);
          }
        );
      };

      // This function handles booking and all necessary validations
      requests.confirmBooking = function () {
        api.get('/users/' + $localStorage.userId).then(
          function (success) {
            if (requests.request.ride.family == 2 || success.data.current_payment_method) {
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

      // This function handles request accept and all validations
      requests.acceptBooking = function() {
        api.get('/users/' + $localStorage.userId).then(
          function (success) {
            if (success.data.current_payout_method) {
              // Lister has already a payout method, so simply accept the request
              requests.loadingChat = true;
              updateStatus(2);
            } else {
              // Lister has no payout method yet, so show the payout method dialog
              showPayoutDialog(success.data);
            }
          },
          function (error) {

          }
        );
      }

      var showPaymentDialog = function (event) {
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

      var showPayoutDialog = function(user, event) {
        $mdDialog.show({
          locals: {user: user},
          controller: PayoutDialogController,
          controllerAs: 'settings',
          templateUrl: 'app/modules/requests/dialogs/payoutDialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: true // Only for -xs, -sm breakpoints.
        });
      }

      var showChatDialog = function (event) {
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

      var showBookingDialog = function (event) {
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

      requests.showRatingDialog = function (event) {
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
      requests.$onDestroy = function () {
        $interval.cancel(poller);
      };

      // Sends a new message by directly appending it locally and posting it to the API
      requests.sendMessage = function () {
        requests.request.glued = true
        // add property created_at_readable using current time
        // used in message timestamp
        var current_date = $filter('date')(new Date(), "MMM dd, HH:mm").replace(".", "");
        if (requests.message) {
          var data = {
            "request_id": requests.request.id,
            "sender": $localStorage.userId,
            "content": requests.message,
            "created_at_readable": current_date,
            "is_read": false
          };
          var message = {
            "message": data
          };
          requests.request.messages.push(data);
          api.post('/messages', message).then(function () {
            reloadRequest(requests.request.id);
          }, function () {
          });
        } else {
          requests.confirmBooking();
        }
        requests.message = "";
      };

      var ChatDialogController = function () {
        var chatDialog = this;
        chatDialog.requests = requests;
        chatDialog.hide = function () {
          $mdDialog.hide();
        };
      };

      var BookingDialogController = function () {
        var bookingDialog = this;
        bookingDialog.requests = requests;
        bookingDialog.duration = date.duration(requests.request.start_date, requests.request.end_date);

        bookingDialog.hide = hideDialog;

        bookingDialog.book = function () {
          var data = {
            "request": {
              "status": 3
            }
          };
          bookingDialog.hide();
          requests.loadingChat = true;
          api.put("/requests/" + requests.request.id, data).then(
            function () {
              reloadRequest(requests.request.id);
            },
            function () {
              reloadRequest(requests.request.id);
            }
          );
        };
      };

      var PaymentDialogController = function () {
        var paymentDialog = this;

        paymentDialog.openPaymentForm = function () {
          var w = 550;
          var h = 700;
          var left = (screen.width / 2) - (w / 2);
          var top = (screen.height / 2) - (h / 2);

          var locale = $translate.use();
          $window.open(ENV.userEndpoint + $localStorage.userId + "/payment_methods/new?locale=" + locale, "popup", "width=" + w + ",height=" + h + ",left=" + left + ",top=" + top);
          // For small screens, show Chat Dialog again
          hideDialog();
        }
      };

      // TODO: this code is appearing twice, here and in the settings Controller (settings.component.rb)
      var PayoutDialogController = function(user) {
        var payoutDialog = this;

        payoutDialog.user = user;

        payoutDialog.addPayoutMethod = function () {
          var data = {
            "payment_method": payoutDialog.payoutMethod
          };
  
          data.payment_method.user_id = $localStorage.userId;
  
          if (payoutDialog.payoutMethod.family == 1) {
            data.payment_method.email = "";
          } else {
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
              requests.loadingChat = true;
              updateStatus(2);
              hideDialog();
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
      };

      var RatingDialogController = function () {
        var ratingDialog = this;

        ratingDialog.rating = 5;

        ratingDialog.rate = function () {
          var data = {
            "rating": {
              "score": ratingDialog.rating,
              "message": ratingDialog.message,
              "author_id": $localStorage.userId,
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
            function () {
              var data = {
                "request": {
                  "status": newStatus
                }
              };
              api.put("/requests/" + requests.request.id, data).then(
                function () {
                  reloadRequest(requests.request.id);
                },
                function () {
                  reloadRequest(requests.request.id);
                }
              );
            },
            function () {
            }
          );
        };

        ratingDialog.hide = hideDialog;
      };

      requests.is_rider = function (request) {
        return request.user.id === $localStorage.userId
      }
      requests.is_lister = function (request) {
        return request.user.id !== $localStorage.userId
      }
      /**
        * filter lister/rider requests from all requests
        * DOM filtering is avoid b/c of performance overhead
        * @param {string} type type of request (as a lister or as a rider)
        * @param {string} reset_filter returns requests based on provided filter
        @returns {void}
        */
      requests.filterBikes = function (type, reset_filter) {
        if (type) {
          requests.filters.type = type
        }

        if (requests.filters.type === 'all') {
          requests.requests = angular.copy(requests.all_requests);
        }
        else {
          requests.requests = requests.all_requests.filter(function (response) {
            var condition = response.user.id !== $localStorage.userId;
            return (requests.filters.type === 'lister') ? condition : !condition;
          });
          if (reset_filter === true) requests.filters.selected = 0
        }
        if (reset_filter === true) selectDefaultRequest();
      };

      /**
       * All rentals which are currently rented out.
       * Within Request Start Date and End Date.
       * @return {requests} current rentals
       * @param {string} request type of request (as a lister or as a rider) 
       */
      requests.filterCurrentRentals = function () {
        // filter for lister or rider
        requests.filterBikes();
        // filter for pending requests
        requests.requests = requests.requests.filter(function (response) {
          var currentDate = Date.parse(new Date());
          var endDate = Date.parse(response.end_date);
          return (response.status === 3 && (endDate > currentDate));
        });
        selectDefaultRequest();
      };

      /**
       * It is a request sent by rider, but not yet accepted by the lister. 
       * The pending request moves to Upcoming Rentals as soon as the lister
       * accepted and the rider accepted and paid
       * @return {requests} pending requests
       * @param {string} request type of request (as a lister or as a rider)
       */
      requests.filterPendingRequests = function () {
        // filter for lister or rider
        requests.filterBikes();
        // filter for pending requests
        requests.requests = requests.requests.filter(function (response) {
          return (response.status === 1 || response.status === 2);
        });
        selectDefaultRequest();
      };

      /**
       * It is a request sent by rider, but not yet accepted by the lister. 
       * The pending request moves to Upcoming Rentals as soon as the lister
       * accepted and the rider accepted and paid
       * @return {requests} upcoming rentals
       * @param {string} request type of request (as a lister or as a rider)
       */
      requests.filterUpcomingRentals = function () {
        // filter for lister or rider
        requests.filterBikes();
        // filter for pending requests
        requests.requests = requests.requests.filter(function (response) {
          var currentDate = Date.parse(new Date());
          var startDate = Date.parse(response.start_date);
          return (response.status === 3 && (startDate > currentDate));
        });
        selectDefaultRequest();
      };

      /**
       * Rentals accepted and paid but are now in the past,
       * meaning 24h after the End Date.
       * @return {requests} past rentals
       * @param {string} request type of request (as a lister or as a rider)
       */
      requests.filterPastRentals = function () {
        // filter for lister or rider
        requests.filterBikes();
        // filter for pending requests
        requests.requests = requests.requests.filter(function (response) {
          var currentDate = Date.parse(new Date());
          var endDate = Date.parse(response.end_date);
          return (response.status === 3 && (endDate < currentDate));
        });
        selectDefaultRequest();
      };

      /**
       * These were the pending requests
       * but their end time is now over
       * @return {requests} expired requests
       * @param {string} request type of request (as a lister or as a rider)
       */
      requests.filterExpiredRequests = function () {
        // filter for lister or rider
        requests.filterBikes();
        // filter for pending requests
        requests.requests = requests.requests.filter(function (response) {
          var currentDate = Date.parse(new Date());
          var endDate = Date.parse(response.end_date);
          return ((response.status === 1 || response.status === 2) && (endDate < currentDate));
        });
        selectDefaultRequest();
      };
    }
  ]
});