'use strict';

angular.module('ampler-integration',[]).component('ampler', {
  templateUrl: 'app/modules/brand-integration/ampler.template.html',
  controllerAs: 'ampler',
  controller: [ '$translate', 'api',
    function AmplerController($translate, api) {
      var ampler = this;

      console.log("launching ctrl");

      ampler.currentBikes = [];
      $translate(["shared.berlin"]).then(
        function (translations) {
          ampler.currentCity = translations["shared.berlin"];
        }
      );
      ampler.bikes = {
        berlin: [],
        munich: [],
        hamburg: [],
        vienna: [],
        zurich: []
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
              case "Zürich": ampler.bikes.zurich.push(success.data[i]); break;
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