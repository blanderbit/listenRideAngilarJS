'use strict';

angular.module('listings',[]).component('listings', {
  templateUrl: 'app/modules/listings/listings.template.html',
  controllerAs: 'listings',
  controller: ['$filter', '$localStorage','$mdSidenav', 'api', 'accessControl',
    function ListingsController($filter, $localStorage, $mdSidenav, api, accessControl) {
      if (accessControl.requireLogin()) {
        return
      }
      var listings = this;
      listings.maxTiles = 2;
      api.get('/users/' + $localStorage.userId + "/rides").then(
        function(response) {
          listings.bikes = response.data;
          listings.mirror_bikes = response.data;
          listings.listView = listings.bikes.length >= listings.maxTiles;
        },
        function(error) {
        }
      );

      listings.search = function () {
        listings.bikes = $filter('filter')(listings.mirror_bikes,{$ : listings.input});
      };

      listings.toggleSidenav = function () {
        $mdSidenav('edit').toggle();
      };

      listings.removeBike = function(bikeId) {
        listings.bikes = listings.bikes.filter(function(bike) {
          return parseInt(bike.id) !== bikeId;
        })
      };
    }
  ]
});
