'use strict';

angular.module('bike').component('bike', {
  templateUrl: 'modules/bike/bike.template.html',
  controllerAs: 'bike',
  controller: ['api', '$stateParams', 'uiGmapGoogleMapApi',
    function BikeController(api, $stateParams, uiGmapGoogleMapApi) {
      var bike = this;

      bike.map = {
          // center: { latitude: bike.data.lat_rnd, longitude: bike.data.lng_rnd },
          center: { latitude: 0, longitude: 0 },
          zoom: 12,
          options: {
            scrollwheel: false
          },
          markers: []
      };
      

      uiGmapGoogleMapApi.then(function(maps) {
          // console.log(maps);
      });

      api.get('/rides/' + $stateParams.bikeId).then(function success(response) {
        console.log("Successfully retrieved Bike");
        bike.data = response.data;
        console.log(bike);
        console.log(bike.data.image_file_1.image_file_1.large.url);

        bike.map.center = {
          latitude: bike.data.lat_rnd,
          longitude: bike.data.lng_rnd
        }
        
      }, function error() {
        console.log("Error retrieving User");
      })
    }
  ]
});