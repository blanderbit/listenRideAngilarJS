'use strict';

angular.module('mcbw',[]).component('mcbw', {
  templateUrl: 'app/modules/events/mcbw/mcbw.template.html',
  controllerAs: 'mcbw',
  controller: [ 'api',
    function AmplerController(api) {
      var mcbw = this;

      mcbw.bikes1 = [];
      mcbw.bikes2 = [];
      mcbw.bikes3 = [];
      mcbw.bikes4 = [];

      mcbw.mapOptions = {
        lat: 48.1574300,
        lng: 11.5754900,
        zoom: 12,
        radius: 500
      };

      api.get('/rides?family=9').then(
        function (success) {
          console.log(success.data);

          for (var i=0; i<success.data.length; i++) {
            if (success.data[i].city == "Berlin") {
              mcbw.bikes1.push(success.data[i]);
              mcbw.bikes2.push(success.data[i]);
              mcbw.bikes3.push(success.data[i]);
              mcbw.bikes4.push(success.data[i]);
            }
            else {
              mcbw.bikes1.push(success.data[i]);
              mcbw.bikes2.push(success.data[i]);
              mcbw.bikes3.push(success.data[i]);
              mcbw.bikes4.push(success.data[i]);
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