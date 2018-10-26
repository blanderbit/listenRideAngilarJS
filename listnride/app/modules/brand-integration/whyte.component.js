'use strict';

angular.module('whyteIntegration', []).component('whyte', {
  templateUrl: 'app/modules/brand-integration/whyte.template.html',
  controllerAs: 'whyte',
  controller: ['$translatePartialLoader', 'api', 'ENV', 'ngMeta', 'notification',
    function WhyteController($tpl, api, ENV, ngMeta, notification) {
      var whyte = this;
      $tpl.addPart(ENV.staticTranslation);
      // Open Graph Image
      ngMeta.setTag("og:image", 'https://www.listnride.com/app/assets/ui_images/brand-integration/whyte/lnr_whyte_opengraph.jpg');

      whyte.$onInit = function () {
        // METHODS
        whyte.splitFaq = splitFaq;
        whyte.getBikes = getBikes;

        // VARIABLES
        // TODO: change on another familyId or create another request based on brands endpoint
        whyte.familyId = 34;

        // hero slider
        whyte.cbSlider = [
          'app/assets/ui_images/brand-integration/whyte/lnr_whyte_hero01.jpg',
          'app/assets/ui_images/brand-integration/whyte/lnr_whyte_hero02.jpg',
          'app/assets/ui_images/brand-integration/whyte/lnr_whyte_hero03.jpg',
        ];
        // FAQ keys
        whyte.faqs = [{
            question: 'brand-integration.whyte.faq-question-1',
            answer: 'brand-integration.whyte.faq-answer-1',
          },
          {
            question: 'brand-integration.whyte.faq-question-2',
            answer: 'brand-integration.whyte.faq-answer-2',
          },
          {
            question: 'brand-integration.whyte.faq-question-3',
            answer: 'brand-integration.whyte.faq-answer-3',
          },
          {
            question: 'brand-integration.whyte.faq-question-4',
            answer: 'brand-integration.whyte.faq-answer-4',
          },
          {
            question: 'brand-integration.whyte.faq-question-5',
            answer: 'brand-integration.whyte.faq-answer-5',
          },
          {
            question: 'brand-integration.whyte.faq-question-6',
            answer: 'brand-integration.whyte.faq-answer-6',
          }, {
            question: 'brand-integration.whyte.faq-question-7',
            answer: 'brand-integration.whyte.faq-answer-7',
          }, {
            question: 'brand-integration.whyte.faq-question-8',
            answer: 'brand-integration.whyte.faq-answer-8',
          }, {
            question: 'brand-integration.whyte.faq-question-9',
            answer: 'brand-integration.whyte.faq-answer-9',
          }, {
            question: 'brand-integration.whyte.faq-question-10',
            answer: 'brand-integration.whyte.faq-answer-10',
          }, {
            question: 'brand-integration.whyte.faq-question-11',
            answer: 'brand-integration.whyte.faq-answer-11',
          }, {
            question: 'brand-integration.whyte.faq-question-12',
            answer: 'brand-integration.whyte.faq-answer-12',
          }
        ];

        // GROUPED BIKES
        // TODO: Move to Admin panel
        whyte.cities = {};

        // invocations
        whyte.splitFaq();
        whyte.getBikes();
      }

      // TODO: find better way to split FAQ via html,css
      function splitFaq() {
        var col1 = [];
        var col2 = [];

        for (var i = 0; i < whyte.faqs.length; i++) {
          ((i + 2) % 2) ? col1.push(whyte.faqs[i]): col2.push(whyte.faqs[i]);
        }

        return whyte.faqs = [col1, col2];
      }

      function transformToKeys(str) {
        return str.replace(/\s+/g, '_').toLowerCase();;
      }

      function getBikes() {
        api.get('/rides?family=' + whyte.familyId).then(
          function (success) {
            _.forEach(success.data.bikes, function (bike) {
              if (!whyte.cities.hasOwnProperty(bike.city)) {
                whyte.cities[bike.city] = {
                  bikes: []
                };
              }
              whyte.cities[bike.city].bikes.push(bike);
              whyte.cities[bike.city].cityName = transformToKeys(bike.city);
            });
            whyte.currentShop = whyte.cities[Object.keys(whyte.cities)[0]];
          },
          function (error) {
            notification.show(error, 'error');
          }
        );
      }

    }
  ]
});