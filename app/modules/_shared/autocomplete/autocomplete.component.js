'use strict';

angular.module('autocomplete').component('autocomplete', {
  templateUrl: 'app/modules/_shared/autocomplete/autocomplete.template.html',
  controllerAs: 'autocomplete',
  bindings: {
    value: '<'
  },
  controller: ['$state',
    function AutocompleteController($state) {
      var autocomplete = this;

      autocomplete.autocomplete = new google.maps.places.Autocomplete(document.getElementById('searchBox'));

      autocomplete.onSearch = function() {
        $state.go('search', {location: document.getElementById('searchBox').value});
      };
    }
  ]
});