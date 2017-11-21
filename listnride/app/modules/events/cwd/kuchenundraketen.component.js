'use strict';

angular.module('kuchenundraketen',[]).component('kuchenundraketen', {
  templateUrl: 'app/modules/events/cwd/kuchenundraketen.template.html',
  controllerAs: 'kuchenundraketen',
  controller: ['api', '$translatePartialLoader',
    function KuchenundraketenController(api, $tpl) {
      var kuchenundraketen = this;
      $tpl.addPart('static');
      kuchenundraketen.bikes = [];

      api.get('/users/1998').then(
        function(response) {
          // Only retrieve the road bikes of the specified lister for the event
          _.each(response.data.rides, function (value, index) {
            if (value.category == 20) {
              kuchenundraketen.bikes.push(value);
            }
          });
        },
        function(error) {
          console.log("Error retrieving User", error);
        }
      );

    }
  ]
});
