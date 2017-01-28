'use strict';

angular.module('inVeloVeritas',[]).component('inVeloVeritas', {
  templateUrl: 'app/modules/events/in-velo-veritas/in-velo-veritas.template.html',
  controllerAs: 'inVeloVeritas',
  controller: ['NgMap', 'api',
    function InVeloVeritasController(NgMap, api) {
      var inVeloVeritas = this;

      api.get('/rides?family=4').then(
        function(response) {
          inVeloVeritas.bikes = response.data;
        },
        function(error) {
          console.log("Error retrieving User", error);
        }
      );

    }
  ]
});