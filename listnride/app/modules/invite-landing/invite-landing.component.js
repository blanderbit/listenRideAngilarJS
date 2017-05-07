'use strict';

angular.module('inviteLanding',[]).component('inviteLanding', {
  templateUrl: 'app/modules/invite-landing/invite-landing.template.html',
  controllerAs: 'inviteLanding',
  controller: [ '$stateParams', '$state', 'authentication', 'api',
    function InviteLandingController($stateParams, $state, authentication, api) {
      var inviteLanding = this;

      inviteLanding.authentication = authentication;
      inviteLanding.inviteCode = $stateParams.inviteCode;
      inviteLanding.referrer = "";

      api.get('/referrals/' + inviteLanding.inviteCode).then(
        function (success) {
          inviteLanding.referrer = success.data.first_name
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