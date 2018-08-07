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
        multiBooking.closeDateRange = closeDateRange;

        // variables
        multiBooking.form = {
          location: $stateParams.location ? $stateParams.location : '',
          start_date: '',
          duration: 0,
          categories: [],
          accessories: []
        };
      }

      ///////////

      // tricky function to initialize date-picker close, when we click ng-menu
      function closeDateRange() {
        var datePickerTrigger = angular.element('.js-datepicker-opened');
        if (!!datePickerTrigger.length) {
          datePickerTrigger.click();
        }
      }

      function send($event) {
        $event.preventDefault();
        console.log('seve');
        console.log(multiBooking.form);
        // api.post('/multi-booking/' + multiBooking.form.data).then(
        //   function (success) {

        //   },
        //   function (error) {

        //   }
        // );
      }
    }
  ]
});
