'use strict';

angular.module('requests').component('requests', {
  templateUrl: 'modules/requests/requests.template.html',
  controllerAs: 'requests',
  controller: ['api',
    function RequestsController(api) {
      var requests = this;

      requests.requests = [];
      requests.request = [];

      requests.loadRequest = function(requestId) {
        api.get('/requests/' + requestId).then(function(success) {
          requests.request = success.data;
          console.log(requests.request);
        }, function(error) {
          console.log("Error fetching request");
        });
      }


      api.get('/users/1001/requests').then(function(success) {
        requests.requests = success.data;
        console.log(requests.requests);
      }, function(error) {
        console.log("Error fetching request list");
      });
    }
  ]
});