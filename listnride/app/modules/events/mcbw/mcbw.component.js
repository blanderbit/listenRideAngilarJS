'use strict';

angular.module('mcbw',[]).component('mcbw', {
  templateUrl: 'app/modules/events/mcbw/mcbw.template.html',
  controllerAs: 'mcbw',
  controller: ['api', '$translatePartialLoader',
    function AmplerController(api, $tpl) {
      var mcbw = this;
      $tpl.addPart('static');
      mcbw.bikes1 = [];
      mcbw.bikes2 = [];

      mcbw.mapOptions = {
        lat: 48.1574300,
        lng: 11.5754900,
        zoom: 12,
        radius: 500
      };

      api.get('/rides?family=10').then(
        function (success) {
          var bikes = success.data;

          for (var i=0; i<bikes.length; i++) {
            if (bikes[i].id >= 621 && bikes[i].id <= 627) {
              mcbw.bikes1.push(bikes[i]);
            }
            else if (bikes[i].id >= 616 && bikes[i].id <= 620) {
              mcbw.bikes2.push(bikes[i]);
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
