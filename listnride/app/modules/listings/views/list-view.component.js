'use strict';

angular.module('listings').component('listView', {
  templateUrl: 'app/modules/listings/views/list-view.template.html',
  controllerAs: 'listView',
  bindings: {
    bikes: '<',
    status: '=',
    isDuplicating: '=',
    getBikes: '<',
    duplicate: '<'
  },
  controller: [
    '$localStorage',
    '$stateParams',
    '$analytics',
    '$window',
    '$timeout',
    'api',
    'bikeOptions',
    '$state',
    '$mdDialog',
    '$mdToast',
    '$translate',
    'orderByFilter', function ($localStorage, $stateParams, $analytics, $window, $timeout, api,
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

      listView.viewBike = function(id, event){

        // stop event from propograting
        if (event.stopPropogation) event.stopPropogation();

        // create url
        var url = $state.href('bike', {bikeId: id});
        // open new tab
        window.open(url, '_blank');
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
        api.put("/rides/" + id, {"ride": {"active": "false"}}).then(
          function(response) {
            listView.bikes = response.data;
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
      }

      listView.openUrl = function () {
        var url = $state.href('listingABike', {parameter: "parameter"});
        window.open(url);
      };
    }]
});