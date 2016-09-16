'use strict';

angular.module('profile').component('profile', {
  templateUrl: 'modules/profile/profile.template.html',
  controllerAs: 'profile',
  controller: ['api',
    function ProfileController(api) {
      var profile = this;

      api.get('/users/1').then(function success() {

      }, function error() {

      })
    }
  ]
});