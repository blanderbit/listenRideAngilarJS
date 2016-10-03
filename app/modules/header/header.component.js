'use strict';

angular.module('header').component('header', {
  templateUrl: 'app/modules/header/header.template.html',
  controllerAs: 'header',
  controller: ['$mdSidenav', '$localStorage', 'api', 'authentication', 'verification',
    function HeaderController($mdSidenav, $localStorage, api, authentication, verification) {
      var header = this;
      header.authentication = authentication;
      header.verification = verification;

      if (authentication.loggedIn()) {
        api.get('/users/' + $localStorage.userId).then(
          function (success) {
            header.profilePictureUrl = success.data.profile_picture.profile_picture.url;
          },
          function (error) {

          }
        );
      }

      header.toggleSidebar = function() {
        $mdSidenav('right').toggle();
      }
      
    }
  ]
});