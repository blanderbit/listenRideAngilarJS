'use strict';

angular.module('listings',[]).component('listings', {
  templateUrl: 'app/modules/listings/listings.template.html',
  controllerAs: 'listings',
  controller: ['$scope', '$filter','$state', '$localStorage', '$mdMedia', 'api', 'accessControl',
    function ListingsController($scope, $filter, $state, $localStorage, $mdMedia, api, accessControl) {
      if (accessControl.requireLogin()) {
        return
      }
      var listings = this;
      listings.maxTiles = 12;
      listings.status = '';
      listings.duplicating = false;
      api.get('/users/' + $localStorage.userId + "/rides").then(
        function(response) {
          listings.bikes = response.data;
          listings.mirror = response.data;
          listings.listView = (listings.bikes.length >= listings.maxTiles) && $mdMedia('gt-sm');
        },
        function(error) {
        }
      );

      listings.search = function () {
        listings.bikes = $filter('filter')(listings.mirror, filterFunction, {$ : listings.input});
      };

      listings.listBike = function() {
        $state.go('list');
      };

      var filterFunction = function(bike) {
        //TODO improve search by reducing extra params from backend
        var val = listings.input;
        return bike.name.indexOf(val) > -1 || bike.city.indexOf(val) > -1 || bike.brand.indexOf(val) > -1;
      };

      listings.removeBike = function(bikeId) {
        listings.bikes = listings.bikes.filter(function(bike) {
          return parseInt(bike.id) !== bikeId;
        })
      };

      listings.isDekstopView = function () {
        console.log($mdMedia);
      };
    }
  ]
});
