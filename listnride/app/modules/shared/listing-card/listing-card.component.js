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
  controller: ['api', 'notification', 'helpers',
    function ListingCardController(api, notification, helpers) {
      var listingCard = this;

      listingCard.$onInit = function() {
        //variables
        listingCard.price = Math.ceil(listingCard.price);

        //methods
        listingCard.checkBike = listingCard.onBikeTileCheck;
        listingCard.onActivateClick = onActivateClick;
        listingCard.deactivate = deactivate;
      }

      // activate a bike
      // implementation is different from parent component
      function onActivateClick() {
        listingCard.disableActivate = true;
        api.put(getBikeEditUrl(), {"ride": {"id": listingCard.bikeId, "available": "true"}}).then(
          function(response) {
            listingCard.disableActivate = false;
            listingCard.available = true;
          },
          function(error) {
            listingCard.disableActivate = false;
          }
        );
      }

      // deactivate a bike
      // implementation is different from parent component
      function deactivate() {
        listingCard.disableDeactivate = true;
        api.put(getBikeEditUrl(), {"ride": {"id": listingCard.bikeId, "available": "false"}}).then(
          function(response) {
            listingCard.disableDeactivate = false;
            listingCard.available = false;
          },
          function(error) {
            listingCard.disableDeactivate = false;
            notification.show(error, 'error');
          }
        );
      }

      function getBikeEditUrl() {
        return listingCard.bike.is_cluster ? '/clusters/' + listingCard.bike.cluster_id + '/update_rides/' : ' /rides/ ' + listingCard.bikeId;
      }
    }
  ]
});
