'use strict';

angular.module('home',[]).component('home', {
  templateUrl: 'app/modules/home/home.template.html',
  controllerAs: 'home',
  controller: [ '$state', '$translate', 'api', 'ngMeta',
    function HomeController($state, $translate, api, ngMeta) {
      var home = this;

      ngMeta.setTitle($translate.instant("home.meta-title"));
      ngMeta.setTag("description", $translate.instant("home.meta-description"));

      api.get("/featured").then(function(response) {
        home.featuredBikes = response.data.slice(0,6);
      });

      home.placeChanged = function(place) {
        var location = place.formatted_address || place.name;
        $state.go('search', {location: location});
      };

      home.onSearchClick = function() {
        $state.go('search', {location: home.location});
      };
    }
  ]
});