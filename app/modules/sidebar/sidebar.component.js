'use strict';

angular.module('header').component('sidebar', {
  templateUrl: 'app/modules/sidebar/sidebar.template.html',
  controllerAs: 'sidebar',
  controller: ['$mdSidenav', 'authentication',
    function SidebarController($mdSidenav, authentication) {
      var sidebar = this;
      sidebar.authentication = authentication;
      sidebar.toggle = function() {
        $mdSidenav('right').toggle();
      };
    }
  ]
});