'use strict';

angular.module('message').component('message', {
  templateUrl: 'app/modules/_shared/message/message.template.html',
  controllerAs: 'message',
  bindings: {
    content: '<',
    status: '<',
    sender: '<',
    receiver: '<',
    timestamp: '<',
    request: '<'
  },
  controller: [ '$translate', '$localStorage',
    function MessageController($translate, $localStorage) {
      var message = this;

      message.chatFlow = function() {
        if ($localStorage.userId == message.request.user.id) {
          return "rideChat";
        }
        else {
          return "listChat";
        }
      };

      message.sentMessage = function() {
        return message.status == null && message.request.user.id == message.receiver;
      }

      message.receivedMessage = function() {
        return message.status == null && message.request.user.id == message.sender;
      }

      message.statusMessage = function() {
        return message.status != null && message.status != 6 && message.status != 7;
      }
    }
  ]
});