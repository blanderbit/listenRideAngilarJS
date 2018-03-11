'use strict';

angular.module('header',[]).component('header', {
  templateUrl: 'app/modules/header/header.template.html',
  controllerAs: 'header',
  controller: ['$rootScope', '$state', '$mdSidenav', '$localStorage', '$stateParams', 'api', 'authentication', 'verification',
    function HeaderController($rootScope, $state, $mdSidenav, $localStorage, $stateParams, api, authentication, verification) {
      var header = this;
      header.authentication = authentication;
      header.verification = verification;
      header.name = $localStorage.name;
      header.userId = $localStorage.userId;
      header.inviteCode = $stateParams.inviteCode
      // Contains the amount of unread messages to be displayed in the header
      header.unreadMessages = $localStorage.unreadMessages;
      header.showSearch = false;

      // Unfortunately UIRouter requires rootScope to watch state changes
      $rootScope.$on(
        '$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams, options) {
          console.log("fired");
          if ($state.current.name !== "home") {
            header.showSearch = true;
          } else {
            header.showSearch = false;
          }
        }
      );

      header.toggleSidebar = function() {
        $mdSidenav('right').toggle();
      }

      header.search = function(place) {
        var location = place.formatted_address || place.name;
        $state.go('search', {location: location});
      };
      
    }
  ]
});