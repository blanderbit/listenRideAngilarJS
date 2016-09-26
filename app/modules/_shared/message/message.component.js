'use strict';

angular.module('message').component('message', {
  templateUrl: 'modules/_shared/message/message.template.html',
  controllerAs: 'message',
  bindings: {
    content: '<',
    status: '<',
    sender: '<',
    receiver: '<',
    timestamp: '<',
    request: '<'
  },
  controller: [ '$translate',
    function MessageController($translate) {
      var message = this;

      message.sentMessage = function() {
        return message.status == null && message.request.user.id == message.receiver;
      }

      message.receivedMessage = function() {
        return message.status == null && message.request.user.id == message.sender;
      }

      message.statusMessage = function() {
        return message.status != null;
      }

      message.statusContent = function(statusId) {
        switch(statusId) {
          case 1: return $translate.instant('listChat.would_like_rent_your', {riderName: message.request.user.first_name + " " + message.request.user.last_name, riderCity: message.request.user.city, bikeName: message.request.ride.name, timespan: message.request.timespan,  duration: message.request.duration});
          case 2: return $translate.instant('listChat.you_accepted_request');
          case 3: return $translate.instant('listChat.rider_confirmed_booking', {riderName: message.request.user.first_name + " " + message.request.user.last_name, riderCity: message.request.user.city, riderZip: message.request.user.zip, riderStreet: message.request.user.street});
          case 4:
          case 5:
          case 6:
          case 7:
          case 8:
          case 9:
          default: 
        }
      }
    }
  ]
});