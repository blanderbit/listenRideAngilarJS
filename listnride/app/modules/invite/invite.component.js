'use strict';

angular.module('invite',[]).component('invite', {
  templateUrl: 'app/modules/invite/invite.template.html',
  controllerAs: 'invite',
  controller: [
    function InviteController() {
      console.log("hi", invite);
      var invite = this;
      invite.inviteUrl = "http://www.listnride.com/invitation/amrXXX69";

      invite.onCopyButtonClick = function() {
        
      };

/*      ngMeta.setTitle($translate.instant("home.meta-title"));
      ngMeta.setTag("description", $translate.instant("home.meta-description"));

      api.get("/featured").then(function(response) {
        home.featuredBikes = response.data.slice(0,6);
      });*/
    }
  ]
});
