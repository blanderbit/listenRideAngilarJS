'use strict';

angular.module('depart',[]).component('depart', {
  templateUrl: 'app/modules/events/depart/depart.template.html',
  controllerAs: 'depart',
  controller: ['$analytics', 'api',
    function DepartController($analytics, api) {
      var depart = this;
        $analytics.eventTrack('ViewContent', {  category: 'Event Page', label: 'Depart'});

        depart.bikes = [];

        api.get('/rides?family=18').then(
          function(response) {
            depart.bikes = response.data;
          },
          function(error) {
            console.log("Error retrieving User", error);
          }
        );
    }
  ]
});

