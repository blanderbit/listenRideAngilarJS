'use strict';

angular.module('inviteLanding',[]).component('inviteLanding', {
  templateUrl: 'app/modules/invite-landing/invite-landing.template.html',
  controllerAs: 'inviteLanding',
  controller: [ '$stateParams', '$state', '$translate', 'authentication', 'api',
    function InviteLandingController($stateParams, $state, $translate, authentication, api, referrer) {
      var inviteLanding = this;

      inviteLanding.hidden = true;
      inviteLanding.authentication = authentication;
      inviteLanding.inviteCode = $stateParams.inviteCode;

      api.get('/referrals/' + inviteLanding.inviteCode).then(
        function (success) {
          inviteLanding.referrer = success.data;
          inviteLanding.picture = inviteLanding.referrer.profile_picture.profile_picture.url;
          inviteLanding.subsubsubheader = $translate.instant("invite-landing.subsubsubheader", {name: success.data.first_name})
          inviteLanding.hidden = false;
        },
        function (error) {
          $state.go("404");
        }
      );

      inviteLanding.showSignup = function() {
        authentication.showSignupDialog(inviteCode);
      }
    }
  ]
});
