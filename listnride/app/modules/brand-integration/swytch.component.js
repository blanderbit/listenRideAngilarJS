'use strict';

angular.module('swytchIntegration', []).component('swytch', {
  templateUrl: 'app/modules/brand-integration/swytch.template.html',
  controllerAs: 'swytch',
  controller: ['$translatePartialLoader', 'api', 'ENV', 'ngMeta', 'notification',
    function SwytchController($tpl, api, ENV, ngMeta, notification) {
      var swytch = this;
      $tpl.addPart(ENV.staticTranslation);
      // Open Graph Image
      ngMeta.setTag("og:image", 'https://www.listnride.com/app/assets/ui_images/brand-integration/swytch/lnr_swytch_opengraph.jpg');

      swytch.$onInit = function() {
        // METHODS
        swytch.splitFaq = splitFaq;
        swytch.getBikes = getBikes;

        // VARIABLES
        swytch.familyId = 34;

        // hero slider
        swytch.cbSlider = [
          'app/assets/ui_images/brand-integration/swytch/lnr_swytch_hero01.jpg',
          'app/assets/ui_images/brand-integration/swytch/lnr_swytch_hero02.jpg',
          'app/assets/ui_images/brand-integration/swytch/lnr_swytch_hero03.jpg',
        ];
        // FAQ keys
        swytch.faqs = [
          {
            question: 'brand-integration.swytch.faq-question-1',
            answer: 'brand-integration.swytch.faq-answer-1',
          },
          {
            question: 'brand-integration.swytch.faq-question-2',
            answer: 'brand-integration.swytch.faq-answer-2',
          },
          {
            question: 'brand-integration.swytch.faq-question-3',
            answer: 'brand-integration.swytch.faq-answer-3',
          },
          {
            question: 'brand-integration.swytch.faq-question-4',
            answer: 'brand-integration.swytch.faq-answer-4',
          },
          {
            question: 'brand-integration.swytch.faq-question-5',
            answer: 'brand-integration.swytch.faq-answer-5',
          },
          {
            question: 'brand-integration.swytch.faq-question-6',
            answer: 'brand-integration.swytch.faq-answer-6',
          }, {
            question: 'brand-integration.swytch.faq-question-7',
            answer: 'brand-integration.swytch.faq-answer-7',
          }, {
            question: 'brand-integration.swytch.faq-question-8',
            answer: 'brand-integration.swytch.faq-answer-8',
          }, {
            question: 'brand-integration.swytch.faq-question-9',
            answer: 'brand-integration.swytch.faq-answer-9',
          }, {
            question: 'brand-integration.swytch.faq-question-10',
            answer: 'brand-integration.swytch.faq-answer-10',
          }, {
            question: 'brand-integration.swytch.faq-question-11',
            answer: 'brand-integration.swytch.faq-answer-11',
          }, {
            question: 'brand-integration.swytch.faq-question-12',
            answer: 'brand-integration.swytch.faq-answer-12',
          }
        ];

        // GROUPED BIKES
        // TODO: Move to Admin panel
        swytch.cities = {};

        // invocations
        swytch.splitFaq();
        swytch.getBikes();
      }

      // TODO: find better way to split FAQ via html,css
      function splitFaq() {
          var col1 = [];
          var col2 = [];

        for (var i = 0; i < swytch.faqs.length; i++) {
          ((i + 2) % 2) ? col1.push(swytch.faqs[i]): col2.push(swytch.faqs[i]);
        }

        return swytch.faqs = [col1, col2];
      }

      function transformToKeys(str){
        return str.replace(/\s+/g, '_').toLowerCase();;
      }

      function getBikes() {
        api.get('/rides?family=' + swytch.familyId).then(
          function (success) {
            _.forEach(success.data.bikes, function(bike){
              if (!swytch.cities.hasOwnProperty(bike.city)){
                swytch.cities[bike.city] = {
                  bikes:[]
                };
              }
              swytch.cities[bike.city].bikes.push(bike);
              swytch.cities[bike.city].cityName = transformToKeys(bike.city);
            });
            swytch.currentShop = swytch.cities[Object.keys(swytch.cities)[0]];
          },
          function (error) {
            notification.show(error, 'error');
          }
        );
      }

    }
  ]
});