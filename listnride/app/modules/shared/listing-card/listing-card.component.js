'use strict';

angular.module('listingCard',[]).component('listingCard', {
  templateUrl: 'app/modules/shared/listing-card/listing-card.template.html',
  controllerAs: 'listingCard',
  bindings: {
    bikeId: '<',
    name: '<',
    brand: '<',
    category: '<',
    price: '<',
    imageUrl: '<',
    available: '<',
    removeBike: '&',
    status: '=',
    duplicating: '='
  },
  controller: [ '$state', '$mdDialog', '$translate', '$timeout', 'api', '$mdToast',
    function ListingCardController($state, $mdDialog, $translate, $timeout, api, $mdToast) {
      var listingCard = this;

      listingCard.duplicating = false;

      listingCard.onDeleteClick = function(id, event) {
        $mdDialog.show({
          controller: DeleteBikeController,
          controllerAs: 'deleteBikeDialog',
          templateUrl: 'app/modules/shared/listing-card/delete-bike-dialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          locals: {
            deleteBike: deleteBike
          }
        });
      };

      var DeleteBikeController = function(deleteBike) {
        var deleteBikeDialog = this;

        deleteBikeDialog.hide = function() {
          $mdDialog.hide();
        };

        deleteBikeDialog.deleteBike = function() {
          deleteBike();
          $mdDialog.hide();
        }
      };

      listingCard.onActivateClick = function() {
        listingCard.disableActivate = true;
        api.put("/rides/" + listingCard.bikeId, {"ride": {"available": "true"}}).then(
          function(response) {
            listingCard.disableActivate = false;
            listingCard.available = true;
          },
          function(error) {
            listingCard.disableActivate = false;
            console.log("Error activating bike", error);
          }
        );
      };

      listingCard.onDeactivateClick = function() {
        listingCard.disableDeactivate = true;
        api.put("/rides/" + listingCard.bikeId, {"ride": {"available": "false"}}).then(
          function(response) {
            listingCard.disableDeactivate = false;
            listingCard.available = false;
          },
          function(error) {
            listingCard.disableDeactivate = false;
            console.log("Error deactivating bike", error);
          }
        );
      };

      var DuplicateBikeController = function() {
        var duplicate = this;
        duplicate.duplicate_number = 1;

        // cancel the dialog
        duplicate.cancelDialog = function() {
          $mdDialog.cancel();
        };

        // close the dialog succesfully
        duplicate.closeDialog = function () {
          $mdDialog.hide(parseInt(duplicate.duplicate_number));
        };
      };

      listingCard.onDuplicateClick = function() {
        $mdDialog.show({
          templateUrl: 'app/modules/listings/views/list-view.duplicate.template.html',
          controller: DuplicateBikeController,
          controllerAs: 'duplicate',
          parent: angular.element(document.body),
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          escapeToClose: true,
          fullscreen: true
        }).then(function (duplicate_number) {
          api.post('/rides/' + listingCard.bikeId + '/duplicate', {
            "quantity": duplicate_number
          }).then(function (response) {
            var job_id = response.data.job_id;
            listingCard.getStatus(job_id, 'initialized');
            $mdToast.show(
              $mdToast.simple()
                .textContent($translate.instant('toasts.duplicate-start'))
                .hideDelay(4000)
                .position('top center')
            );
          }, function () {
            $mdToast.show(
              $mdToast.simple()
                .textContent($translate.instant('toasts.error'))
                .hideDelay(4000)
                .position('top center')
            );
          });
        }, function () {
        });
      };

      listingCard.getStatus = function (jobId, status) {
        listingCard.duplicating = true;
        api.get('/rides/' + listingCard.bikeId + '/status/' + jobId).then(function (response) {
          listingCard.status = response.data.status;
          if(listingCard.status !== 'complete') {
            $timeout(function() { listingCard.getStatus(jobId, listingCard.status); }, 5000);
          } else if(listingCard.status === 'complete') {
            listingCard.duplicating = false;
            $mdToast.show(
              $mdToast.simple()
                .textContent($translate.instant('toasts.duplicate-finish'))
                .hideDelay(4000)
                .position('top center')
            );
          }
        }, function (error) {
          $mdToast.show(
            $mdToast.simple()
              .textContent($translate.instant('toasts.error'))
              .hideDelay(4000)
              .position('top center')
          );
        });
      };

      function deleteBike() {
        api.delete("/rides/" + listingCard.bikeId, {"ride": {"active": "false"}}).then(
          function(response) {
            listingCard.removeBike({'bikeId': listingCard.bikeId});
            listingCard.disableDelete = true;
            $analytics.eventTrack('List a Bike', {  category: 'List Bike', label: 'Bike Removed'});
          },
          function(error) {
            $mdToast.show(
              $mdToast.simple()
                .textContent($translate.instant('toasts.pending-requests'))
                .hideDelay(4000)
                .position('top center')
            );
          }
        );
      }
    }
  ]
});
