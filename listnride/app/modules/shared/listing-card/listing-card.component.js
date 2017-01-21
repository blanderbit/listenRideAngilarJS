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
    removeBike: '&'
  },
  controller: [ '$state', '$mdDialog', '$translate', 'api',
    function ListingCardController($state, $mdDialog, $translate, api) {
      var listingCard = this;

      listingCard.onDeleteClick = function(event) {
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
      }

      var DeleteBikeController = function(deleteBike) {
        var deleteBikeDialog = this;

        deleteBikeDialog.hide = function() {
          $mdDialog.hide();
        };

        deleteBikeDialog.deleteBike = function() {
          deleteBike();
          $mdDialog.hide();
        }
      }

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
        listingCard.disableDelete = true;
        api.put("/rides/" + listingCard.bikeId, {"ride": {"active": "false"}}).then(
          function(response) {
            listingCard.removeBike({'bikeId': listingCard.bikeId});
          },
          function(error) {
            console.log("Error deleting bike", error);
          }
        );
      };
    }
  ]
});