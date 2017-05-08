'use strict';

angular.module('muli-integration',[]).component('muli', {
  templateUrl: 'app/modules/brand-integration/muli.template.html',
  controllerAs: 'muli',
  controller: [ '$translate', 'api',
    function MuliController($translate, api) {
      var muli = this;

      muli.test = "blablbalba"

      muli.bikes = {
        berlin: [],
        munich: []
      };

      api.get('/rides?family=14').then(
        function (success) {
          console.log(success.data);

          for (var i=0; i<success.data.length; i++) {
            switch (success.data[i].city) {
              case "Berlin": muli.bikes.berlin.push(success.data[i]); break;
              case "München": muli.bikes.munich.push(success.data[i]); break;
            }
          }

          console.log(muli.bikes);
        },
        function (error) {
          console.log('Error fetching Bikes');
        }
      );
    }
  ]
});