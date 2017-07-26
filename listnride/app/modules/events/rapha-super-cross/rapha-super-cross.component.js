'use strict';

angular.module('raphaSuperCross',[]).component('raphaSuperCross', {
  templateUrl: 'app/modules/events/rapha-super-cross/rapha-super-cross.template.html',
  controllerAs: 'raphaSuperCross',
  controller: ['$analytics', 'NgMap', 'api',
    function RaphaSuperCrossController($analytics, NgMap, api) {
      var raphaSuperCross = this;
      $analytics.eventTrack('View Content', {  category: 'Event Page', label: 'RaphaSuperCross'});

      api.get('/rides?family=7').then(
        function(response) {
          raphaSuperCross.bikes = response.data;
        },
        function(error) {
          console.log("Error retrieving User", error);
        }
      );

    }
  ]
});
