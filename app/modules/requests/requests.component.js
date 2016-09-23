'use strict';

angular.module('requests').component('requests', {
  templateUrl: 'modules/requests/requests.template.html',
  controllerAs: 'requests',
  controller: ['api',
    function RequestsController(api) {
      var requests = this;

      requests.requests = [];

      api.get('/users/1001/requests').then(function(success) {
        requests.requests = success.data;
        console.log(requests.requests);
      }, function(error) {
        console.log("Error");
      });
    }
  ]
});