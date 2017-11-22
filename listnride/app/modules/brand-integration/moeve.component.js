'use strict';

angular.module('moeveIntegration',[]).component('moeve', {
  templateUrl: 'app/modules/brand-integration/moeve.template.html',
  controllerAs: 'moeve',
  controller: [ '$translate', '$translatePartialLoader', 'api', 'ngMeta',
    function MoeveController($translate, $tpl, api, ngMeta) {
      var moeve = this;
      $tpl.addPart('static');
      ngMeta.setTitle($translate.instant("brand-integration.moeve.meta-title"));
      ngMeta.setTag("description", $translate.instant("brand-integration.moeve.meta-descr"));

      moeve.currentBikes = [];
      $translate(["shared.munich"]).then(
        function (translations) {
          moeve.currentCity = translations["shared.munich"];
        }
      );
      moeve.bikes = {
        munich: [],
        amsterdam: []
      };
      moeve.slickConfig = {
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
        moeve.testimonials = [
          {
            userId: 1938,
            userName: "Robert " + translation + " Dresden",
            userImagePath: "app/assets/ui_images/brand-integration/ampler_testimonial_1.jpg",
            text: "Geiles, schnelles Bike. Ging ab wie Schmidts Katze. Übergabe verlief völlig unkompliziert und sehr nett."
          },
          {
            userId: 1739,
            userName: "Cornelia " + translation + " Binningen",
            userImagePath: "app/assets/ui_images/brand-integration/ampler_testimonial_2.jpg",
            text: "Sehr unkomplizierte und angenehme Art. Es hat alles bestens geklappt. Das Ampler fährt sich sehr gut, freuen uns auf das nächste Mal."
          },
          {
            userId: 1775,
            userName: "Marek " + translation + " Berlin",
            userImagePath: "app/assets/ui_images/brand-integration/ampler_testimonial_3.jpg",
            text: "ein sehr geiles Bike und eine krasse Erfahrung, das erste Mal ein Ebike zu fahren. könnte mir sogar vorstellen sowas zu kaufen :)"
          },
          {
            userId: 1727,
            userName: "Thomas " + translation + " Münster",
            userImagePath: "app/assets/ui_images/brand-integration/ampler_testimonial_4.jpg",
            text: "Hat alles gepasst! ein sehr schönes Rad und ein Vergnügen zum Fahren. Kann es jeder sehr empfehlen mal zu Probefahren, macht wirklich Spaß ;)"
          }
        ];
      });

      api.get('/rides?family=25').then(
        function (success) {
          console.log(success.data);

          for (var i=0; i<success.data.length; i++) {
            switch (success.data[i].city) {
              case "Munich": moeve.bikes.munich.push(success.data[i]); break;
              case "Amsterdam": moeve.bikes.amsterdam.push(success.data[i]); break;
            }
          }
          moeve.currentBikes = moeve.bikes["munich"];
        },
        function (error) {
          console.log('Error fetching Bikes');
        }
      );

      moeve.showBikesIn = function(city) {
        moeve.currentCity = $translate.instant("shared." + city);
        moeve.currentBikes = moeve.bikes[city];
      }

    }
  ]
});
