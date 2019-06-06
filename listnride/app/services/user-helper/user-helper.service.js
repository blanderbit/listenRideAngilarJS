'use strict';

angular.module('listnride')
  .factory('userHelper', function () {

    let hasTimeSlots = (userData) => _.has(userData, 'business.time_slots');

    return {
      hasTimeSlots
    };
  });
