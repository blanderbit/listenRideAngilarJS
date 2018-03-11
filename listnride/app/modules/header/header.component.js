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
      header.showSearch = false;

      var toggleSearchbar = function(stateName) {
        if (stateName === "home" || stateName === "search") {
          header.showSearch = true;
        } else {
          header.showSearch = true;
        }
      }

      toggleSearchbar($state.current.name);

      $transitions.onSuccess({}, function(transition) {
        toggleSearchbar(transition.to().name);
      });

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