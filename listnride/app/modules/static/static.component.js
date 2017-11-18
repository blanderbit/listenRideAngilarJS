'use strict';

angular.module('static',[]).component('static', {
  controllerAs: 'static',
  controller: ['$translate',
    function StaticController($translate) {
      if (accessControl.requireLogin()) {
        return;
      }

    }
  ]
});
