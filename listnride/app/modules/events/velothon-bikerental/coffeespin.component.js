'use strict';

angular.module('velothonBikerental',[]).component('coffeespin', {
  templateUrl: 'app/modules/events/velothon-bikerental/coffeespin.template.html',
  controllerAs: 'coffeespin',
  controller: ['api',
    function CoffeespinController(api) {
      var coffeespin = this;

      coffeespin.bikes = [];

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