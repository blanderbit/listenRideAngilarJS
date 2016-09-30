'use strict';

angular.module('user').component('user', {
  templateUrl: 'app/modules/user/user.template.html',
  controllerAs: 'user',
  controller: ['api',
    function ProfileController(api) {
      var user = this;

      api.get('/users/1001').then(function success() {
        console.log("Successfully retrieved User");
      }, function error() {
        console.log("Error retrieving User");
      })
    }
  ]
});