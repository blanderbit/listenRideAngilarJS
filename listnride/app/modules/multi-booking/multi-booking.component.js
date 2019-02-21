'use strict';

angular.module('multiBooking', []).component('multiBooking', {
  templateUrl: 'app/modules/multi-booking/multi-booking.template.html',
  controllerAs: 'multiBooking',
  controller: ['$stateParams', 'api', 'bikeOptions', 'notification',
    function multiBookingController($stateParams, api, bikeOptions, notification) {
      var multiBooking = this;

      multiBooking.$onInit = function () {
        // methods
        multiBooking.send = send;
        multiBooking.closeDateRange = closeDateRange;
        multiBooking.showSelectedValuesAccessories = showSelectedValuesAccessories;
        multiBooking.showSelectedValuesCategories = showSelectedValuesCategories;
        multiBooking.categorySubs = categorySubs;

        // variables
        multiBooking.success_request = false;
        multiBooking.bike_sizes_ungrouped = [];
        multiBooking.form = {
          city: $stateParams.location ? $stateParams.location : '',
          start_date: '',
          start_at: '9',
          end_at: '18',
          duration: 0,
          bike_sizes: [],
          category_ids: [],
          accessories: [],
          name: '',
          email: '',
          phone_number: '',
          notes: ''
        }
        multiBooking.translatedValues = {
          categories: [],
          accessories: []
        }

        // invocations
        multiBooking.disabledDates = [{
          start_date: (new Date()).setHours(0, 0, 0, 0),
          duration: 1
        }];
        bikeOptions.accessoryOptions().then(function (resolve) {
          multiBooking.translatedValues.accessories = resolve;
        });
        bikeOptions.allCategoriesOptions().then(function (resolve) {
           _.forEach(resolve, function(category){
            multiBooking.translatedValues.categories.push(category.subcategories);
          });
          multiBooking.translatedValues.categories = _.flatten(multiBooking.translatedValues.categories);
        });
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
            notification.show(error, 'error');
          }
        );
      }

      function categorySubs(id) {
        return _.map(_.find(categoryFilter.categories, function (category) {
          return category.catId === id;
        }).subcategories, 'id').sort()
      }

      function showSelectedValuesAccessories() {
        var str = '';
        _.forEach(multiBooking.form.accessories, function(item) {
          str += _.find(multiBooking.translatedValues.accessories, function(o){
            return o.model === item;
          }).name + ', ';
        });

        return str.slice(0, -2);
      }

      function showSelectedValuesCategories() {
        var str = '';
        _.forEach(multiBooking.form.category_ids, function (id) {
          str += _.find(multiBooking.translatedValues.categories, function (o) {
            return o.id == id;
          }).name + ', ';
        });

        return str.slice(0, -2);
      }
    }
  ]
});
