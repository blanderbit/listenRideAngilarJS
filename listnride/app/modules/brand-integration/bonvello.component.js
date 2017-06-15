'use strict';

angular.module('bonvello-integration',[]).component('bonvello', {
  templateUrl: 'app/modules/brand-integration/bonvello.template.html',
  controllerAs: 'bonvello',
  controller: [ '$translate', 'api', 'ngMeta',
    function BonvelloController($translate, api, ngMeta) {
      var bonvello = this;

      ngMeta.setTitle($translate.instant("brand-integration.bonvello.meta-title"));
      ngMeta.setTag("description", $translate.instant("brand-integration.bonvello.meta-descr"));

      bonvello.bikes = [];

      bonvello.slickConfig = {
        enabled: true,
        autoplay: true,
        draggable: true,
        autoplaySpeed: 12000,
        ease: 'ease-in-out',
        speed: '500',
        prevArrow: "<img class='testimonials-prev-arrow slick-prev' src='app/assets/ui_images/back.png'>",
        nextArrow: "<img class='testimonials-prev-arrow slick-next' src='app/assets/ui_images/next.png'>"
      };

      $translate('shared.from-place').then(function(translation) {
        bonvello.testimonials = [
          {text: $translate.instant("brand-integration.bonvello.testimonial-1")},
          {text: $translate.instant("brand-integration.bonvello.testimonial-2")},
          {text: $translate.instant("brand-integration.bonvello.testimonial-3")}
        ];
      });

      api.get('/rides?family=17').then(
        function (success) {
          bonvello.bikes = success.data;
        },
        function (error) {
          console.log('Error fetching Bikes');
        }
      );

      bonvello.showBikesIn = function(city) {
        bonvello.currentCity = $translate.instant("shared." + city);
        bonvello.currentBikes = bonvello.bikes[city];
      }

    }
  ]
});
