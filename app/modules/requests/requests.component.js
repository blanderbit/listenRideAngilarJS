'use strict';

angular.module('requests').component('requests', {
  templateUrl: 'app/modules/requests/requests.template.html',
  controllerAs: 'requests',
  controller: ['$localStorage', '$interval', 'api',
    function RequestsController($localStorage, $interval, api) {
      var requests = this;

      var poller;

      requests.requests = [];
      requests.request = [];
      requests.message = "";

      api.get('/users/1001/requests').then(function(success) {
        requests.requests = success.data;
      }, function(error) {
        console.log("Error fetching request list");
      });

      var reloadRequest = function(requestId) {
        api.get('/requests/' + requestId).then(function(success) {
          requests.request = success.data;
        }, function(error) {
          console.log("Error fetching request");
        });
      };

      requests.loadRequest = function(requestId) {
        $interval.cancel(poller);
        reloadRequest(requestId);
        poller = $interval(function() {
            console.log("polling");
            reloadRequest(requestId);
        }, 5000);
      }

      requests.sendMessage = function() {
        var data = {
          "request_id": requests.request.id,
          "sender": $localStorage.userId,
          "content": requests.message,
          "is_read": false
        };
        var message = {
          "message": data
        };
        // requests.request.messages.push(data);
        // console.log(requests.request);
        api.post('/messages', message).then(function(success) {
          requests.loadRequest(requests.request.id);
        }, function(error) {
          console.log("Error occured sending message");
        });
        requests.message = "";
      }

    }
  ]
});