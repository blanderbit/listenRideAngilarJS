'use strict';

angular.module('berlinTriathlonXl', []).component('berlinTriathlonXl', {
  templateUrl: 'app/modules/events/berlin-triathlon-xl/berlin-triathlon-xl.template.html',
  controllerAs: 'berlinTriathlonXl',
  controller: ['NgMap', 'api', '$translate', 'ngMeta', '$translatePartialLoader',
    function BerlinTriathlonXlController(NgMap, api, $translate, ngMeta, $tpl) {
      var berlinTriathlonXl = this;

      $tpl.addPart('static');
      ngMeta.setTitle($translate.instant("events.berlin-triathlon-xl.meta-title"));
      ngMeta.setTag("description", $translate.instant("events.berlin-triathlon-xl.meta-description"));
      ngMeta.setTag("og:image", "app/assets/ui_images/events/berlin-triathlon-xl_og.jpg");

      berlinTriathlonXl.sizeOptions = [
        {value: "", label: "-"},
        {value: 155, label: "155 - 165 cm"},
        {value: 165, label: "165 - 175 cm"},
        {value: 175, label: "175 - 185 cm"},
        {value: 185, label: "185 - 195 cm"},
        {value: 195, label: "195 - 205 cm"}
      ];

      berlinTriathlonXl.isAvailable = function (bike) {

      };

      $translate('search.all-sizes').then(function (translation) {
        berlinTriathlonXl.sizeOptions[0].label = translation;
      });

      // TODO: Readd &booked_at=2018-07-14 when API is fixed
      api.get('/rides?category=30,31&location=Berlin&booked_at=2019-06-02').then(
        function (response) {
          berlinTriathlonXl.bikes = response.data.bikes;
        },
        function (error) {
        }
      );

    }
  ]
});
