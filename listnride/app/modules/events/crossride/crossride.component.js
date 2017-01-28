'use strict';

angular.module('crossride',[]).component('crossride', {
  templateUrl: 'app/modules/events/crossride/crossride.template.html',
  controllerAs: 'crossride',
  controller: ['api',
    function CrossrideController(api) {
      var crossride = this;

      api.get('/rides?family=4').then(
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