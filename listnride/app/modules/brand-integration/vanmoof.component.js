'use strict';

angular.module('vanmoofIntegration',[]).component('vanmoof', {
  templateUrl: 'app/modules/brand-integration/vanmoof.template.html',
  controllerAs: 'vanmoof',
  controller: [ '$translate', 'api', 'ngMeta',
    function VanmoofController($translate, api, ngMeta) {
      var vanmoof = this;
      ngMeta.setTitle($translate.instant("brand-integration.vanmoof.meta-title"));
      ngMeta.setTag("description", $translate.instant("brand-integration.vanmoof.meta-descr"));

      vanmoof.currentBikes = [];
      $translate(["shared.berlin"]).then(
        function (translations) {
          vanmoof.currentCity = translations["shared.berlin"];
        }
      );
      vanmoof.bikes = {
        berlin: [],
        munich: [],
        hamburg: []
      };
      vanmoof.slickConfig = {
        enabled: true,
        autoplay: true,
        draggable: true,
        autoplaySpeed: 12000,
        ease: 'ease-in-out',
        speed: '500',
        prevArrow: "<img class='testimonials-prev-arrow slick-prev' src='app/assets/ui_images/back.png'>",
        nextArrow: "<img class='testimonials-prev-arrow slick-next' src='app/assets/ui_images/next.png'>"
      };

      api.get('/rides?family=26').then(
        function (success) {
          console.log(success.data);

          for (var i=0; i<success.data.length; i++) {
            switch (success.data[i].city) {
              case "Berlin": vanmoof.bikes.berlin.push(success.data[i]); break;
              case "München": vanmoof.bikes.munich.push(success.data[i]); break;
              case "Hamburg": vanmoof.bikes.hamburg.push(success.data[i]); break;
            }
          }
          vanmoof.currentBikes = vanmoof.bikes["berlin"];
        },
        function (error) {
          console.log('Error fetching Bikes');
        }
      );

      vanmoof.showBikesIn = function(city) {
        vanmoof.currentCity = $translate.instant("shared." + city);
        vanmoof.currentBikes = vanmoof.bikes[city];
      }

    }
  ]
});
