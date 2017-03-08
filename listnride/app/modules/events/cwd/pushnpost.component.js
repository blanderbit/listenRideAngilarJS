'use strict';

angular.module('pushnpost',[]).component('pushnpost', {
  templateUrl: 'app/modules/events/cwd/pushnpost.template.html',
  controllerAs: 'pushnpost',
  controller: ['api',
    function PushnpostController(api) {
      var pushnpost = this;

      api.get('/users/1998').then(
        function(response) {
          pushnpost.bikes = response.data.rides;
        },
        function(error) {
          console.log("Error retrieving User", error);
        }
      );

    }
  ]
});