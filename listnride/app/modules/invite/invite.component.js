'use strict';

angular.module('invite',[]).component('invite', {
  templateUrl: 'app/modules/invite/invite.template.html',
  controllerAs: 'invite',
  controller: ['api', '$localStorage', '$translate', 'Socialshare', 'accessControl', 'ngMeta',
    function InviteController(api, $localStorage, $translate, Socialshare, accessControl, ngMeta) {
      if (accessControl.requireLogin()) {
        return;
      }

      $translate(["invite.meta-title", "invite.meta-description"])
        .then(function (translations) {
          ngMeta.setTitle(translations["invite.meta-title"]);
          ngMeta.setTag("description", translations["invite.meta-description"]);
        });

      var invite = this;
      invite.inviteUrl = "www.listnride.com/invitation/" + $localStorage.referenceCode;
      $translate('invite.invite-form.copy').then(
        function (translation) {
          invite.buttonLabel = translation;
        }
      );

      invite.copyToClipboard = function() {
        document.getElementById("linkContainer").select();
        document.execCommand('copy');
        invite.buttonLabel = $translate.instant('invite.invite-form.copied');
      };

      invite.shareThroughFacebook = function() {
        Socialshare.share({
          'provider': 'facebook',
          'attrs': {
            'socialshareUrl': invite.inviteUrl,
            'socialshareTitle': "testtitel",
            'socialshareDescription': "Description",
            'socialsharePopupHeight': 600,
            'socialsharePopupWidth': 400
          }
        });
      };

      invite.shareThroughEmail = function() {
        var userFullName = $localStorage.name;
        var voucherUrl = invite.inviteUrl;
        var firstName = $localStorage.firstName;
        $translate(
          ["invite.share.email-subject", "invite.share.email-body"],
          {full_name: userFullName, voucher_url: voucherUrl, first_name: firstName})
          .then(function (translations) {
            var subject = translations["invite.share.email-subject"];
            var body = translations["invite.share.email-body"];
            window.open("mailto:" + "?subject=" + subject + "&body=" + body, "_self");
          })
      };   

      api.get("/users/" + $localStorage.userId + "/overview ").then(function(response) {
        invite.invitedFriends = response.data.friends;
        invite.inviteUrl = api.getWebappUrl() + "/invitation/" + response.data.author.ref_code;
        var activeFriends = invite.invitedFriends.filter(function(invitation) {
          return invitation.status == 2 || invitation.status == 3;
        });
        invite.totalCredit = activeFriends.length * 10;
      });
    }
  ]
});
