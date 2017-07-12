'use strict';

angular.module('message',[]).component('message', {
  templateUrl: 'app/modules/shared/message/message.template.html',
  controllerAs: 'message',
  bindings: {
    content: '<',
    status: '<',
    sender: '<',
    receiver: '<',
    timestamp: '<',
    confirmBooking: '&',
    acceptBooking: '&',
    showRatingDialog: '&',
    request: '<',
    messageTime: '<'
  },
  controller: [ '$translate', '$localStorage', '$mdDialog', 'api',
    function MessageController($translate, $localStorage, $mdDialog, api) {
      var message = this;
      
      message.closeDialog = function() {
        $mdDialog.hide();
      }

      message.sentMessage = function() {
        return message.status == null && $localStorage.userId == message.sender;
      }

      message.receivedMessage = function() {
        return message.status == null && $localStorage.userId != message.sender;
      }

      message.statusMessage = function() {
        if (message.request.rideChat) {
          return message.status != null && message.status != 7 && message.status != 2 && message.status != 4;
        } else {
          return message.status != null && message.status != 7 && message.status != 6 && message.status != 2 && message.status != 4;
        }
        // return message.status != null && message.status != 7 && (!message.request.rideChat && message.status != 6);
      }

      // TODO: Unfortunately doublecoded in message.component and requests.component
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