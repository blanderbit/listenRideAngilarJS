'use strict';

angular.module('berlinTriathlon', []).component('berlinTriathlon', {
  templateUrl: 'app/modules/events/berlin-triathlon/berlin-triathlon.template.html',
  controllerAs: 'berlinTriathlon',
  controller: ['api', '$translate', 'ngMeta', '$translatePartialLoader', 'bikeOptions', 'notification',
    function BerlinTriathlonController(api, $translate, ngMeta, $tpl, bikeOptions, notification) {
      var berlinTriathlon = this;
      berlinTriathlon.sizes = [];

      $tpl.addPart('static');
      ngMeta.setTitle($translate.instant("events.berlin-triathlon.meta-title"));
      ngMeta.setTag("description", $translate.instant("events.berlin-triathlon.meta-description"));
      ngMeta.setTag("og:image", "app/assets/ui_images/events/berlin-triathlon_og.jpg");

      bikeOptions.sizeOptions('search', null).then(function (resolve) {
        berlinTriathlon.sizes = resolve
      });

      // TODO: Readd &booked_at=2018-07-14 when API is fixed
      api.get('/rides?category=30,31&location=Berlin&booked_at=2019-06-02').then(
        function (response) {
          berlinTriathlon.bikes = response.data.bikes;
        },
        function (error) {
          notification.show(error);
        }
      );

    }
  ]
});
