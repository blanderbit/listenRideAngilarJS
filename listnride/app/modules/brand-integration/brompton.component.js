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
        dortmund: [],
        dusseldorf: [],
        frankfurt: [],
        freiburg: [],
        heidelberg: [],
        marl: [],
        munich: [],
        paderborn: [],
        tubingen: [],
        ulm: [],
        utting: []
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
              case "Dortmund": brompton.bikes.dortmund.push(success.data[i]); break;
              case "Düsseldorf": brompton.bikes.dusseldorf.push(success.data[i]); break;
              case "Frankfurt": brompton.bikes.frankfurt.push(success.data[i]); break;
              case "Freiburg": brompton.bikes.freiburg.push(success.data[i]); break;
              case "Heidelberg": brompton.bikes.heidelberg.push(success.data[i]); break;
              case "Marl": brompton.bikes.marl.push(success[i]); break;
              case "München": brompton.bikes.munich.push(success.data[i]); break;
              case "Paderborn": brompton.bikes.paderborn.push(success.data[i]); break;
              case "Tübingen": brompton.bikes.tubingen.push(success.data[i]); break;
              case "Ulm": brompton.bikes.ulm.push(success.data[i]); break;
              case "Utting": brompton.bikes.utting.push(success.data[i]); break;
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
