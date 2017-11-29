'use strict';

angular.module('listings', []).component('listings', {
  templateUrl: 'app/modules/listings/listings.template.html',
  controllerAs: 'listings',
  controller: ['$scope',
    '$mdDialog',
    '$analytics',
    '$timeout',
    '$mdToast',
    '$filter',
    '$translate',
    '$state',
    '$localStorage',
    '$mdMedia',
    'api',
    'accessControl',
    function ListingsController($scope, $mdDialog, $analytics, $timeout, $mdToast, $filter, $translate, $state, $localStorage, $mdMedia, api, accessControl) {
      if (accessControl.requireLogin()) {
        return
      }
      var listings = this;

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

      // local method containing logic for bike deletion
      function deleteHelper(id) {
        api.put("/rides/" + id, { "ride": { "active": "false" } }).then(
          function (response) {
            listings.bikes = response.data;
            $mdToast.show(
              $mdToast.simple()
                .textContent($translate.instant('toasts.bike-deleted'))
                .hideDelay(4000)
                .position('top center')
            );
            $analytics.eventTrack('List a Bike', { category: 'List Bike', label: 'Bike Removed' });
          },
          function (error) {
            $mdToast.show(
              $mdToast.simple()
                .textContent($translate.instant('toasts.pending-requests'))
                .hideDelay(4000)
                .position('top center')
            );
          }
        );
      }

      // local method to be used as delete controller
      function DeleteController(deleteHelper, bikeId) {
        var deleteBikeDialog = this;

        deleteBikeDialog.hide = function () {
          $mdDialog.hide();
        };

        deleteBikeDialog.deleteBike = function () {
          deleteHelper(bikeId);
          $mdDialog.hide();
        }
      }

      listings.maxTiles = 12;
      listings.status = '';
      listings.isDuplicating = false;

      listings.search = function () {
        listings.bikes = $filter('filter')(listings.mirror_bikes, { $: listings.input });
      };

      listings.listBike = function () {
        $state.go('list');
      };

      listings.removeBike = function (bikeId) {
        listings.bikes = listings.bikes.filter(function (bike) {
          return parseInt(bike.id) !== bikeId;
        })
      };

      listings.getStatus = function (bike, jobId) {
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

      listings.delete = function (id, event) {
        $mdDialog.show({
          controller: DeleteController,
          controllerAs: 'deleteBikeDialog',
          templateUrl: 'app/modules/shared/listing-card/delete-bike-dialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          locals: {
            deleteHelper: deleteHelper,
            bikeId: id
          }
        });
      };

      listings.deactivate = function (index) {
        var id = listings.bikes[index].id;
        listings.deactivated = true;
        api.put("/rides/" + id, { "ride": { "available": !listings.bikes[index].available } }).then(
          function () {
            listings.bikes[index].available = !listings.bikes[index].available;
          },
          function () {
            listings.deactivated = false;
          }
        );
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

      listings.edit = function (id) {
        $state.go('edit', { bikeId: id });
      };

      listings.view = function(id, event){
        // stop event from propograting
        if (event && event.stopPropogation) event.stopPropogation();
        // sref
        $state.go('bike', {bikeId: id});
      };

      listings.getBikes();
    }
  ]
});
