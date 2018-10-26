'use strict';

angular.module('requests', ['infinite-scroll'])
  .component('requests', {
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
    '$mdToast',
    '$analytics',
    'date',
    'accessControl',
    function RequestsController($localStorage, $interval, $filter,
      $mdMedia, $mdDialog, $window, api,
      $timeout, $location, $anchorScroll,
      $state, $stateParams, $translate, $mdToast, $analytics, date,
      accessControl) {

      var requests = this;
      // user should be logged in
      if (accessControl.requireLogin()) return;

      // TODO: remove poller
      var poller;

      requests.$onInit = function () {
        // variables
        requests.selected = 0;
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
        requests.all_requests = [];
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
        requests.currentPage = 1;
        requests.requestsLeft = false;
        requests.is_rider = function (request) {
          return request.user.id === $localStorage.userId
        }
        requests.is_lister = function (request) {
          return request.user.id !== $localStorage.userId
        }

        // methods
        // requests.nextPage = nextPage;
        requests.loadRequest = loadRequest;
        requests.reloadRequest = reloadRequest;
        requests.updateStatus = updateStatus;
        requests.acceptBooking = acceptBooking;
        requests.showRatingDialog = showRatingDialog;
        requests.sendMessage = sendMessage;
        requests.filterBikes = filterBikes;
        requests.filterCurrentRentals = filterCurrentRentals;
        requests.filterPendingRequests = filterPendingRequests;
        requests.filterUpcomingRentals = filterUpcomingRentals;
        requests.filterPastRentals = filterPastRentals;
        requests.filterExpiredRequests = filterExpiredRequests;

        // invocates
        getRequests();
      }

      requests.$onDestroy = function () {
        $interval.cancel(poller);
      };

      function getRequests () {
        requests.loadingList = true;
        api.get('/users/' + $localStorage.userId + '/requests/').then(
          function (success) {
            requests.all_requests = success.data.requests;
            requests.requests = angular.copy(requests.all_requests);

            requests.filterBikes(requests.filters.type, false);
            requests.filters.applyFilter(requests.filters.selected);

            // Open request on first load
            if (requests.all_requests.length > 0) {
              requests.selected = $stateParams.requestId ? $stateParams.requestId : requests.requests[0].id;
              requests.loadRequest(requests.selected);
            }

            requests.loadingList = false;
          },
          function (error) {
            requests.loadingList = false;
          }
        );
      }

      function nextPage () {
        requests.loadingList = true;
        api.get('/users/' + $localStorage.userId + '/requests').then(
          function (success) {
            var newRequests = success.data.requests;
            requests.all_requests = requests.all_requests.concat(newRequests);
            requests.requests = angular.copy(requests.all_requests);
            requests.filterBikes(requests.filters.type, false);
            requests.filters.applyFilter(requests.filters.selected);
            requests.loadingList = false;

            requests.requestsLeft = !_.isEmpty(success.data.links.next_rider) || !_.isEmpty(success.data.links.next_lister);
            if (requests.all_requests.length > 0) {
              requests.selected = $stateParams.requestId ? $stateParams.requestId : requests.requests[0].id;
              requests.loadRequest(requests.selected);
            }
          },
          function (error) {
            requests.loadingList = false;
          }
        );
      };

      /**
       * called whenever user:
       *    1- changes the switch (All, Lister, Rider)
       *    2- changes filter (all, current, pending, upcoming, past, expired)
       * @returns {void}
       */
      function selectDefaultRequest () {
        $timeout(function () {
          if (requests.requests.length > 0) {
            requests.selected = requests.requests[0].id;
            requests.loadRequest(requests.selected, false, 0);
          }
        }, 200);
      };

      // Handles initial request loading
      function loadRequest (requestId, showDialog, index) {
        requests.selected = requestId;
        $state.go($state.current, {
          requestId: requestId
        }, {
          notify: false
        });
        requests.loadingChat = true;
        // Cancel the poller
        $interval.cancel(poller);
        // Clear former request
        requests.request = {};
        // Load the new request and activate the poller
        reloadRequest(requestId);
        var last_message = requests.requests[index] ? requests.requests[index].message : null;
        if (!!last_message && !last_message.is_read && last_message.receiver === parseInt($localStorage.userId)) {
          api.post('/requests/' + requestId + '/messages/mark_as_read', { "user_id": $localStorage.userId }).then(
            function (success) {
              last_message.is_read = true;
              if ($localStorage.unreadMessages > 0) {
                $localStorage.unreadMessages -= 1;
              }
            }
          );
        }
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

      function reloadRequest (requestId) {
        api.get('/requests/' + requestId).then(
          function (success) {
            // On initial load
            if (requests.request.messages == null || requests.request.messages.length != success.data.messages.length) {
              requests.request = success.data;
              requests.request.glued = true;
              requests.request = success.data;
              requests.request.rideChat = $localStorage.userId == requests.request.user.id;
              requests.request.rideChat ? requests.request.chatFlow = "rideChat" : requests.request.chatFlow = "listChat";
              requests.request.past = (new Date(requests.request.end_date).getTime() < Date.now());
              requests.request.started = (new Date(requests.request.start_date).getTime() < Date.now());
              var endDate = new Date(requests.request.end_date);
              requests.request.returnable = (new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 0, 0, 0) < Date.now());

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
          },
          function () {
            requests.loadingChat = false;
          }
        );
      };

      function updateStatus (statusId, paymentWarning) {
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
            requests.loadingChat = false;
            if (paymentWarning) {
              $mdDialog.show(
                $mdDialog.alert(event)
                  .parent(angular.element(document.body))
                  .clickOutsideToClose(true)
                  .title('The bike couldn\'t be booked')
                  .textContent('Unfortunately, the payment didn\'t succeed, so the bike could not be booked. The rider already got informed and we\'ll get back to you as soon as possible to finish the booking.')
                  .ok('Okay')
                  .targetEvent(event)
              );
            }
          }
        );
      };

      // This function handles request accept and all validations
      function acceptBooking () {
        api.get('/users/' + $localStorage.userId).then(
          function (success) {
            if (success.data.current_payout_method) {
              // Lister has already a payout method, so simply accept the request
              requests.loadingChat = true;
              updateStatus(3, true);
              $analytics.eventTrack('Request Received', {  category: 'Rent Bike', label: 'Accept'});
            } else {
              // Lister has no payout method yet, so show the payout method dialog
              showPayoutDialog(success.data);
            }
          },
          function (error) {

          }
        );
      };

      // Sends a new message by directly appending it locally and posting it to the API
      function sendMessage () {
        requests.request.glued = true
        // add property created_at_readable using current time
        // used in message timestamp
        var current_date = $filter('date')(new Date(), "MMM dd, HH:mm").replace(".", "");
        if (requests.message) {
          var data = {
            "request_id": requests.request.id,
            "sender": $localStorage.userId,
            "content": requests.message,
            "created_at": new Date(),
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


      // DIALOGS
      // Payout Dialog
      function showPayoutDialog(user, event) {
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
      };

      // TODO: this code is appearing twice, here and in the settings Controller (settings.component.rb)
      function PayoutDialogController(user) {
        var payoutDialog = this;

        payoutDialog.user = user;
        payoutDialog.emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
              updateStatus(2, false);
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

      // Chat Dialog
      function showChatDialog (event) {
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

      function ChatDialogController() {
        var chatDialog = this;
        chatDialog.requests = requests;
        chatDialog.hide = function () {
          $mdDialog.hide();
        };
      };

      // Rating Dialog
      function showRatingDialog (event) {
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

      function RatingDialogController () {
        var ratingDialog = this;

        ratingDialog.rating = 5;
        ratingDialog.request = requests.request;

        ratingDialog.rate = function () {
          var data = {
            "rating": {
              "score": ratingDialog.rating,
              "message": ratingDialog.message,
              "author_id": $localStorage.userId
            }
          };
          var newStatus;

          // rider rating
          if (requests.request.rideChat) {
            data.rating.ride_id = requests.request.ride.id;
            newStatus = 6;
          }

          // lister rating
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
                  /*
                  Logic to show the Referal Dialog:
                  1- If newStatus is 5, rating > 3 and isBusiness is false -> show dialog to lister
                  2- If newStatus is 6, rating > 3 and isBusiness is false -> show dialog to rider
                  */
                  // rating > 3 and user has no business
                  if (parseInt(ratingDialog.rating) > 3 && $localStorage.isBusiness === false) {
                    // show lister dialog
                    if (parseInt(newStatus) === 5) {
                      $mdDialog.show({
                        // template for referral dialog for lister
                        templateUrl: 'app/modules/referral-link/referral-link.lister.template.html',
                        parent: angular.element(document.body),
                        locals: {close: $mdDialog.hide},
                        controller: angular.noop,
                        controllerAs: 'mdDialog',
                        bindToController: true,
                        targetEvent: event,
                        openFrom: angular.element(document.body),
                        closeTo: angular.element(document.body),
                        fullscreen: true // Only for -xs, -sm breakpoints.
                      });
                    }
                    // show rider dialog
                    else if (parseInt(newStatus) === 6) {
                      $mdDialog.show({
                        // template for referral dialog for rider
                        templateUrl: 'app/modules/referral-link/referral-link.rider.template.html',
                        parent: angular.element(document.body),
                        locals: {close: $mdDialog.hide},
                        controller: angular.noop,
                        controllerAs: 'mdDialog',
                        bindToController: true,
                        targetEvent: event,
                        openFrom: angular.element(document.body),
                        closeTo: angular.element(document.body),
                        fullscreen: true // Only for -xs, -sm breakpoints.
                      });
                    }
                  }
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

      function hideDialog() {
        // For small screens, show Chat Dialog again
        if ($mdMedia('xs')) {
          showChatDialog();
        } else {
          $mdDialog.hide();
        }
      };

      /**
        * filter lister/rider requests from all requests
        * DOM filtering is avoid b/c of performance overhead
        * @param {string} type type of request (as a lister or as a rider)
        * @param {string} reset_filter returns requests based on provided filter
        @returns {void}
        */
      function filterBikes (type, reset_filter) {
        requests.filters.type = type ? type : 'all';

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
      function filterCurrentRentals () {
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
      function filterPendingRequests () {
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
      function filterUpcomingRentals () {
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
      function filterPastRentals () {
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
      function filterExpiredRequests () {
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
