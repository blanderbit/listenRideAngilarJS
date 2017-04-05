'use strict';

angular.module('brand-integration',[]).component('ampler', {
  templateUrl: 'app/modules/brand-integration/ampler.template.html',
  controllerAs: 'ampler',
  controller: [ 'api',
    function AmplerController(api) {
      var ampler = this;

      ampler.bikesBerlin = [];
      ampler.bikesMunich = [];
      ampler.bikesHamburg = [];
      ampler.bikesVienna = [];

      api.get('/rides?family=8').then(
        function (success) {
          console.log(success.data);

          for (var i=0; i<success.data.length; i++) {
            switch (success.data[i].city) {
              case "Berlin": ampler.bikesBerlin.push(success.data[i]);
              case "Munich": ampler.bikesBerlin.push(success.data[i]);
              case "Hamburg": ampler.bikesHamburg.push(success.data[i]);
              case "Vienna": ampler.bikesVienna.push(success.data[i]);
            }
            // if (success.data[i].city == "Berlin") {
            //   ampler.bikesBerlin.push(success.data[i]);
            // }
            // else if (success.data[i].city{
            //   ampler.bikesMunich.push(success.data[i]);
            // }
          }
        },
        function (error) {
          console.log('Error fetching Bikes');
        }
      );

    }
  ]
});