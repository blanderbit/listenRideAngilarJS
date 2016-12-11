'use strict';

angular.module('brand-integration',[]).component('ampler', {
  templateUrl: 'app/modules/brand-integration/ampler.template.html',
  controllerAs: 'ampler',
  controller: [ 'api',
    function AmplerController(api) {
      var ampler = this;

      ampler.bikesBerlin = [];
      ampler.bikesMunich = [];

      api.get('/rides?family=8').then(
        function (success) {
          console.log(success.data);

          for (var i=0; i<success.data.length; i++) {
            if (success.data[i].city == "Berlin") {
              ampler.bikesBerlin.push(success.data[i]);
            }
            else {
              ampler.bikesMunich.push(success.data[i]);
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