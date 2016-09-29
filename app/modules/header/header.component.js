'use strict';

angular.module('header').component('header', {
  templateUrl: 'app/modules/header/header.template.html',
  controllerAs: 'header',
  controller: ['$mdSidenav', 'authentication', 'verification',
    function HeaderController($mdSidenav, authentication, verification) {
      var header = this;
      header.authentication = authentication;
      header.verification = verification;

      header.toggleSidebar = function() {
        $mdSidenav('right').toggle();
      }
      
    }
  ]
});