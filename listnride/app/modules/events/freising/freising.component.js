'use strict';

angular.module('freising',[]).component('freising', {
  templateUrl: 'app/modules/events/freising/freising.template.html',
  controllerAs: 'freising',
  controller: ['api',
    function Freising(api) {
      var freising = this;

      freising.bikes = [];

      api.get('/rides?family=22').then(
        function (success) {
          freising.bikes = success.data;
        },
        function (error) {

        }
      );
    }
  ]
});
