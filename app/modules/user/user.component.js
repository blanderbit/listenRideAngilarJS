(function(){
'use strict';
angular.module('user',[]).component('user', {
  templateUrl: 'app/modules/user/user.template.html',
  controllerAs: 'user',
  controller: ['$localStorage', '$stateParams', 'api',
    function ProfileController($localStorage, $stateParams, api) {
      var user = this;
      user.loaded = false;

      var userId;
      $stateParams.userId? userId = $stateParams.userId : userId = 1282;

      api.get('/users/' + userId).then(
        function(response) {
          console.log(response.data);
          user.user = response.data;
          user.loaded = true;
          user.rating = (user.user.lister_rating + user.user.rider_rating);
          if (user.user.lister_rating != 0 && user.user.rider_rating != 0) {
            user.rating = user.rating / 2;
          }
          user.rating = Math.round(user.rating);
        },
        function(error) {
          console.log("Error retrieving User", error);
        }
      );
    }
  ]
});
})();