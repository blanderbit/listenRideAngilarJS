'use strict';

angular.module('listings').component('listView', {
  templateUrl: 'app/modules/listings/views/list-view.template.html',
  controllerAs: 'listView',
  bindings: {
    bikes: '=',
    mirror: '=',
    removeBike: '<',
    search: '<',
    status: '=',
    duplicating: '='
  },
  controller: [
    '$stateParams',
    '$window',
    '$mdSidenav',
    '$timeout',
    '$filter',
    'api',
    'bikeOptions',
    '$state',
    '$mdDialog',
    '$mdToast',
    '$translate',
    'orderByFilter', function ($stateParams, $window, $mdSidenav, $timeout, $filter, api,
      bikeOptions, $state, $mdDialog, $mdToast, $translate, orderBy) {
      var listView = this;

      listView.$onInit = function () {
        listView.selected = [];
        listView.hovered = [];
        listView.visibility = [];
        listView.listElementBackground = [];
        listView.selectedCount = 0;
        listView.propertyName = 'name';
        listView.reverse = true;
      };

      listView.toggleSidenav = function () {
        $mdSidenav('edit').toggle();
      };

      // bike checkbox is selected
      listView.onBikeSelected = function (index) {
        if (listView.selected[index]) {
          // clear the hover status of the item
          listView.hovered = [];
          // hide the action buttons for the item
          listView.visibility[index] = false;
          // set background for the item
          listView.listElementBackground[index] = {'background-color': 'rgba(206, 206, 206, 0.2)'}
        } else {
          listView.listElementBackground = [];
        }
      };

      // check if a bike checkbox is selected
      listView.isBikeSelected = function (threshold) {
        if (listView.selected.filter(function (isTrue) {
            return isTrue;
          }).length > threshold) {
          return true;
        }
      };

      listView.order = function (propertyName) {
        listView.reverse = (propertyName !== null && listView.propertyName === propertyName) ? !listView.reverse : false;
        listView.propertyName = propertyName;
        listView.bikes = orderBy(listView.bikes, listView.propertyName, listView.reverse);
      };

      //
      listView.onBikeHovered = function (index, value) {
        if (!listView.isBikeSelected(0)) {
          listView.hovered[index] = value;
          // used in place of ng-show
          // using visibility instead of display for hiding/showing the elements
          listView.visibility[index] = value === true ? {'visibility': 'visible'} : {'visibility': 'hidden'};
        }
      };

      listView.cancelEvent = function (event) {
        if (event.stopPropogation) event.stopPropogation();
      };


      listView.viewBike = function(id, event){

        // stop event from propograting
        if (event.stopPropogation) event.stopPropogation();

        // create url
        var url = $state.href('bike', {bikeId: id});
        // open new tab
        window.open(url, '_blank');
      };

      listView.viewBikes = function (id, event) {
        // stop event from propograting
        if (event.stopPropogation) event.stopPropogation();
      };

      listView.editBike = function(id) {
        // create url
        var url = $state.href('edit', {bikeId: id});
        // open new tab
        window.open(url);
      };

      listView.onDeactivateClick = function(index) {
        listView.disableDeactivate = true;
        api.put("/rides/" + listView.bikes[index].id, {"ride": {"available": !listView.bikes[index].available}}).then(
          function() {
            listView.bikes[index].available = !listView.bikes[index].available;
          },
          function() {
            listView.disableDeactivate = false;
          }
        );
      };

      var DeleteBikeController = function(deleteBike, bikeId) {
        var deleteBikeDialog = this;

        deleteBikeDialog.hide = function() {
          $mdDialog.hide();
        };

        deleteBikeDialog.deleteBike = function() {
          deleteBike(bikeId);
          $mdDialog.hide();
        }
      };

      listView.onDeleteClick = function(id, event) {
        $mdDialog.show({
          controller: DeleteBikeController,
          controllerAs: 'deleteBikeDialog',
          templateUrl: 'app/modules/shared/listing-card/delete-bike-dialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          locals: {
            deleteBike: deleteBike,
            bikeId: id
          }
        });
      };

      function deleteBike(id) {
        api.delete("/rides/" + id).then(
          function(response) {
            listView.mirror = response.data;
            listView.bikes = $filter('filter')(response.data,{$ : listView.search});
            $analytics.eventTrack('List a Bike', {  category: 'List Bike', label: 'Bike Removed'});
          },
          function(error) {
            $mdToast.show(
              $mdToast.simple()
                .textContent($translate.instant('toasts.pending-requests'))
                .hideDelay(4000)
                .position('top center')
            );
          }
        );
      };

      listView.openUrl = function () {
        var url = $state.href('listingABike', {parameter: "parameter"});
        window.open(url);
      };

      var DuplicateBikeController = function() {
        var duplicate = this;
        duplicate.duplicate_number = 1;

        // cancel the dialog
        duplicate.cancelDialog = function() {
          $mdDialog.cancel();
        };

        // close the dialog succesfully
        duplicate.closeDialog = function () {
          $mdDialog.hide(parseInt(duplicate.duplicate_number));
        };
      };

      listView.duplicateBike = function (bike, event) {
        $mdDialog.show({
          templateUrl: 'app/modules/listings/views/list-view.duplicate.template.html',
          controller: DuplicateBikeController,
          controllerAs: 'duplicate',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          escapeToClose: true,
          fullscreen: true
        }).then(function (duplicate_number) {
          api.post('/rides/' + bike.id + '/duplicate', {
            "quantity": duplicate_number
          }).then(function (response) {
            var job_id = response.data.job_id;
            listView.getStatus(bike, job_id, 'initialized');
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
        }, function () {
        });
      };

      listView.getStatus = function (bike, jobId, status) {
        listView.duplicating = true;
        api.get('/rides/' + bike.id + '/status/' + jobId).then(function (response) {
          listView.status = response.data.status;
          if(listView.status !== 'complete') {
            $timeout(function() { listView.getStatus(bike, jobId, listView.status); }, 5000);
          } else if(listView.status === 'complete') {
            listView.duplicating = false;
            $mdToast.show(
              $mdToast.simple()
                .textContent($translate.instant('toasts.duplicate-finish'))
                .hideDelay(4000)
                .position('top center')
            );
          }
        }, function (error) {
          $mdToast.show(
            $mdToast.simple()
              .textContent($translate.instant('toasts.error'))
              .hideDelay(4000)
              .position('top center')
          );
        });
      }
    }]
});
