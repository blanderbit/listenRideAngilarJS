(function(){
'use strict';
angular.module('static',[]).component('static', {
  controllerAs: 'static',
  controller: ['$translate',
    function SettingsController($translate) {
      if (accessControl.requireLogin()) {
        return;
      }

    }
  ]
});
})();
