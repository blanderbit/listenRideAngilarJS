'use strict';

angular.module('user',[]).component('user', {
  templateUrl: 'app/modules/user/user.template.html',
  controllerAs: 'user',
  controller: ['$localStorage', '$stateParams', '$translate', 'ngMeta', 'api',
    function ProfileController($localStorage, $stateParams, $translate, ngMeta, api) {
      var user = this;
      user.loaded = false;

      var userId;
      $stateParams.userId? userId = $stateParams.userId : userId = 1282;

      api.get('/users/' + userId).then(
        function(response) {
          user.user = response.data;
          user.loaded = true;
          user.rating = (user.user.rating_lister + user.user.rating_rider);
          if (user.user.rating_lister != 0 && user.user.rating_rider != 0) {
            user.rating = user.rating / 2;
          }
          user.rating = Math.round(user.rating);

          $translate(["user.meta-title", "user.meta-description"] , { name: user.user.first_name })
          .then(function(translations) {
            ngMeta.setTitle(translations["user.meta-title"]);
            ngMeta.setTag("description", translations["user.meta-description"]);
          });
        },
        function(error) {
          console.log("Error retrieving User", error);
        }
      );
    }
  ]
});