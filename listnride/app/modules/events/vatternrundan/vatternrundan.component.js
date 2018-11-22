'use strict';

angular.module('vatternrundan', []).component('vatternrundan', {
  templateUrl: 'app/modules/events/vatternrundan/vatternrundan.template.html',
  controllerAs: 'vatternrundan',
  controller: ['api', '$translate', 'ngMeta', '$translatePartialLoader', 'bikeOptions', 'notification',
    function VatternrundanController(api, $translate, ngMeta, $tpl, bikeOptions, notification) {
      var vatternrundan = this;

      $tpl.addPart('static');
      ngMeta.setTitle($translate.instant("events.vatternrundan.meta-title"));
      ngMeta.setTag("description", $translate.instant("events.vatternrundan.meta-description"));
      ngMeta.setTag("og:image", "app/assets/ui_images/events/vatternrundan/vatternrundan_og.jpg");

      vatternrundan.sizes = [];
      bikeOptions.sizeOptions('search', null).then(function (resolve) {
        vatternrundan.sizes = resolve
      });

      api.get('/rides?category=30,31&location=Motala,Sweden&booked_at=2019-06-07').then(
        function (response) {
          vatternrundan.bikes = response.data.bikes;
        },
        function (error) {
          notification.show(error);
        }
      );

    }
  ]
});
