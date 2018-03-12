'use strict';

angular.module('header',[]).component('header', {
  templateUrl: 'app/modules/header/header.template.html',
  controllerAs: 'header',
  controller: ['$transitions', '$state', '$mdSidenav', '$localStorage', '$stateParams', 'api', 'authentication', 'verification',
    function HeaderController($transitions, $state, $mdSidenav, $localStorage, $stateParams, api, authentication, verification) {
      var header = this;
      header.authentication = authentication;
      header.verification = verification;
      header.name = $localStorage.name;
      header.userId = $localStorage.userId;
      header.inviteCode = $stateParams.inviteCode
      // Contains the amount of unread messages to be displayed in the header
      header.unreadMessages = $localStorage.unreadMessages;

      $transitions.onSuccess({}, function(transition) {
        if (transition.to().name === "search") {
          header.location = $stateParams.location;
        }
      });

      header.search = function(place) {
        var location = place.formatted_address || place.name;
        $state.go('search', {location: location});
      };

      header.toggleSidebar = function() {
        $mdSidenav('right').toggle();
      }
      
    }
  ]
});