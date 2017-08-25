'use strict';

angular.module('motoparilla-integration',[]).component('motoparilla', {
  templateUrl: 'app/modules/brand-integration/motoparilla.template.html',
  controllerAs: 'motoparilla',
  controller: [ '$translate', '$analytics', 'api', 'ngMeta',
    function MotoparillaController($translate, $analytics, api, ngMeta) {
      var motoparilla = this;
      $analytics.eventTrack('Brand Page', {  category: 'ViewContent', label: 'Motoparilla'});

      ngMeta.setTitle($translate.instant("brand-integration.motoparilla.meta-title"));
      ngMeta.setTag("description", $translate.instant("brand-integration.motoparilla.meta-description"));

      motoparilla.bikes = [];

      motoparilla.slickConfig = {
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
        motoparilla.testimonials = [
          {text: $translate.instant("brand-integration.motoparilla.testimonial-1")},
          {text: $translate.instant("brand-integration.motoparilla.testimonial-2")},
          {text: $translate.instant("brand-integration.motoparilla.testimonial-3")}
        ];
      });

      api.get('/rides?family=19').then(
        function (success) {
          motoparilla.bikes = success.data;
        },
        function (error) {
          console.log('Error fetching Bikes');
        }
      );
    }
  ]
});
