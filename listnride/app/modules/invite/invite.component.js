'use strict';

angular.module('invite',[]).component('invite', {
  templateUrl: 'app/modules/invite/invite.template.html',
  controllerAs: 'invite',
  controller: ['api', '$localStorage', '$translate', 'Socialshare',
    function InviteController(api, $localStorage, $translate, Socialshare) {
      var invite = this;
      invite.inviteUrl = api.getWebappUrl() + "/" + $localStorage.referenceCode;

      invite.copyToClipboard = function() {
        document.getElementById("linkContainer").select();
        document.execCommand('copy');
      };

      invite.shareThroughFacebook = function() {
        Socialshare.share({
          'provider': 'facebook',
          'attrs': {
            'socialshareUrl': invite.inviteUrl,
          }
        });
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
        console.log(response.data);
        var activeFriends = invite.invitedFriends.filter(function(invitation) {
          return invitation.status == 2 || invitation.status == 3;
        });
        invite.totalCredit = activeFriends.length * 10;
      });
    }
  ]
});
