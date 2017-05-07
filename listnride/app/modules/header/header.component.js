'use strict';

angular.module('header',[]).component('header', {
  templateUrl: 'app/modules/header/header.template.html',
  controllerAs: 'header',
  controller: ['$mdSidenav', '$localStorage', '$stateParams', 'api', 'authentication', 'verification',
    function HeaderController($mdSidenav, $localStorage, $stateParams, api, authentication, verification) {
      var header = this;
      header.authentication = authentication;
      header.verification = verification;
      header.name = $localStorage.name;
      header.userId = $localStorage.userId;
      header.inviteCode = $stateParams.inviteCode
      // Contains the amount of unread messages to be displayed in the header
      header.unreadMessages = $localStorage.unreadMessages;

      header.toggleSidebar = function() {
        $mdSidenav('right').toggle();
      }
      
    }
  ]
});