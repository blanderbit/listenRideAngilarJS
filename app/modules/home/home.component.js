'use strict';

angular.module('home').component('home', {
  templateUrl: 'app/modules/home/home.template.html',
  controllerAs: 'home',
  controller: [ '$state', 'api',
    function HomeController($state, api) {
      var home = this;

      api.get("/featured").then(function(response) {
        home.featuredBikes = response.data.slice(0,6);
      });

      home.onSearch = function() {
        // TODO: This is coding excrement.
        // use the angular way to do things.
        // fix the google autocomplete and all will work.
        var myLocation = document.querySelector("#home.autocompleteSearch").value;
        $state.go('search', {location: myLocation});
      };
    }
  ]
});