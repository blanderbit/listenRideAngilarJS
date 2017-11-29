'use strict';

angular.module('muli-integration',[]).component('muli', {
  templateUrl: 'app/modules/brand-integration/muli.template.html',
  controllerAs: 'muli',
  controller: [ '$translate', '$translatePartialLoader', 'api', 'ngMeta', 'ENV',
    function MuliController($translate, $tpl, api, ngMeta, ENV ) {
      ngMeta.setTitle($translate.instant("brand-integration.muli.meta-title"));
      ngMeta.setTag("description", $translate.instant("brand-integration.muli.meta-description"));

      var muli = this;
      $tpl.addPart(ENV.staticTranslation);
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
