'use strict';

angular.module('torosDeGravel', []).component('torosDeGravel', {
  templateUrl: 'app/modules/events/toros-de-gravel/toros-de-gravel.template.html',
  controllerAs: 'torosDeGravel',
  controller: ['NgMap', 'api', '$translate', 'ngMeta', '$translatePartialLoader',
    function torosDeGravelController(NgMap, api, $translate, ngMeta, $tpl) {
      var torosDeGravel = this;
      $tpl.addPart('static');
      ngMeta.setTitle($translate.instant("events.toros-de-gravel.meta-title"));
      ngMeta.setTag("description", $translate.instant("events.toros-de-gravel.meta-description"));

      torosDeGravel.sizeOptions = [
        {value: "", label: "-"},
        {value: 155, label: "155 - 165 cm"},
        {value: 165, label: "165 - 175 cm"},
        {value: 175, label: "175 - 185 cm"},
        {value: 185, label: "185 - 195 cm"},
        {value: 195, label: "195 - 205 cm"}
      ];

      torosDeGravel.isAvailable = function (bike) {

      };

      $translate('search.all-sizes').then(function (translation) {
        torosDeGravel.sizeOptions[0].label = translation;
      });
      // TODO: Readd &booked_at=2018-07-14 when API is fixed
      api.get('/rides?category=42,43&location=Mallorca&booked_at=2018-10-13').then(
        function (response) {
          torosDeGravel.bikes = response.data.bikes;
        },
        function (error) {
        }
      );

    }
  ]
});
