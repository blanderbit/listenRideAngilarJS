'use strict';

angular.module('inviteLanding',[]).component('inviteLanding', {
  templateUrl: 'app/modules/invite-landing/invite-landing.template.html',
  controllerAs: 'inviteLanding',
  controller: [ '$stateParams', 'authentication',
    function InviteLandingController($stateParams, authentication) {
      var inviteLanding = this;

      inviteLanding.authentication = authentication;
      inviteLanding.inviteCode = $stateParams.inviteCode;

      inviteLanding.showSignup = function() {
        authentication.showSignupDialog(inviteCode);
      }

    }
  ]
});