'use strict';

angular.module('brand-integration',[]).component('ampler', {
  templateUrl: 'app/modules/brand-integration/ampler.template.html',
  controllerAs: 'ampler',
  controller: [ 'api',
    function AmplerController(api) {
      var ampler = this;

      ampler.currentBikes = [];
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
          ampler.currentBikes = success.data;
        },
        function (error) {
          console.log('Error fetching Bikes');
        }
      );

      ampler.switchCity = function(city) {
        ampler.currentBikes = ampler.bikes[city];
      }

    }
  ]
});