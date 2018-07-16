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
    messageTime: '<',
    time: '<'
  },
  controller: [ '$translate', '$localStorage', '$mdDialog', '$analytics', 'api',
    function MessageController($translate, $localStorage, $mdDialog, $analytics, api) {
      var message = this;
      var time = message.time.toString();
      var messageDate = moment(message.time);
      var todayDate = moment(new Date());
      // var yesterdayDate = moment(new Date()).add(-1, 'days');

      if (messageDate.diff(todayDate, 'days') === 0){
        $translate(["shared.today"]).then(
          function (translations) {
            message.localTime = translations["shared.today"] + ', ' + messageDate.format('HH:mm');
          }
        );
      } else if (messageDate.diff(todayDate, 'days') === -1){
        $translate(["shared.yesterday"]).then(
          function (translations) {
            message.localTime = translations["shared.yesterday"] + ', ' + messageDate.format('HH:mm');
          }
        );
      } else {
        message.localTime = messageDate.format('DD.MM.YYYY HH:mm');
      }      
      
      message.buttonClicked = false;
      
      message.closeDialog = function() {
        $mdDialog.hide();
      };

      message.book = function() {
        message.buttonClicked = true;
        message.acceptBooking();
      };

      message.sentMessage = function() {
        return message.status == null && $localStorage.userId == message.sender;
      };

      message.receivedMessage = function() {
        return message.status == null && $localStorage.userId != message.sender;
      };

      message.statusMessage = function() {
        if (message.request.rideChat) {
          return message.status != null && message.status != 7 && message.status != 2 && message.status != 4;
        } else {
          return message.status != null && message.status != 7 && message.status != 6 && message.status != 2 && message.status != 4;
        }
        // return message.status != null && message.status != 7 && (!message.request.rideChat && message.status != 6);
      };

      message.showReturn = function () {
        return !message.request.rideChat &&
          message.status === 3 &&
          message.request.returnable &&
          moment().diff(message.request.start_date) > 0
      };

      // TODO: Unfortunately doublecoded in message.component and requests.component
      message.updateStatus = function(statusId) {
        message.buttonClicked = true;
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
            if (statusId === 8) {
              $analytics.eventTrack('Request Received', {  category: 'Rent Bike', label: 'Reject'});
            }
          },
          function(error) {
            message.buttonClicked = false;
          }
        );
      };

    }
  ]
});
