'use strict';

angular.module('home').component('home', {
  templateUrl: 'modules/home/home.template.html',
  controllerAs: 'home',
  controller: [ 'api', '$state',
    function HomeController(api, $state) {
      var home = this;

      api.get("/featured").then(function(response) {
        home.featuredBikes = response.data;
      });

      home.searchQuery;
      home.onSearch = function() {
        $state.go('search', {location: home.searchQuery});
      };
    }
  ]
});