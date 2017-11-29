'use strict';

angular.module('listings',[]).component('listings', {
  templateUrl: 'app/modules/listings/listings.template.html',
  controllerAs: 'listings',
  controller: ['$scope', 
               '$mdDialog', 
               '$timeout',
               '$mdToast', 
               '$filter', 
               '$translate',
               '$state', 
               '$localStorage', 
               '$mdMedia', 
               'api', 
               'accessControl',
    function ListingsController($scope, $mdDialog, $timeout, $mdToast, $filter, $translate, $state, $localStorage, $mdMedia, api, accessControl) {
      if (accessControl.requireLogin()) {
        return
      }
      var listings = this;
      listings.maxTiles = 12;
      listings.status = '';
      listings.isDuplicating = false;
      
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

      listings.getStatus = function (bike, jobId, status) {
        listings.isDuplicating = true;
        api.get('/rides/' + bike.id + '/status/' + jobId).then(function (response) {
          listings.status = response.data.status;
          /*
          if status is not complete
          keep checking the status api every 5 seconds
          */
          if (listings.status !== 'complete') {
            // avoid self invocation of a function
            $timeout(function () {
              listings.getStatus(bike, jobId, listings.status)
            },
            // every 5 sec
              5000);
          } 
          /*
          once status is complete
          bind new bikes with controller scope
          */
          else if (listings.status === 'complete') {
            listings.isDuplicating = false;
            listings.getBikes();
          }
        }, function (error) {
        });
      };

      // local method to be used as duplicate dialog controller
      function DuplicateController() {
        var duplicate = this;
        duplicate.duplicate_number = 1;

        // cancel the dialog
        duplicate.cancelDialog = function () {
          $mdDialog.cancel();
        };

        // close the dialog succesfully
        duplicate.closeDialog = function () {
          $mdDialog.hide(parseInt(duplicate.duplicate_number));
        };
      }

      // local method to be called on duplicate success
      function onDuplicateSuccess(bike, duplicate_number) {
        api.post('/rides/' + bike.id + '/duplicate', {
          "quantity": duplicate_number
        }).then(function (response) {
          var job_id = response.data.job_id;
          listings.getStatus(bike, job_id, 'initialized');
          $mdToast.show(
            $mdToast.simple()
              .textContent($translate.instant('toasts.duplicate-start'))
              .hideDelay(4000)
              .position('top center')
          );
        }, function () {
          $mdToast.show(
            $mdToast.simple()
              .textContent($translate.instant('toasts.error'))
              .hideDelay(4000)
              .position('top center')
          );
        });
      }

      listings.duplicate = function (bike, event) {
        var duplicateConfig = {
          templateUrl: 'app/modules/listings/views/list-view.duplicate.template.html',
          controller: DuplicateController,
          controllerAs: 'duplicate',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          escapeToClose: true,
          fullscreen: true
        };
        $mdDialog.show(duplicateConfig).then(function (duplicate_number) {
          onDuplicateSuccess(bike, duplicate_number);
        }, function () {
        });
      };
      
      listings.getBikes = function () {
        api.get('/users/' + $localStorage.userId + "/rides").then(
          function (response) {
            listings.bikes = response.data;
            listings.mirror_bikes = response.data;
          },
          function (error) {
          }
        );
      };

      listings.getBikes();
    }
  ]
});
