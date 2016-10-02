'use strict';

angular.module('listingCard').component('listingCard', {
  templateUrl: 'app/modules/shared/listing-card/listing-card.template.html',
  controllerAs: 'listingCard',
  bindings: {
    bikeId: '<',
    name: '<',
    brand: '<',
    price: '<',
    imageUrl: '<',
    available: '<',
    removeBike: '&'
  },
  controller: [ '$state', 'api',
    function ListingCardController($state, api) {
      var listingCard = this;
      // TODO: bike-card and listing-card

      listingCard.onActivateClick = function() {
        listingCard.disableActivate = true;
        api.put("/rides/" + bikeId, {"ride": {"available": "true"}}).then(
          function(response) {
            listingCard.disableActivate = false;
            listingCard.available = true;
          },
          function(error) {
            listingCard.disableActivate = false;
            console.log("Error", error);
          }
        );
      };

      listingCard.onDeactivateClick = function() {
        listingCard.disableDeactivate = true;
        api.put("/rides/" + bikeId, {"ride": {"available": "false"}}).then(
          function(response) {
            listingCard.disableDeactivate = false;
            listingCard.available = false;
          },
          function(error) {
            listingCard.disableDeactivate = false;
            console.log("Error", error);
          }
        );
      };

      listingCard.onDeleteClick = function() {
        // TODO: display modal before deleting bike
        listingCard.disableDelete = true;
        api.put("/rides/" + bikeId, {"ride": {"active": "false"}}).then(
          function(response) {
            // TODO: uncomment
            // listingCard.removeBike(bikeId);
          },
          function(error) {
            console.log("Error", error);
          }
        );
      };
    }
  ]
});