'use strict';

angular.module('header').component('sidebar', {
  templateUrl: 'modules/sidebar/sidebar.template.html',
  controllerAs: 'sidebar',
  controller: ['authentication',
    function SidebarController(authentication) {
      var sidebar = this;
      sidebar.authentication = authentication;
    }
  ]
});