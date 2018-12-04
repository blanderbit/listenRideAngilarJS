'use strict';

angular.module('veloraceDresden', []).component('veloraceDresden', {
  templateUrl: 'app/modules/events/velorace-dresden/velorace-dresden.template.html',
  controllerAs: 'veloraceDresden',
  controller: ['api', '$translate', 'ngMeta', '$translatePartialLoader', 'bikeOptions', 'notification',
    function VeloraceDresdenController(api, $translate, ngMeta, $tpl, bikeOptions, notification) {
      var veloraceDresden = this;
      veloraceDresden.sizes = [];

      $tpl.addPart('static');
      ngMeta.setTitle($translate.instant("events.velorace-dresden.meta-title"));
      ngMeta.setTag("description", $translate.instant("events.velorace-dresden.meta-description"));
      ngMeta.setTag("og:image", "app/assets/ui_images/events/velorace-dresden_hero.jpg");

      bikeOptions.sizeOptions('search', null).then(function (resolve) {
        veloraceDresden.sizes = resolve
      });

      // booked_at = YYYY-MM-DD
      api.get('/rides?category=30&location=Dresden&booked_at=2019-08-11').then(
        function (response) {
          veloraceDresden.bikes = response.data.bikes;
        },
        function (error) {
          notification.show(error);
        }
      );

    }
  ]
});
