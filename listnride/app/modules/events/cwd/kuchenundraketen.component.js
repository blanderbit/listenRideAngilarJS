'use strict';

angular.module('kuchenundraketen',[]).component('kuchenundraketen', {
  templateUrl: 'app/modules/events/cwd/kuchenundraketen.template.html',
  controllerAs: 'kuchenundraketen',
  controller: ['api',
    function KuchenundraketenController(api) {
      var kuchenundraketen = this;

      api.get('/users/1998').then(
        function(response) {
          kuchenundraketen.bikes = response.data.rides;
        },
        function(error) {
          console.log("Error retrieving User", error);
        }
      );

    }
  ]
});