angular.module('bikeListView', []).component('bikeListView', {
  templateUrl: 'app/modules/bike/list-view/list-view.template.html',
  controllerAs: 'list',
  controller: ['$stateParams',
    'api',
    'bikeOptions',
    'orderByFilter', function ($stateParams, api, bikeOptions, orderBy) {
      var list = this;

      api.get('/rides/').then(
        function (response) {
          list.bikes = response.data.slice(10, 20);
          list.selected = [];
          list.hovered = [];
          list.visibility = [];
          list.listElementBackground = [];
          list.selectedCount = 0;
          list.propertyName = 'name';
          list.reverse = true;
        },
        function (error) {
          console.log("Error editing bike", error);
        }
      );

      // bike checkbox is selected
      list.onBikeSelected = function (index) {
        if (list.selected[index]) {
          // clear the hover status of the item
          list.hovered = [];
          // hide the action buttons for the item
          list.visibility[index] = false;
          // set background for the item
          list.listElementBackground[index] = {'background-color': 'rgba(158, 158, 158, 0.2)'}
        } else {
          list.listElementBackground = [];
        }
      };

      // check if a bike checkbox is selected
      list.isBikeSelected = function (threshold) {
        if (list.selected.filter(function (isTrue) {
            return isTrue;
          }).length > threshold) {
          return true;
        }
      };

      list.order = function (propertyName) {
        list.reverse = (propertyName !== null && list.propertyName === propertyName) ? !list.reverse : false;
        list.propertyName = propertyName;
        list.bikes = orderBy(list.bikes, list.propertyName, list.reverse);
      };

      //
      list.onBikeHovered = function (index, value) {
        if (!list.isBikeSelected(0)) {
          list.hovered[index] = value;
          // used in place of ng-show
          // using visibility instead of display for hiding/showing the elements
          list.visibility[index] = value === true ? {'visibility': 'visible'} : {'visibility': 'hidden'};
        }
      };

      list.editBike = function (event) {
        console.log("$event: ", event);
      };
    }]
});