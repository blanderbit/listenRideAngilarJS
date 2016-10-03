'use strict';

angular.module('user').component('user', {
  templateUrl: 'app/modules/user/user.template.html',
  controllerAs: 'user',
  controller: ['$localStorage', '$stateParams', 'api',
    function ProfileController($localStorage, $stateParams, api) {
      var user = this;

      api.get('/users/' + $stateParams.userId).then(
        function(response) {
          console.log(response.data);
          user.user = response.data;
        },
        function(error) {
          console.log("Error retrieving User", error);
        }
      );
    }
  ]
});