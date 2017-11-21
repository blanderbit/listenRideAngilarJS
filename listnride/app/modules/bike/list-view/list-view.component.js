angular.module('bikeListView', []).component('bikeListView', {
  templateUrl: 'app/modules/bike/lis-view/lis-view.template.html',
  controllerAs: 'lis',
  controller: ['$stateParams',
    'api',
    'bikeOptions',
    'orderByFilter', function ($stateParams, api, bikeOptions, orderBy) {
      var lis = this;

      api.get('/rides/').then(
        function (response) {
          lis.bikes = response.data.slice(10, 20);
          lis.selected = [];
          lis.hovered = [];
          lis.visibility = [];
          lis.listElementBackground = [];
          lis.selectedCount = 0;
          lis.propertyName = 'name';
          lis.reverse = true;
        },
        function (error) {
          console.log("Error editing bike", error);
        }
      );

      // bike checkbox is selected
      lis.onBikeSelected = function (index) {
        if (lis.selected[index]) {
          // clear the hover status of the item
          lis.hovered = [];
          // hide the action buttons for the item
          lis.visibility[index] = false;
          // set background for the item
          lis.listElementBackground[index] = {'background-color': 'rgba(158, 158, 158, 0.2)'}
        } else {
          lis.listElementBackground = [];
        }
      };

      // check if a bike checkbox is selected
      lis.isBikeSelected = function (threshold) {
        if (lis.selected.filter(function (isTrue) {
            return isTrue;
          }).length > threshold) {
          return true;
        }
      };

      lis.order = function (propertyName) {
        lis.reverse = (propertyName !== null && lis.propertyName === propertyName) ? !lis.reverse : false;
        lis.propertyName = propertyName;
        lis.bikes = orderBy(lis.bikes, lis.propertyName, lis.reverse);
      };

      //
      lis.onBikeHovered = function (index, value) {
        if (!lis.isBikeSelected(0)) {
          lis.hovered[index] = value;
          // used in place of ng-show
          // using visibility instead of display for hiding/showing the elements
          lis.visibility[index] = value === true ? {'visibility': 'visible'} : {'visibility': 'hidden'};
        }
      };

      lis.editBike = function (event) {
        console.log("$event: ", event);
      };
    }]
});
