'use strict';

angular.module('message').component('message', {
  templateUrl: 'modules/_shared/message/message.template.html',
  controllerAs: 'message',
  bindings: {
    content: '<',
    status: '<',
    sender: '<',
    receiver: '<',
    userId: '<',
    timestamp: '<'
  },
  controller: [
    function MessageController() {
      var message = this;
      
      // switch(status) {
      //   case 1:
      //   case 2:
      //   case 3:
      //   case 4:
      //   case 5:
      //   case 6:
      //   case 7:
      //   case 8:
      //   case 9:
      //   default: 
      // }
    }
  ]
});