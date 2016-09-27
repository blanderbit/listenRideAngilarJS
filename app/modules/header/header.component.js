'use strict';

angular.module('header').component('header', {
  templateUrl: 'app/modules/header/header.template.html',
  controllerAs: 'header',
  controller: ['$mdSidenav', 'authentication',
    function HeaderController($mdSidenav, authentication) {
      var header = this;
      header.authentication = authentication;

      header.toggleSidebar = function() {
        $mdSidenav('right').toggle();
      }
      
    }
  ]
});