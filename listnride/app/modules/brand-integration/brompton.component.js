'use strict';

angular.module('brompton-integration',[]).component('brompton', {
  templateUrl: 'app/modules/brand-integration/brompton.template.html',
  controllerAs: 'brompton',
  controller: [ '$translate', 'api', 'ngMeta',
    function BromptonController($translate, api, ngMeta) {

      ngMeta.setTitle($translate.instant("brand-integration.brompton.meta-title"));
      ngMeta.setTag("description", $translate.instant("brand-integration.brompton.meta-description"));

      var brompton = this;

      brompton.currentBikes = [];
      $translate(["shared.berlin"]).then(
        function (translations) {
          brompton.currentCity = translations["shared.berlin"];
        }
      );
      brompton.bikes = {
        berlin: [],
        munich: [],
        dusseldorf: [],
        ulm: []
      };

      brompton.mapOptions = {
        lat: 51.2167,
        lng: 9.9167,
        zoom: 6,
        radius: 500
      };

      // Family ID for Brompton Brand Bikes is 13
      api.get('/rides?family=13').then(
        function (success) {
          for (var i=0; i<success.data.length; i++) {
            switch (success.data[i].city) {
              case "Berlin": brompton.bikes.berlin.push(success.data[i]); break;
              case "München": brompton.bikes.munich.push(success.data[i]); break;
              case "Düsseldorf": brompton.bikes.dusseldorf.push(success.data[i]); break;
              case "Ulm": brompton.bikes.ulm.push(success.data[i]); break;
            }
          }
          brompton.currentBikes = brompton.bikes["berlin"];
        },
        function (error) {
          console.log('Error fetching Bikes');
        }
      );

      brompton.showBikesIn = function(city) {
        brompton.currentCity = $translate.instant("shared." + city);
        brompton.currentBikes = brompton.bikes[city];
      }

    }
  ]
});
