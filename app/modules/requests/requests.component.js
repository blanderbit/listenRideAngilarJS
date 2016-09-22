'use strict';

angular.module('requests').component('requests', {
  templateUrl: 'modules/requests/requests.template.html',
  controllerAs: 'requests',
  controller: ['api',
    function RequestsController(api) {
      var requests = this;

      api.get('/users/1001').then(function success() {
        console.log("Successfully retrieved User");
      }, function error() {
        console.log("Error retrieving User");
      })
    }
  ]
});