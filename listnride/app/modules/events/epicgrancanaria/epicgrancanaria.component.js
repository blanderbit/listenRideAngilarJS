'use strict';

angular.module('epicgrancanaria', []).component('epicgrancanaria', {
  templateUrl: 'app/modules/events/epicgrancanaria/epicgrancanaria.template.html',
  controllerAs: 'epicgrancanaria',
  controller: ['api', '$translate', 'ngMeta', '$translatePartialLoader', 'bikeOptions', 'notification',
    function EpicgrancanariaController(api, $translate, ngMeta, $tpl, bikeOptions, notification) {
      var epicgrancanaria = this;
      epicgrancanaria.sizes = [];

      $tpl.addPart('static');
      ngMeta.setTitle($translate.instant("events.epicgrancanaria.meta-title"));
      ngMeta.setTag("description", $translate.instant("events.epicgrancanaria.meta-description"));
      ngMeta.setTag("og:image", "app/assets/ui_images/events/epicgrancanaria_hero.jpg");

      bikeOptions.sizeOptions('search', null).then(function (resolve) {
        epicgrancanaria.sizes = resolve
      });

      // booked_at = YYYY-MM-DD
      api.get('/rides?category=30,31,32,33&location=Gran%20Canaria,%20Provinz%20Las%20Palmas,%20Spanien&booked_at=2019-04-05').then(
        function (response) {
          epicgrancanaria.bikes = response.data.bikes;
        },
        function (error) {
          notification.show(error);
        }
      );

    }
  ]
});
