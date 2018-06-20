'use strict';

angular.module('cocomatIntegration',[]).component('cocomat', {
  templateUrl: 'app/modules/brand-integration/cocomat.template.html',
  controllerAs: 'cocomat',
  controller: [ '$translate', '$translatePartialLoader', 'api', 'ENV',
    function CocomatController($translate, $tpl, api, ENV) {
      var cocomat = this;
      $tpl.addPart(ENV.staticTranslation);

      cocomat.currentBikes = [];
      cocomat.shops = {
        6059: {
          name: "Coco-Mat Hotel Kolonaki",
          bikes: []
        },
        6061: {
          name: "Hotel Coco-mat Nafsika",
          bikes: []
        },
        6063: {
          name: "Coco-mat Alimo",
          bikes: []
        },
        6064: {
          name: "Coco-mat Store Kalamaki",
          bikes: []
        },
        6065: {
          name: "Coco-mat Store Voula",
          bikes: []
        },
        6066: {
          name: "Coco-mat Store - Zea's Marina",
          bikes: []
        }
      };

      api.get('/rides?family=32').then(
        function (success) {
          for (var i=0; i<success.data.bikes.length; i++) {
            cocomat.shops[success.data.bikes[i].user_id].bikes.push(success.data.bikes[i]);
          }
        },
        function (error) {
          console.log('Error fetching Bikes');
        }
      );

      cocomat.showBikesIn = function(shopId) {
        console.log(shopId);
        // cocomat.currentCity = cocomat.shops[shopId].name;
        // cocomat.currentBikes = cocomat.shops[shopId].bikes;
      }
    }

  ]
});
