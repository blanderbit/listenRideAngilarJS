'use strict';

angular.module('multiBooking', []).component('multiBooking', {
  templateUrl: 'app/modules/multi-booking/multi-booking.template.html',
  controllerAs: 'multiBooking',
  controller: ['$stateParams', '$state', '$translate', 'api', 'ngMeta',
    function multiBookingController($stateParams, $state, $translate, api, ngMeta) {
      var multiBooking = this;

      multiBooking.$onInit = function () {
        // methods
        multiBooking.send = send;

        // variables
        multiBooking.form = {
          location: $stateParams.location ? $stateParams.location : '',
          start_date: '',
          duration: 0
        };
      }

      ///////////

      function send() {
        api.post('/multi-booking/' + multiBooking.form.data).then(
          function (success) {

          },
          function (error) {

          }
        );
      }
    }
  ]
});
