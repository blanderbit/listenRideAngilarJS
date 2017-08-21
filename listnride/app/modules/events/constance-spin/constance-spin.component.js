'use strict';

angular.module('constanceSpin',[]).component('constanceSpin', {
  templateUrl: 'app/modules/events/constance-spin/constance-spin.template.html',
  controllerAs: 'constanceSpin',
  controller: ['api',
    function ConstanceSpinController(api) {
      var constanceSpin = this;

      constanceSpin.bikes = [];

      // api.get('/users/1998').then(
      //   function(response) {
      //     // Only retrieve the road bikes of the specified lister for the event
      //     _.each(response.data.rides, function (value, index) {
      //       if (value.category == 20 && value.id < 730) {
      //         pushnpost.bikes.push(value);
      //       }
      //     });
      //   },
      //   function(error) {
      //     console.log("Error retrieving User", error);
      //   }
      // );

    }
  ]
});
