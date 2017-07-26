'use strict';

angular.module('coffeespin',[]).component('coffeespin', {
  templateUrl: 'app/modules/events/velothon-bikerental/coffeespin.template.html',
  controllerAs: 'coffeespin',
  controller: ['$analytics', 'api',
    function CoffeespinController($analytics, api) {
      var coffeespin = this;
      $analytics.eventTrack('View Content', {  category: 'Event Page', label: 'Coffeespin'});

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
