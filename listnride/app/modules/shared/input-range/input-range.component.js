'use strict';

angular.module('inputRange', [])
  .component('inputRange', {
    templateUrl: 'app/modules/shared/input-range/input-range.template.html',
    controllerAs: 'inputRange',
    bindings: {
      data: '='
    },
    controller: ['api', inputRangeController]
});

function inputRangeController() {
  var inputRange = this;

  inputRange.$onInit = function () {};

  // converts unixtimestamp to moments object
  inputRange.data.startDate = moment.unix(inputRange.data.startDate);
  //initCalendarPicker();

  this.$onDestroy = function () {};

  function initCalendarPicker() {

  }

  inputRange.openCalendar = function ($event) {
    angular.element($event.target).dateRangePicker();
  }
}