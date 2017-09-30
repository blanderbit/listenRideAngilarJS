'use strict';

angular.module('listings').component('listView', {
  templateUrl: 'app/modules/listings/views/list-view.template.html',
  controllerAs: 'listView',
  bindings: {
    bikes: '<'
  },
  controller: [
    '$stateParams',
    '$mdSidenav',
    'api',
    'bikeOptions',
    'orderByFilter', function ($stateParams, $mdSidenav, api, bikeOptions, orderBy) {
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
        console.log($localStorage.userId);
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
          listView.listElementBackground[index] = {'background-color': 'rgba(158, 158, 158, 0.2)'}
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

      listView.editBike = function (event) {
        console.log("$event: ", event);
      };
    }]
});
