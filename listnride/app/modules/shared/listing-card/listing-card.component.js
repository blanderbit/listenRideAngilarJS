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
    isDuplicating: '=',
    duplicate: '<',
    delete: '<',
    edit: '<',
    view: '<',
    changeAvailability: '<',
    showLabels: '<',
    isSelectable: '<'
  },
  controller: ['api', 'notification', 'helpers', function ListingCardController(api, notification, helpers) {
      var listingCard = this;

      listingCard.price = Math.ceil(listingCard.price);

      // activate a bike
      // implementation is different from parent component
      listingCard.onActivateClick = function() {
        listingCard.disableActivate = true;
        api.put("/rides/" + listingCard.bikeId, {"ride": {"available": "true"}}).then(
          function(response) {
            listingCard.disableActivate = false;
            listingCard.available = true;
          },
          function(error) {
            listingCard.disableActivate = false;
          }
        );
      };

      // deactivate a bike
      // implementation is different from parent component
      listingCard.deactivate = function() {
        listingCard.disableDeactivate = true;
        api.put("/rides/" + listingCard.bikeId, {"ride": {"available": "false"}}).then(
          function(response) {
            listingCard.disableDeactivate = false;
            listingCard.available = false;
          },
          function(error) {
            listingCard.disableDeactivate = false;
            notification.show(error, 'error');
          }
        );
      };
    }
  ]
});
