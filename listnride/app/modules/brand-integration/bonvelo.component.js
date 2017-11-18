'use strict';

angular.module('bonvelo-integration',[]).component('bonvelo', {
  templateUrl: 'app/modules/brand-integration/bonvelo.template.html',
  controllerAs: 'bonvelo',
  controller: [ '$translate', '$translatePartialLoader', 'api', 'ngMeta',
    function BonveloController($translate, $tpl, api, ngMeta) {
      var bonvelo = this;
      $tpl.addPart('static');
      ngMeta.setTitle($translate.instant("brand-integration.bonvelo.meta-title"));
      ngMeta.setTag("description", $translate.instant("brand-integration.bonvelo.meta-description"));

      bonvelo.bikes = [];

      bonvelo.slickConfig = {
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
        bonvelo.testimonials = [
          {text: $translate.instant("brand-integration.bonvelo.testimonial-1")},
          {text: $translate.instant("brand-integration.bonvelo.testimonial-2")},
          {text: $translate.instant("brand-integration.bonvelo.testimonial-3")}
        ];
      });

      api.get('/rides?family=17').then(
        function (success) {
          bonvelo.bikes = success.data;
        },
        function (error) {
          console.log('Error fetching Bikes');
        }
      );
    }
  ]
});
