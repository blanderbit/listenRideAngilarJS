'use strict';

angular.module('velosoph',[]).component('velosoph', {
  templateUrl: 'app/modules/events/velosoph/velosoph.template.html',
  controllerAs: 'velosoph',
  controller: ['api', '$translatePartialLoader',
    function Velosoph(api, $tpl) {
      var velosoph = this;
      $tpl.addPart('static');
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
