'use strict';

angular.module('header').component('header', {
  templateUrl: 'app/modules/header/header.template.html',
  controllerAs: 'header',
  controller: ['$mdSidenav', '$localStorage', 'api', 'authentication', 'verification',
    function HeaderController($mdSidenav, $localStorage, api, authentication, verification) {
      var header = this;
      header.authentication = authentication;
      header.verification = verification;
      header.profilePicture = $localStorage.profilePicture;
      header.name = $localStorage.name;
      header.userId = $localStorage.userId;

      if ($localStorage.newUser) {
        verification.openDialog();
        delete $localStorage.newUser;
      }

      // if (authentication.loggedIn()) {
      //   console.log("reloading header");
      //   api.get('/users/' + $localStorage.userId).then(
      //     function (success) {
      //       header.user = success.data;
      //     },
      //     function (error) {

      //     }
      //   );
      // }

      header.toggleSidebar = function() {
        $mdSidenav('right').toggle();
      }
      
    }
  ]
});