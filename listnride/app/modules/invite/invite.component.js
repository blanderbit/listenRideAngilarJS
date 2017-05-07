'use strict';

angular.module('invite',[]).component('invite', {
  templateUrl: 'app/modules/invite/invite.template.html',
  controllerAs: 'invite',
  controller: ['api', '$localStorage', 
    function InviteController(api, $localStorage) {
      var invite = this;
      invite.inviteUrl = "http://www.listnride.com/invitation/amrXXX69";

      invite.onCopyButtonClick = function() {
        document.getElementById("linkContainer").select();
        document.execCommand('copy');
      };

      api.get("/users/" + $localStorage.userId + "/overview ").then(function(response) {
        invite.invitedFriends = response.data;
        invite.totalCredit = invite.invitedFriends.filter(function(invitation) {return invitation.status}).length * 10;
        console.log("invite.invitedFriends", invite.invitedFriends, invite.totalCredit);
      });
    }
  ]
});
