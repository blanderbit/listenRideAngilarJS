'use strict';

angular.module('leaosIntegration', []).component('leaos', {
  templateUrl: 'app/modules/brand-integration/leaos.template.html',
  controllerAs: 'leaos',
  controller: ['$translatePartialLoader', 'api', 'ENV', 'ngMeta',
    function LeaosController($tpl, api, ENV, ngMeta) {
      var leaos = this;
      $tpl.addPart(ENV.staticTranslation);
      // Open Graph Image
      ngMeta.setTag("og:image", 'https://www.listnride.com/app/assets/ui_images/brand-integration/leaos/lnr_opengraph_leaos.jpg');

      leaos.$onInit = function() {
        // METHODS
        leaos.splitFaq = splitFaq;
        leaos.getBikes = getBikes;

        // VARIABLES
        leaos.familyId = 8;

        // hero slider
        leaos.cbSlider = [
          'app/assets/ui_images/brand-integration/leaos/lnr_leaos_hero1.jpg',
          'app/assets/ui_images/brand-integration/leaos/lnr_leaos_hero2.jpg',
          'app/assets/ui_images/brand-integration/leaos/lnr_leaos_hero3.jpg',
          'app/assets/ui_images/brand-integration/leaos/lnr_leaos_hero4.jpg',
        ];
        // FAQ keys
        leaos.faqs = [
          {
            question: 'brand-integration.leaos.faq-question-1',
            answer: 'brand-integration.leaos.faq-question-1',
          },
          {
            question: 'brand-integration.leaos.faq-question-2',
            answer: 'brand-integration.leaos.faq-question-2',
          },
          {
            question: 'brand-integration.leaos.faq-question-3',
            answer: 'brand-integration.leaos.faq-question-3',
          },
          {
            question: 'brand-integration.leaos.faq-question-4',
            answer: 'brand-integration.leaos.faq-question-4',
          },
          {
            question: 'brand-integration.leaos.faq-question-5',
            answer: 'brand-integration.leaos.faq-question-5',
          }
        ];

        // GROUPED BIKES
        // TODO: Move to Admin panel
        leaos.shops = {
          'munich': {
            cityLangKey: 'shared.munich',
            bikes: [],
            bikeIds: [9329, 9328]
          },
          'bolzano': {
            cityLangKey: 'shared.bolzano',
            bikes: [],
            bikeIds: [9323, 9322]
          },
          'dusseldorf': {
            cityLangKey: 'shared.dusseldorf',
            bikes: [],
            bikeIds: [9446, 9447]
          }
        };
        // set default shop
        leaos.currentShop = leaos.shops['munich'];

        // invocations
        leaos.splitFaq();
        leaos.getBikes();
      }

      // TODO: find better way to split FAQ via html,css
      function splitFaq() {
          var col1 = [];
          var col2 = [];

        for (var i = 0; i < leaos.faqs.length; i++) {
          if ((i + 2) % 2) {
            col1.push(leaos.faqs[i]);
          } else {
            col2.push(leaos.faqs[i]);
          }
        }

        return leaos.faqs = [col1, col2];
      }

      function getBikes() {
        api.get('/rides?family=' + leaos.familyId).then(
          function (success) {
            // TODO: move this Logic to Admin Panel
            _.forEach(success.data.bikes, function(bike){
              _.forEach(leaos.shops, function(shop){
                if (_.includes(shop.bikeIds, bike.id)) shop.bikes.push(bike);
              });
            });
          },
          function (error) {
            // TODO: Show message 'NO BIKES FOUND'
          }
        );
      }

    }
  ]
});
