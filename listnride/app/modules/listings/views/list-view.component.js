'use strict';

angular.module('listings').component('listView', {
  templateUrl: 'app/modules/listings/views/list-view.template.html',
  controllerAs: 'listView',
  bindings: {
    bikes: '<',
    status: '=',
    isDuplicating: '=',
    edit: '<',
    view: '<',
    duplicate: '<',
    delete: '<',
    deactivate: '<',
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

      // order the bikes with the selected criteria (price, size, name, id ....)
      listView.order = function (propertyName) {
        listView.reverse = (propertyName !== null && listView.propertyName === propertyName) ? !listView.reverse : false;
        listView.propertyName = propertyName;
        listView.bikes = orderBy(listView.bikes, listView.propertyName, listView.reverse);
      };

    }]
});