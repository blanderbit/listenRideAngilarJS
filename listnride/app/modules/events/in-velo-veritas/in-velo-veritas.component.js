'use strict';

angular.module('inVeloVeritas',[]).component('inVeloVeritas', {
  templateUrl: 'app/modules/events/in-velo-veritas/in-velo-veritas.template.html',
  controllerAs: 'inVeloVeritas',
  controller: ['NgMap', 'api', '$translate', 'ngMeta', '$translatePartialLoader',
    function InVeloVeritasController(NgMap, api, $translate, ngMeta, $tpl) {
      var inVeloVeritas = this;
      $tpl.addPart('static');
      ngMeta.setTitle($translate.instant("events.in-velo-veritas.meta-title"));
      ngMeta.setTag("description", $translate.instant("events.in-velo-veritas.meta-description"));

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
