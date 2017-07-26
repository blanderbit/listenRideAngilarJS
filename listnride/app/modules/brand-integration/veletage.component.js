'use strict';

angular.module('veletage-integration',[]).component('veletage', {
  templateUrl: 'app/modules/brand-integration/veletage.template.html',
  controllerAs: 'veletage',
  controller: [ '$translate', '$analytics', 'api', 'ngMeta',
    function VeletageController($translate, $analytics, api, ngMeta) {
      var veletage = this;
      $analytics.eventTrack('View Content', {  category: 'Brand Page', label: 'Veletage'});

      ngMeta.setTitle($translate.instant("brand-integration.veletage.meta-title"));
      ngMeta.setTag("description", $translate.instant("brand-integration.veletage.meta-descr"));

      veletage.bikes = [];

      api.get('/rides?family=16').then(
        function (success) {
          veletage.bikes = success.data;
        },
        function (error) {
          console.log('Error fetching Bikes');
        }
      );

    }
  ]
});
