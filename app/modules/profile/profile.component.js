'use strict';

angular.module('profile').component('profile', {
  templateUrl: 'app/modules/profile/profile.template.html',
  controllerAs: 'profile',
  controller: ['api',
    function ProfileController(api) {
      var profile = this;

      api.get('/users/1001').then(function success() {
        console.log("Successfully retrieved User");
      }, function error() {
        console.log("Error retrieving User");
      })
    }
  ]
});