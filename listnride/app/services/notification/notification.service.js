'use strict';

angular
  .module('listnride')
  .factory('notification', [
    '$mdToast',
    '$translate',
    notificationController
  ]
);

/* Lingohub supported keys
 * STATUSES: shared.200, shared.422, shared.404, shared.500
 * ERROR_MESSAGES:
 */

function notificationController($mdToast, $translate) {
 return {
  show: function (response, type, translateKey) {
    var type = type || 'success';
    var message = translateKey || getMessage();

    function getMessage() {
      var responseText;

      if (type === 'error' && response.data && response.data.errors && response.data.errors.length) {
        // TODO: Add multiply errors
        return response.data.errors[0].detail
      } else {
        responseText = response.status
      }

      return convertToKey(responseText);
    };

    function convertToKey(t) {
      // TODO: remove statuses from shared.errors to shared.notifications
      return 'shared.errors.' + t;
    };

    $mdToast.show(
      $mdToast.simple()
      .textContent($translate.instant(message))
      .hideDelay(4000)
      .position('top center')
    );

  }
 }
}