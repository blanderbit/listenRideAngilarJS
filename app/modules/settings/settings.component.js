'use strict';

angular.module('settings').component('settings', {
  templateUrl: 'app/modules/settings/settings.template.html',
  controllerAs: 'settings',
  controller: ['$localStorage', '$window', 'api', 'access_control',
    function SettingsController($localStorage, $window, api, access_control) {
      if (access_control.requireLogin()) {
        return;
      }
      
      var settings = this;
      settings.user = {};
      settings.loaded = false;

      api.get('/users/' + $localStorage.userId).then(
        function(response) {
          settings.user = response.data;
          console.log(settings.user)
          settings.loaded = true;
        },
        function(error) {
          console.log("Error retrieving User", error);
        }
      );

      settings.openPaymentWindow = function() {
        var w = 550;
          var h = 700;
          var left = (screen.width / 2) - (w / 2);
          var top = (screen.height / 2) - (h / 2);

          $window.open("https://listnride-staging.herokuapp.com/v2/users/" + $localStorage.userId + "/payment_methods/new", "popup", "width="+w+",height="+h+",left="+left+",top="+top);
      };
    }
  ]
});
