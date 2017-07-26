'use strict';

angular.module('inVeloVeritas',[]).component('inVeloVeritas', {
  templateUrl: 'app/modules/events/in-velo-veritas/in-velo-veritas.template.html',
  controllerAs: 'inVeloVeritas',
  controller: ['NgMap', 'api', '$translate', '$analytics', 'ngMeta',
    function InVeloVeritasController(NgMap, api, $translate, $analytics, ngMeta) {
      var inVeloVeritas = this;
      $analytics.eventTrack('View Content', {  category: 'Event Page', label: 'inVeloVeritas'});

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
