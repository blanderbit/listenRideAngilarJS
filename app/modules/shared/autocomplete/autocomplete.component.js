'use strict';

angular.module('autocomplete').component('autocomplete', {
  templateUrl: 'app/modules/shared/autocomplete/autocomplete.template.html',
  controllerAs: 'autocomplete',
  bindings: {
    autocompleteId: '@',
    location: '=',
    labelId: '@',
    placeholderId: '@',
    required: '@',
    fillAddress: '&'
  },
  controller: ['$interval', '$scope', '$timeout',
    function AutocompleteController($interval, $scope, $timeout) {
      var autocomplete = this;

      var deregisterWatcher = $scope.$watch(function () {
        return document.getElementById(autocomplete.autocompleteId);
      }, function(newValue) {
        if (newValue) {
          deregisterWatcher();

          var autocompleteObject = new google.maps.places.Autocomplete(document.getElementById(autocomplete.autocompleteId), {types: ['geocode']});
          autocompleteObject.addListener('place_changed', function() {
            $scope.$apply(function() {
              if (autocomplete.fillAddress !== undefined) {
                autocomplete.fillAddress({place: autocompleteObject.getPlace()});
              }
            });
          });

        }
      });

      // TODO: Switch to watcher
      var timer = $interval(function() {
        if ($(".pac-container").length > 0) {
          var el = $(".pac-container").detach();
          el.appendTo("autocomplete");
          $interval.cancel(timer);
        }
      }, 100);
    }
  ]
});