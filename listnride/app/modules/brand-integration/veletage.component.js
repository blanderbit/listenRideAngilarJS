'use strict';

angular.module('veletage-integration',[]).component('veletage', {
  templateUrl: 'app/modules/brand-integration/veletage.template.html',
  controllerAs: 'veletage',
  controller: [ '$translate', 'api', 'ngMeta',
    function VeletageController($translate, api, ngMeta) {
      var veletage = this;

      ngMeta.setTitle($translate.instant("brand-integration.veletage.meta-title"));
      ngMeta.setTag("description", $translate.instant("brand-integration.veletage.meta-descr"));

      veletage.currentBikes = [];

      veletage.bikes = {
        berlin: [],
        munich: []
      };

      api.get('/rides?family=8').then(
        function (success) {
          console.log(success.data);

          for (var i=0; i<success.data.length; i++) {
            switch (success.data[i].city) {
              case "Berlin": veletage.bikes.berlin.push(success.data[i]); break;
              case "München": veletage.bikes.munich.push(success.data[i]); break;
            }
          }
          veletage.currentBikes = veletage.bikes["München"];
        },
        function (error) {
          console.log('Error fetching Bikes');
        }
      );

    }
  ]
});
