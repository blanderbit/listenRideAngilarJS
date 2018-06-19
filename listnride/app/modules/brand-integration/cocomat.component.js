'use strict';

angular.module('cocomatIntegration',[]).component('cocomat', {
  templateUrl: 'app/modules/brand-integration/cocomat.template.html',
  controllerAs: 'cocomat',
  controller: [ '$translate', '$translatePartialLoader', 'api', 'ENV',
    function CocomatController($translate, $tpl, api, ENV) {
      var cocomat = this;
      $tpl.addPart(ENV.staticTranslation);

      cocomat.currentBikes = [];
      cocomat.bikes = {
        athina: [],
        alimos: [],
        kifisia: [],
        pireas: []
      };

      api.get('/rides?family=31').then(
        function (success) {
          for (var i=0; i<success.data.bikes.length; i++) {
            switch (success.data.bikes[i].city) {
              case "Athina": cocomat.bikes.athina.push(success.data.bikes[i]); break;
              case "Alimos": cocomat.bikes.alimos.push(success.data.bikes[i]); break;
              case "Kifisia": cocomat.bikes.kifisia.push(success.data.bikes[i]); break;
              case "Kifisia": cocomat.bikes.kifisia.push(success.data.bikes[i]); break;
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
