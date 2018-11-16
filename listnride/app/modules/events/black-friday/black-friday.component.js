'use strict';

angular.module('blackFriday', []).component('blackFriday', {
  templateUrl: 'app/modules/events/black-friday/black-friday.template.html',
  controllerAs: 'blackFriday',
  controller: ['api', '$translate', 'ngMeta', '$translatePartialLoader', 'notification',
    function BlackFridayController(api, $translate, ngMeta, $tpl, bikeOptions, notification) {
      var blackFriday = this;

      $tpl.addPart('static');
      ngMeta.setTitle($translate.instant("meta.events.black-friday.meta-title"));
      ngMeta.setTag("description", $translate.instant("meta.events.black-friday.meta-description"));
      ngMeta.setTag("og:image", "app/assets/ui_images/events/black-friday/black-friday_og.jpg");
    }
  ]
});
