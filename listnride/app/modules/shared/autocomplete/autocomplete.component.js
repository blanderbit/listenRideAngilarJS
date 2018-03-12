'use strict';

angular.module('autocomplete',[]).component('autocomplete', {
  templateUrl: 'app/modules/shared/autocomplete/autocomplete.template.html',
  controllerAs: 'autocomplete',
  bindings: {
    autocompleteId: '@',
    location: '=',
    labelId: '@',
    placeholderId: '@',
    required: '<',
    name: '@',
    error: '=',
    placeChanged: '&'
  },
  controller: ['$interval', '$scope',
    function AutocompleteController($interval, $scope) {
      var autocomplete = this;
      console.log(autocomplete.autocompleteId);

      var deregisterAutocompleteWatcher = $scope.$watch(
        function () {
          return document.getElementById(autocomplete.autocompleteId);
        },
        function(newValue) {
          if (newValue) {
            deregisterAutocompleteWatcher();

            var autocompleteObject = new google.maps.places.Autocomplete(
              document.getElementById(autocomplete.autocompleteId), {types: ['geocode']});

            autocompleteObject.inputId = autocomplete.autocompleteId;
            autocompleteObject.addListener('place_changed', function() {
              $scope.$apply(function() {
                var response = autocompleteObject.getPlace();
                if (autocomplete.placeChanged !== undefined) {
                  autocomplete.placeChanged({place: response});
                }
              });
            });
          }
        }
      );

      autocomplete.showResults = function() {
        if ($(".pac-container").length > 0) {
          var el = $(".pac-container").detach();
          var acClass = "." + autocomplete.autocompleteId;
          el.appendTo($(acClass));
        }
      };

      // TODO: Switch to watcher
      // var timer = $interval(function() {
      //   if ($(".pac-container").length > 0) {
      //     var el = $(".pac-container").detach();
      //     var acClass = "." + autocomplete.autocompleteId;
      //     console.log(acClass);
      //     console.log($(acClass));
      //     el.appendTo($(acClass));
      //     $interval.cancel(timer);
      //   }
      // }, 100);
    }
  ]
});
