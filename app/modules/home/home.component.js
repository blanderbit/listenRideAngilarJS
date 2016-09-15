'use strict';

angular.
module('home').
component('home', {
  templateUrl: 'modules/home/home.template.html',
  controllerAs: 'home',
  controller: [ 'api',
    function HomeController(api) {
      var home = this;
    }
  ]
});