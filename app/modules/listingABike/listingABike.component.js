'use strict';

angular.module('listingABike').component('listingABike', {
  templateUrl: 'app/modules/listingABike/listingABike.template.html',
  controllerAs: 'listingABike',
  controller: [ 'authentication',
    function HomeController(authentication) {
      var listingABike = this;

      listingABike.isLoggedIn = authentication.loggedIn();
      listingABike.showSignupDialog = authentication.showSignupDialog;
    }
  ]
});