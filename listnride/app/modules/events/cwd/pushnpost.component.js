'use strict';

angular.module('pushnpost',[]).component('pushnpost', {
  templateUrl: 'app/modules/events/cwd/pushnpost.template.html',
  controllerAs: 'pushnpost',
  controller: ['$analytics', 'api',
    function PushnpostController($analytics, api) {
      var pushnpost = this;
      $analytics.eventTrack('View Content', {  category: 'Event Page', label: 'Pushnpost'});

      pushnpost.bikes = [];

      api.get('/users/1998').then(
        function(response) {
          // Only retrieve the road bikes of the specified lister for the event
          _.each(response.data.rides, function (value, index) {
            if (value.category == 20 && value.id < 730) {
              pushnpost.bikes.push(value);
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
