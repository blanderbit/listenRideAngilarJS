'use strict';

angular.module('vello-integration',[]).component('vello', {
  templateUrl: 'app/modules/brand-integration/vello.template.html',
  controllerAs: 'vello',
  controller: [ '$translate', 'api', 'ngMeta',
    function VelloController($translate, api, ngMeta) {
      var vello = this;

      ngMeta.setTitle($translate.instant("brand-integration.vello.meta-title"));
      ngMeta.setTag("description", $translate.instant("brand-integration.vello.meta-descr"));

      vello.bikes = {
        berlin: [],
        munich: []
      };

      api.get('/rides?family=15').then(
        function (success) {

          for (var i=0; i<success.data.length; i++) {
            switch (success.data[i].city) {
              case "Berlin": vello.bikes.berlin.push(success.data[i]); break;
              case "München": vello.bikes.munich.push(success.data[i]); break;
            }
          }

        },
        function (error) {
          console.log('Error fetching Bikes');
        }
      );
    }
  ]
});
