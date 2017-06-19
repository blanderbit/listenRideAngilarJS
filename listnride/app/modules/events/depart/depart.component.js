'use strict';

angular.module('depart',[]).component('depart', {
  templateUrl: 'app/modules/events/depart/depart.template.html',
  controllerAs: 'depart',
  controller: ['api',
    function DepartController(api) {
      var depart = this;
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

