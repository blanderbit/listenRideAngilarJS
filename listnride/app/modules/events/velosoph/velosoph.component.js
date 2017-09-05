'use strict';

angular.module('velosoph',[]).component('velosoph', {
  templateUrl: 'app/modules/events/velosoph/velosoph.template.html',
  controllerAs: 'velosoph',
  controller: ['api',
    function Velosoph(api) {
      var velosoph = this;

      velosoph.bikes = [];

      api.get('/rides?family=22').then(
        function (success) {
          velosoph.bikes = success.data;
        },
        function (error) {

        }
      );
    }
  ]
});
