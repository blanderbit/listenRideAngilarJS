'use strict';

angular.module('brand-integration',[]).component('ampler', {
  templateUrl: 'app/modules/brand-integration/ampler.template.html',
  controllerAs: 'ampler',
  controller: [ '$translate', 'api',
    function AmplerController($translate, api) {
      var ampler = this;

      ampler.currentBikes = [];
      ampler.currentCity = $translate.instant("brand-integration.ampler.choose-location");
      $translate(["brand-integration.ampler.choose-location"]).then(
        function (translations) {
          ampler.currentCity = translations["brand-integration.ampler.choose-location"];
        }
      );
      ampler.bikes = {
        berlin: [],
        munich: [],
        hamburg: [],
        vienna: []
      };

      api.get('/rides?family=8').then(
        function (success) {
          console.log(success.data);

          for (var i=0; i<success.data.length; i++) {
            switch (success.data[i].city) {
              case "Berlin": ampler.bikes.berlin.push(success.data[i]); break;
              case "München": ampler.bikes.munich.push(success.data[i]); break;
              case "Hamburg": ampler.bikes.hamburg.push(success.data[i]); break;
              case "Wien": ampler.bikes.vienna.push(success.data[i]); break;
            }
          }
          ampler.currentBikes = ampler.bikes["berlin"];
        },
        function (error) {
          console.log('Error fetching Bikes');
        }
      );

      ampler.showBikesIn = function(city) {
        ampler.currentCity = $translate.instant("shared." + city);
        ampler.currentBikes = ampler.bikes[city];
      }

    }
  ]
});