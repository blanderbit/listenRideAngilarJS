'use strict';

angular.module('listings').component('listings', {
  templateUrl: 'app/modules/listings/listings.template.html',
  controllerAs: 'listings',
  controller: [ '$state', '$localStorage', 'api',
    function ListingsController($state, $localStorage, api) {
      var listings = this;

      api.get('/users/' + $localStorage.userId + "/rides").then(
        function(response) {
          console.log(response.data);
          listings.bikes = response.data;
        },
        function(error) {
          console.log("Error retrieving User", error);
        }
      );

      listings.onDeleteClick = function(bike) {
        // TODO: display modal before deleting bike
        bike.disableDelete = true;
        api.put("/rides/" + bike.id, {"ride": {"active": "false"}}).then(
          function(response) {
            listings.bikes = listings.bikes.filter(function(_bike) {
              return _bike.id != bike.id;
            })
          },
          function(error) {
            console.log("Error", error);
          }
        );
      };

      listings.onActivateClick = function(bike) {
        bike.disableActivate = true;
        api.put("/rides/" + bike.id, {"ride": {"available": "true"}}).then(
          function(response) {
            bike.disableActivate = false;
            bike.available = true;
          },
          function(error) {
            bike.disableActivate = false;
            console.log("Error", error);
          }
        );
      };

      listings.onDeactivateClick = function(bike) {
        bike.disableDeactivate = true;
        api.put("/rides/" + bike.id, {"ride": {"available": "false"}}).then(
          function(response) {
            bike.disableDeactivate = false;
            bike.available = false;
          },
          function(error) {
            bike.disableDeactivate = false;
            console.log("Error", error);
          }
        );
      };     
    }
  ]
});