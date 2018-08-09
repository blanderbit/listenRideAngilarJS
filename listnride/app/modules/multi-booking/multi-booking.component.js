'use strict';

angular.module('multiBooking', []).component('multiBooking', {
  templateUrl: 'app/modules/multi-booking/multi-booking.template.html',
  controllerAs: 'multiBooking',
  controller: ['$stateParams', '$translate', '$mdToast', 'api',
    function multiBookingController($stateParams, $translate, $mdToast, api) {
      var multiBooking = this;

      multiBooking.$onInit = function () {
        // methods
        multiBooking.send = send;
        multiBooking.closeDateRange = closeDateRange;

        // variables
        multiBooking.success_request = false;
        multiBooking.bike_sizes_ungrouped = [];
        multiBooking.form = {
          city: $stateParams.location ? $stateParams.location : '',
          start_date: '',
          duration: 0,
          bike_sizes: [],
          category_ids: [],
          accessories: [],
          name: '',
          email: '',
          phone_number: '',
          notes: ''
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

      function groupBikeSizes() {
        multiBooking.form.bike_sizes.length = 0; // clear array of bike_sizes
        _.forOwn(_.countBy(multiBooking.bike_sizes_ungrouped), function (value, key) {
          multiBooking.form.bike_sizes.push({
            'size': +key,
            'count': value
          });
        });

      }

      function beforeSend() {
        groupBikeSizes();
      }

      function send() {
        beforeSend();

        api.post('/multi_booking', multiBooking.form).then(
          function (success) {
            multiBooking.success_request = true;
          },
          function (error) {
            $mdToast.show(
              $mdToast.simple()
              .textContent($translate.instant('share.errors.' + error.status))
              .hideDelay(4000)
              .position('top center')
            );
          }
        );
      }
    }
  ]
});
