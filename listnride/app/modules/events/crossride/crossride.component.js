'use strict';

angular.module('crossride',[]).component('crossride', {
  templateUrl: 'app/modules/events/crossride/crossride.template.html',
  controllerAs: 'crossride',
  controller: ['$analytics', 'api',
    function CrossrideController($analytics, api) {
      var crossride = this;
      $analytics.eventTrack('View Content', {  category: 'Event Page', label: 'Bonvelo'});

      api.get('/rides?family=9').then(
        function(response) {
          crossride.bikes = response.data;
        },
        function(error) {
          console.log("Error retrieving User", error);
        }
      );
    }
  ]
});
