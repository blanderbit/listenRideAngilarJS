'use strict';

angular.module('autocomplete').component('autocomplete', {
  templateUrl: 'app/modules/shared/autocomplete/autocomplete.template.html',
  controllerAs: 'autocomplete',
  bindings: {
    location: '='
  },
  controller: [
    function AutocompleteController() {
      var autocomplete = this;

      autocomplete.autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocompleteSearch'));
      autocomplete.autocomplete.addListener('place_changed', function() {
        /*
          autocomplete.location = autocomplete.autocomplete.getPlace().formatted_address;
          console.log("getPlace autocomplete.value", autocomplete.location);
          console.log("getPlace lat", autocomplete.autocomplete.getPlace().geometry.location.lat());
          console.log("getPlace lng", autocomplete.autocomplete.getPlace().geometry.location.lng());
        */
      });
    }
  ]
});