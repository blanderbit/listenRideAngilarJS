'use strict';

angular.module('autocomplete').component('autocomplete', {
  templateUrl: 'modules/_shared/autocomplete/autocomplete.template.html',
  controllerAs: 'autocomplete',
  bindings: {
    value: '<'
  },
  controller: ['uiGmapGoogleMapApi', '$state',
    function AutocompleteController(uiGmapGoogleMapApi, $state) {
      var autocomplete = this;

      uiGmapGoogleMapApi.then(function(maps) {
        var autocomplete = new google.maps.places.Autocomplete(document.getElementById('searchBox'));
      });

      autocomplete.onSearch = function() {
        $state.go('search', {location: document.getElementById('searchBox').value});
      };
    }
  ]
});