'use strict';

angular.module('cocomatIntegration',[]).component('cocomat', {
  templateUrl: 'app/modules/brand-integration/cocomat.template.html',
  controllerAs: 'cocomat',
  controller: [ '$translate', '$translatePartialLoader', 'api', 'ENV',
    function CocomatController($translate, $tpl, api, ENV) {
      var cocomat = this;
      $tpl.addPart(ENV.staticTranslation);

      cocomat.bikes = {
        dresden: [],
        munich: [],
        hamburg: []
      };

      api.get('/rides?family=31').then(
        function (success) {
          for (var i=0; i<success.data.bikes.length; i++) {
            switch (success.data.bikes[i].city) {
              case "Dresden": cocomat.bikes.dresden.push(success.data.bikes[i]); break;
              case "Munich": cocomat.bikes.munich.push(success.data.bikes[i]); break;
              case "Hamburg": cocomat.bikes.hamburg.push(success.data.bikes[i]); break;
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
