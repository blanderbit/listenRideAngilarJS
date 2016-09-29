'use strict';

angular.module('requests').component('requests', {
  templateUrl: 'app/modules/requests/requests.template.html',
  controllerAs: 'requests',
  controller: ['$localStorage', '$interval', '$mdMedia', '$mdDialog', 'api',
    function RequestsController($localStorage, $interval, $mdMedia, $mdDialog, api) {
      var requests = this;

      var poller;

      requests.requests = [];
      requests.request = {};
      requests.message = "";
      requests.showChat = false;
      requests.$mdMedia = $mdMedia;

      api.get('/users/' + $localStorage.userId + '/requests').then(function(success) {
        requests.requests = success.data;
      }, function(error) {
        console.log("Error fetching request list");
      });

      var reloadRequest = function(requestId) {
        api.get('/requests/' + requestId).then(function(success) {
          if (requests.request.messages == null || (requests.request.messages.length != success.data.messages.length)) {
            requests.request = success.data;
            requests.request.rideChat = $localStorage.userId == requests.request.user.id;
          }
        }, function(error) {
          console.log("Error fetching request");
        });
      };

      var showChatDialog = function() {
        $mdDialog.show({
          controller: ChatDialogController,
          controllerAs: 'chatDialog',
          templateUrl: 'app/modules/requests/chatDialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: true // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          //
        }, function() {
          //
        });
      }

      requests.loadRequest = function(requestId) {
        $interval.cancel(poller);
        reloadRequest(requestId);
        poller = $interval(function() {
            reloadRequest(requestId);
        }, 10000);

        if ($mdMedia('xs')) {
          requests.showChat = false;
          showChatDialog();
        } else {
          requests.showChat = true;
        }
      }

      requests.$onDestroy = function() {
        $interval.cancel(poller);
      };

      requests.sendMessage = function() {
        if( requests.message ) {
          var data = {
            "request_id": requests.request.id,
            "sender": $localStorage.userId,
            "content": requests.message,
            "is_read": false
          };
          var message = {
            "message": data
          };
          requests.request.messages.push(data);
          api.post('/messages', message).then(function(success) {
            //
          }, function(error) {
            console.log("Error occured sending message");
          });
        }
        requests.message = "";
      }

      var ChatDialogController = function() {
        var chatDialog = this;
        chatDialog.requests = requests;

        chatDialog.hide = function() {
          $mdDialog.hide();
        };
      }

    }
  ]
});