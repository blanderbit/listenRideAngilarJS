'use strict';

angular.module('message').component('message', {
  templateUrl: 'app/modules/shared/message/message.template.html',
  controllerAs: 'message',
  bindings: {
    content: '<',
    status: '<',
    sender: '<',
    receiver: '<',
    timestamp: '<',
    confirmBooking: '&',
    showRatingDialog: '&',
    request: '<'
  },
  controller: [ '$translate', '$localStorage', 'api',
    function MessageController($translate, $localStorage, api) {
      var message = this;
 
      message.chatFlow = function() {
        if (message.request.rideChat) {
          return "rideChat";
        }
        else {
          return "listChat";
        }
      };

      console.log(message.chatFlow());

      message.sentMessage = function() {
        return message.status == null && $localStorage.userId == message.sender;
      }

      message.receivedMessage = function() {
        return message.status == null && $localStorage.userId != message.sender;
      }

      message.statusMessage = function() {
        return message.status != null && message.status != 7;
      }

      // Unfortunately doublecoded in message.component and requests.component#bookingDialog
      message.updateStatus = function(statusId) {
        var data = {
          "request_id": message.request.id,
          "sender": $localStorage.userId,
          "status": statusId,
          "content": ""
        };

        message.request.messages.push(data);
        var data = {
          "request": {
            "status": statusId
          }
        };

        message.request.status = statusId;

        api.put("/requests/" + message.request.id, data).then(
          function(success) {
            console.log("successfully updated request");
            // message.request.status = statusId;
          },
          function(error) {
            console.log("error updating request");
          }
        );
      };

    }
  ]
});