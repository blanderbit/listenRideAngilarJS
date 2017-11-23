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
      api.get('/users/' + $localStorage.userId + "/rides").then(
        function(response) {
          listings.bikes = response.data;
          listings.mirror_bikes = response.data;
          listings.listView = (listings.bikes.length >= listings.maxTiles) && $mdMedia('gt-sm');
        },
        function(error) {
        }
      );

      listings.search = function () {
        listings.bikes = $filter('filter')(listings.mirror_bikes,{$ : listings.input});
      };

      listings.listBike = function() {
        $state.go('list');
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
