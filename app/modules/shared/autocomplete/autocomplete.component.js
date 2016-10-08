'use strict';

angular.module('autocomplete').component('autocomplete', {
  templateUrl: 'app/modules/shared/autocomplete/autocomplete.template.html',
  controllerAs: 'autocomplete',
  bindings: {
    location: '=',
    labelId: '@',
    required: '@',
    fillAddress: '&'
  },
  controller: ['$interval', '$scope',
    function AutocompleteController($interval, $scope) {
      var autocomplete = this;

      initAutocomplete();

      function initAutocomplete() {
        var autocompleteObject = new google.maps.places.Autocomplete(document.getElementById('autocompleteSearch'), {types: ['address']});
        autocompleteObject.addListener('place_changed', function() {
          $scope.$apply(function() {
            if (autocomplete.fillAddress !== undefined) {
              autocomplete.fillAddress({place: autocompleteObject.getPlace()});
            }
          });
        });

        if (autocomplete.required == "true") {
          document.getElementById("autocompleteSearch").required = true;
        }

        var timer = $interval(function() {
          if ($(".pac-container").length > 0) {
            var el = $(".pac-container").detach();
            el.appendTo("autocomplete");
            $interval.cancel(timer);
          }
        }, 100);
      }
      
      /*
        autocomplete.location = autocomplete.autocomplete.getPlace().formatted_address;
        console.log("getPlace autocomplete.value", autocomplete.location);
        console.log("getPlace lat", autocomplete.autocomplete.getPlace().geometry.location.lat());
        console.log("getPlace lng", autocomplete.autocomplete.getPlace().geometry.location.lng());
      */
    }
  ]
});