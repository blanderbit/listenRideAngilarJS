'use strict';

angular.module('inVeloVeritas',[]).component('inVeloVeritas', {
  templateUrl: 'app/modules/events/in-velo-veritas/in-velo-veritas.template.html',
  controllerAs: 'inVeloVeritas',
  controller: ['NgMap', 'api', '$translate', '$translatePartialLoader',
    function InVeloVeritasController(NgMap, api, $translate, $tpl) {
      var inVeloVeritas = this;
      $tpl.addPart('static');

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
