'use strict';

angular.module('granfondoviadelsale', []).component('granfondoviadelsale', {
  templateUrl: 'app/modules/events/granfondoviadelsale/granfondoviadelsale.template.html',
  controllerAs: 'granfondoviadelsale',
  controller: ['api', '$translate', 'ngMeta', '$translatePartialLoader', 'bikeOptions', 'notification',
    function GranfondoviadelsaleController(api, $translate, ngMeta, $tpl, bikeOptions, notification) {
      var granfondoviadelsale = this;
      granfondoviadelsale.sizes = [];

      $tpl.addPart('static');
      ngMeta.setTitle($translate.instant("events.granfondoviadelsale.meta-title"));
      ngMeta.setTag("description", $translate.instant("events.granfondoviadelsale.meta-description"));
      ngMeta.setTag("og:image", "app/assets/ui_images/events/granfondoviadelsale_og.jpg");

      bikeOptions.sizeOptions('search', null).then(function (resolve) {
        granfondoviadelsale.sizes = resolve
      });

      // booked_at = YYYY-MM-DD
      api.get('/rides?category=30&location=Cesenatico&booked_at=2019-05-05').then(
        function (response) {
          granfondoviadelsale.bikes = response.data.bikes;
        },
        function (error) {
          notification.show(error);
        }
      );

    }
  ]
});
