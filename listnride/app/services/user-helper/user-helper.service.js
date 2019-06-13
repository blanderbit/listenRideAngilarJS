'use strict';

angular.module('listnride')
  .factory('userHelper', function () {

    let hasTimeSlots = (userData) => _.has(userData, 'business.time_slots');
    let insuranceEnabled = (userData) => _.get(userData, 'business.insurance_enabled');
    let getTimeSlots = (userData) => _.get(userData, 'business.time_slots');

    return {
      hasTimeSlots,
      insuranceEnabled,
      getTimeSlots
    };
  });
