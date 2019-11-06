angular
  .module('requests')
  .factory('requestsService', function(
    $q,
    $localStorage,
    $analytics,
    $mdDialog,
    payoutHelper,
    api,
    MESSAGE_STATUSES
  ) {
    const requestsService = {
      updateStatus({ request, statusId, paymentWarning }) {
        const payload = {
          request: {
            status: statusId
          }
        };

        return api.put('/requests/' + request.id, payload).catch(error => {
          if (paymentWarning) {
            $mdDialog.show(
              $mdDialog
                .alert(event)
                .parent(angular.element(document.body))
                .clickOutsideToClose(true)
                .title("The bike couldn't be booked")
                .textContent(
                  "Unfortunately, the payment didn't succeed, so the bike could not be booked. The rider already got informed and we'll get back to you as soon as possible to finish the booking."
                )
                .ok('Okay')
                .targetEvent(event)
            );
          }
          return $q.reject(error);
        });
      },

      rejectBooking({ request, clickEvent, options = {} }) {
        const statusId =
          request.user.id === $localStorage.userId
            ? MESSAGE_STATUSES.RIDER_CANCELED
            : MESSAGE_STATUSES.LISTER_CANCELED;

        const payload = {
          request: {
            status: statusId
          }
        };

        return requestsService
          .showRejectConfirmationDialog({
            clickEvent,
            options
          })
          .then(() => api.put('/requests/' + request.id, payload))
          .then(() => {
            if (statusId === MESSAGE_STATUSES.LISTER_CANCELED) {
              $analytics.eventTrack('Request Received', {
                category: 'Rent Bike',
                label: 'Reject'
              });
            }
            return { statusId };
          });
      },

      // This function handles request accept and all validations
      acceptBooking({ request }) {
        return api
          .get('/users/' + $localStorage.userId)
          .then(userResponse => userResponse.data)
          .then(
            user => {
              if (requestsService.validPayoutMethod(user)) {
                // Lister has already a payout method, so simply accept the request

                ga('set', 'userId', request.user.id); //set unique userID (riderID)
                ga('send', 'pageview');
                ga('require', 'ecommerce');
                ga('ecommerce:addTransaction', {
                  id: request.id,
                  affiliation: request.lister.id,
                  revenue: request.total,
                  tax: '0' // vat tax
                });
                ga('ecommerce:addItem', {
                  id: request.id,
                  name: [
                    request.ride.brand,
                    request.ride.name,
                    request.ride.size
                  ].join(', '),
                  sku: request.ride.id,
                  category: request.ride.category.name,
                  price: request.total,
                  quantity: '1'
                });
                ga('ecommerce:send');

                return requestsService.updateStatus({
                  request,
                  statusId: MESSAGE_STATUSES.ACCEPTED,
                  paymentWarning: true
                });
              } else {
                // Lister has no payout method yet, so show the payout method dialog
                return requestsService.showPayoutDialog(user).then(() => {
                  return requestsService.updateStatus({
                    request,
                    statusId: MESSAGE_STATUSES.ACCEPTED,
                    paymentWarning: false
                  });
                });
              }
            },
            rejection => {}
          );
      },

      validPayoutMethod(user) {
        if (!user.payout_method) return false;

        if (
          user.payout_method &&
          user.payout_method.payment_type === 'credit-card'
        ) {
          return (
            user.payout_method.iban &&
            user.payout_method.bic &&
            user.payout_method.first_name &&
            user.payout_method.last_name
          );
        }

        return true;
      },

      showRejectConfirmationDialog({ clickEvent, options = {} }) {
        const confirmationOptions = Object.assign(
          {
            buttonClass:
              'message-button md-raised md-warn lnr-m-0 md-button md-ink-ripple'
          },
          options,
          {
            confirm: $mdDialog.hide,
            cancel: $mdDialog.cancel
          }
        );
        return $mdDialog.show({
          templateUrl:
            'app/modules/shared/confirmation/confirmation.template.html',
          controller: function($scope) {
            $scope.confirmation = confirmationOptions;
          },
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          targetEvent: clickEvent
        });
      },

      showPayoutDialog(user, event) {
        return $mdDialog.show({
          locals: { user: user },
          controller: PayoutDialogController,
          controllerAs: 'settings',
          templateUrl:
            'app/modules/requests/dialogs/payoutDialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: true // Only for -xs, -sm breakpoints.
        });
      }
    };

    return requestsService;

    function PayoutDialogController(user) {
      const payoutDialog = this;

      payoutDialog.user = user;
      payoutDialog.emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      payoutDialog.addPayoutMethod = function() {
        payoutHelper.postPayout(
          payoutDialog.payoutMethod.formData,
          payoutDialog.payoutMethod.payment_type,
          onSuccessPayoutUpdate
        );

        function onSuccessPayoutUpdate() {
          $mdDialog.hide();
        }
      };
    }
  });
