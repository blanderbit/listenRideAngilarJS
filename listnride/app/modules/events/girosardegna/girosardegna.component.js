'use strict';

angular.module('girosardegna', []).component('girosardegna', {
  templateUrl: 'app/modules/events/girosardegna/girosardegna.template.html',
  controllerAs: 'girosardegna',
  controller: ['api', '$translate', 'ngMeta', '$translatePartialLoader', 'bikeOptions', 'notification',
    function GirosardegnaController(api, $translate, ngMeta, $tpl, bikeOptions, notification) {
      var girosardegna = this;
      girosardegna.sizes = [];

      $tpl.addPart('static');
      ngMeta.setTitle($translate.instant("events.girosardegna.meta-title"));
      ngMeta.setTag("description", $translate.instant("events.girosardegna.meta-description"));
      ngMeta.setTag("og:image", "app/assets/ui_images/events/girosardegna_og.jpg");

      bikeOptions.sizeOptions('search', null).then(function (resolve) {
        girosardegna.sizes = resolve
      });

      // booked_at = YYYY-MM-DD
      api.get('/rides?category=30&location=Cagliari,%20Sardegna&booked_at=2019-04-21').then(
        function (response) {
          girosardegna.bikes = response.data.bikes;
        },
        function (error) {
          notification.show(error);
        }
      );

    }
  ]
});
