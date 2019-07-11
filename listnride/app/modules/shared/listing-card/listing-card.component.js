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
    isCheckModeOn: '<',
    onBikeTileCheck: '<',
    isChecked: '<',
    isSelectable: '<',
    unmerge: '<'
  },
  controller: function ListingCardController(api, notification, bikeHelper) {
      var listingCard = this;

      listingCard.$onInit = function() {
        //variables
        listingCard.price = Math.ceil(listingCard.price);

        //methods
        listingCard.checkBike = listingCard.onBikeTileCheck;
        listingCard.activateBike = activateBike;
        listingCard.deactivateBike = deactivateBike;
      }

      // activate a bike
      // implementation is different from parent component
      function activateBike() {
        listingCard.changeAvailableInProgress = true;
        bikeHelper.changeBikeAvailableTo(listingCard.bike, true)
          .then(response => {
            listingCard.changeAvailableInProgress = false;
            listingCard.available = true;
          })
          .catch(error => {
            listingCard.changeAvailableInProgress = false;
            notification.show(error, 'error');
          })
      }

      // deactivate a bike
      // implementation is different from parent component
      function deactivateBike() {
        listingCard.changeAvailableInProgress = true;
        bikeHelper.changeBikeAvailableTo(listingCard.bike, false)
          .then(response => {
            listingCard.changeAvailableInProgress = false;
            listingCard.available = false;
          })
          .catch(error => {
            listingCard.changeAvailableInProgress = false;
            notification.show(error, 'error');
          })
      }
    }
  }
);
