'use strict';

angular.module('listingCard',[]).component('listingCard', {
  templateUrl: 'app/modules/shared/listing-card/listing-card.template.html',
  controllerAs: 'listingCard',
  bindings: {
    status: '=',
    bikeId: '<',
    bike: '<',
    name: '<',
    brand: '<',
    category: '<',
    price: '<',
    imageUrl: '<',
    available: '<',
    removeBike: '&',
    isDuplicating: '=',
    getBikes: '<',
    duplicate: '<'
  },
  controller: [ '$state', '$mdDialog', '$translate', 'api', '$mdToast',
    function ListingCardController($state, $mdDialog, $translate, api, $mdToast) {
      var listingCard = this;
      
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

      function deleteBike() {
        api.put("/rides/" + listingCard.bikeId, {"ride": {"active": "false"}}).then(
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
