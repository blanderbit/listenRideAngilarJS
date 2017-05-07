'use strict';

angular.module('invite',[]).component('invite', {
  templateUrl: 'app/modules/invite/invite.template.html',
  controllerAs: 'invite',
  controller: ['api', '$localStorage', 
    function InviteController(api, $localStorage) {
      console.log("hi", invite);
      var invite = this;
      invite.inviteUrl = "http://www.listnride.com/invitation/amrXXX69";

      invite.onCopyButtonClick = function() {

      };

      api.get("/users/" + $localStorage.userId + "/overview ").then(function(response) {
        invite.invitedFriends = response.data;
        invite.totalCredit = invite.invitedFriends.filter(function(invitation) {return invitation.status}).length * 10;
        console.log("invite.invitedFriends", invite.invitedFriends, invite.totalCredit);
      });

/*      ngMeta.setTitle($translate.instant("home.meta-title"));
      ngMeta.setTag("description", $translate.instant("home.meta-description"));

      api.get("/featured").then(function(response) {
        home.featuredBikes = response.data.slice(0,6);
      });*/
    }
  ]
});
