'use strict';

angular.module('berlinTriathlonXl', []).component('berlinTriathlonXl', {
  templateUrl: 'app/modules/events/berlin-triathlon-xl/berlin-triathlon-xl.template.html',
  controllerAs: 'berlinTriathlonXl',
  controller: ['api', '$translate', 'ngMeta', '$translatePartialLoader', 'bikeOptions', 'notification',
    function BerlinTriathlonXlController(api, $translate, ngMeta, $tpl, bikeOptions , notification) {
      var berlinTriathlonXl = this;

      $tpl.addPart('static');
      ngMeta.setTitle($translate.instant("events.berlin-triathlon-xl.meta-title"));
      ngMeta.setTag("description", $translate.instant("events.berlin-triathlon-xl.meta-description"));
      ngMeta.setTag("og:image", "app/assets/ui_images/events/berlin-triathlon-xl_og.jpg");

      berlinTriathlonXl.sizes = [];
      bikeOptions.sizeOptions('search', null).then(function (resolve) {
        berlinTriathlonXl.sizes = resolve
      });

      api.get('/rides?category=30,31&location=Berlin&booked_at=2019-06-23').then(
        function (response) {
          berlinTriathlonXl.bikes = response.data.bikes;
        },
        function (error) {
          notification.show(error);
        }
      );

    }
  ]
});
