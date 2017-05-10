'use strict';

angular.module('muli-integration',[]).component('muli', {
  templateUrl: 'app/modules/brand-integration/muli.template.html',
  controllerAs: 'muli',
  controller: [ '$translate', 'api', 'ngMeta',
    function MuliController($translate, api, ngMeta) {

      ngMeta.setTitle($translate.instant("brand-integration.muli.meta-title"));
      ngMeta.setTag("description", $translate.instant("brand-integration.muli.meta-description"));

      var muli = this;


      muli.bikes = {
        berlin: [],
        munich: []
      };

      api.get('/rides?family=14').then(
        function (success) {

          for (var i=0; i<success.data.length; i++) {
            switch (success.data[i].city) {
              case "Berlin": muli.bikes.berlin.push(success.data[i]); break;
              case "München": muli.bikes.munich.push(success.data[i]); break;
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
