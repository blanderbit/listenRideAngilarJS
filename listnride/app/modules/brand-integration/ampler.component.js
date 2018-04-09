'use strict';

angular.module('ampler-integration',[]).component('ampler', {
  templateUrl: 'app/modules/brand-integration/ampler.template.html',
  controllerAs: 'ampler',
  controller: [ '$translate', '$translatePartialLoader', 'api', 'ENV',
    function AmplerController($translate, $tpl, api, ENV) {
      var ampler = this;
      $tpl.addPart(ENV.staticTranslation);

      ampler.currentBikes = [];
      $translate(["shared.berlin"]).then(
        function (translations) {
          ampler.currentCity = translations["shared.berlin"];
        }
      );
      ampler.bikes = {
        berlin: [],
        munich: [],
        hamburg: [],
        vienna: [],
        zurich: [],
        frankfurt: [],
        amsterdam: [],
        dusseldorf: []
      };
      ampler.slickConfig = {
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
        ampler.testimonials = [
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

      api.get('/rides?family=8').then(
        function (success) {
          console.log(success);
          for (var i=0; i<success.data.bikes.length; i++) {
            switch (success.data.bikes[i].city) {
              case "Berlin": ampler.bikes.berlin.push(success.data.bikes[i]); break;
              case "München": ampler.bikes.munich.push(success.data.bikes[i]); break;
              case "Hamburg": ampler.bikes.hamburg.push(success.data.bikes[i]); break;
              case "Wien": ampler.bikes.vienna.push(success.data.bikes[i]); break;
              case "Winterthur": ampler.bikes.zurich.push(success.data.bikes[i]); break; // Winterthur >> Zurich
              case "Zürich": ampler.bikes.zurich.push(success.data.bikes[i]); break;
              case "Frankfurt am Main": ampler.bikes.frankfurt.push(success.data.bikes[i]); break;
              case "Amsterdam": ampler.bikes.amsterdam.push(success.data.bikes[i]); break;
              case "Düsseldorf": ampler.bikes.dusseldorf.push(success.data.bikes[i]); break;
            }
          }
          console.log(ampler.bikes);
          ampler.currentBikes = ampler.bikes["berlin"];
        },
        function (error) {
        }
      );

      ampler.showBikesIn = function(city) {
        ampler.currentCity = $translate.instant("shared." + city);
        ampler.currentBikes = ampler.bikes[city];
      }

    }
  ]
});
