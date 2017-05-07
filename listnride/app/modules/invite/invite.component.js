'use strict';

angular.module('invite',[]).component('invite', {
  templateUrl: 'app/modules/invite/invite.template.html',
  controllerAs: 'invite',
  controller: ['api', '$localStorage', '$translate', 
    function InviteController(api, $localStorage, $translate) {
      var invite = this;
      invite.inviteUrl = "http://www.listnride.com/invitation/amrXXX69";

      invite.copyToClipboard = function() {
        document.getElementById("linkContainer").select();
        document.execCommand('copy');
      };

      invite.shareThroughFacebook = function() {

      };

      invite.shareThroughEmail = function() {
        var userFullName = $localStorage.name;
        var voucherUrl = invite.inviteUrl;
        $translate(
          ["invite.share.email-subject", "invite.share.email-body"],
          {full_name: userFullName, voucher_url: voucherUrl})
          .then(function (translations) {
            var subject = translations["invite.share.email-subject"];
            var body = translations["invite.share.email-body"];
            window.open("mailto:" + "?subject=" + subject + "&body=" + body, "_self");
          })
      };   

      api.get("/users/" + $localStorage.userId + "/overview ").then(function(response) {
        invite.invitedFriends = response.data;
        var activeFriends = invite.invitedFriends.filter(function(invitation) {return invitation.status});
        invite.totalCredit = activeFriends.length * 10;
      });
    }
  ]
});
