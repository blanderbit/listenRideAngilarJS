'use strict';

angular.module('home').component('home', {
  templateUrl: 'modules/home/home.template.html',
  controllerAs: 'home',
  controller: [ 'api', '$state', 'uiGmapGoogleMapApi',
    function HomeController(api, $state, uiGmapGoogleMapApi) {
      var home = this;

      uiGmapGoogleMapApi.then(function(maps) {
        var autocomplete = new google.maps.places.Autocomplete(document.getElementById('searchBox'));
      });

      api.get("/featured").then(function(response) {
        home.featuredBikes = response.data;
      });

      home.onSearch = function() {
        $state.go('search', {location: document.getElementById('searchBox').value});
      };
    }
  ]
});