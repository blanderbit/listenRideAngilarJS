'use strict';

angular.module('lardita', []).component('lardita', {
  templateUrl: 'app/modules/events/lardita/lardita.template.html',
  controllerAs: 'lardita',
  controller: ['api', '$translate', 'ngMeta', '$translatePartialLoader', 'bikeOptions', 'notification',
    function LarditaController(api, $translate, ngMeta, $tpl, bikeOptions, notification) {
      var lardita = this;
      lardita.sizes = [];

      $tpl.addPart('static');
      ngMeta.setTitle($translate.instant("events.lardita.meta-title"));
      ngMeta.setTag("description", $translate.instant("events.lardita.meta-description"));
      ngMeta.setTag("og:image", "app/assets/ui_images/events/lardita_og.jpg");

      bikeOptions.sizeOptions('search', null).then(function (resolve) {
        lardita.sizes = resolve
      });

      // booked_at = YYYY-MM-DD
      api.get('/rides?category=30&location=Arezzo,%20Tuscany&booked_at=2019-03-24').then(
        function (response) {
          lardita.bikes = response.data.bikes;
        },
        function (error) {
          notification.show(error);
        }
      );

    }
  ]
});
