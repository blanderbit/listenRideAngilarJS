'use strict';

angular.module('inviteLanding',[]).component('inviteLanding', {
  templateUrl: 'app/modules/invite-landing/invite-landing.template.html',
  controllerAs: 'inviteLanding',
  controller: [ '$stateParams', '$state', 'authentication', 'api',
    function InviteLandingController($stateParams, $state, authentication, api, referrer) {
      var inviteLanding = this;

      inviteLanding.hidden = true;
      inviteLanding.authentication = authentication;
      inviteLanding.inviteCode = $stateParams.inviteCode;

      api.get('/referrals/' + inviteLanding.inviteCode).then(
        function (success) {
          inviteLanding.referrer = success.data;
          console.log(inviteLanding.referrer);
          inviteLanding.picture = inviteLanding.referrer.profile_picture.profile_picture.url;
          console.log(inviteLanding.picture);
          inviteLanding.hidden = false;
        },
        function (error) {
          $state.go("404");
          console.log("an error happened ERR");
        }
      );

      inviteLanding.showSignup = function() {
        authentication.showSignupDialog(inviteCode);
      }

    }
  ]
});