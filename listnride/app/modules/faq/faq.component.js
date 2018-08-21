'use strict';

angular.module('faq', []).component('faq', {
  templateUrl: 'app/modules/faq/faq.template.html',
  controllerAs: 'faq',
  controller: ['$state', '$translate',
    function FaqController($state, $translate) {
      var faq = this;

      faq.$onInit = function() {
        // variables
        faq.data = [];
        faq.activeGroupIndex = 1;

        // methods
        faq.groupChange = groupChange;
        faq.getData = getData;
        faq.iterateNumber = iterateNumber;

        // invocations
        faq.getData();
      }

      function getData() {
        // TODO: do server request from Admin Panel

        faq.data = [
          {
            title: 'help-and-service.faq.group-1.title',
            icon: 'app/assets/ui_icons/help/1_getting-started-01.svg',
            questionsCount: 4
          },
          {
            title: 'help-and-service.faq.group-2.title',
            icon: 'app/assets/ui_icons/help/2_renting-out-01.svg',
            questionsCount: 3
          },
          {
            title: 'help-and-service.faq.group-3.title',
            icon: 'app/assets/ui_icons/help/3_renting-01.svg',
            questionsCount: 2
          },
          {
            title: 'help-and-service.faq.group-4.title',
            icon: 'app/assets/ui_icons/help/4_payments-01.svg',
            questionsCount: 5
          },
          {
            title: 'help-and-service.faq.group-5.title',
            icon: 'app/assets/ui_icons/help/5_insurance-01.svg',
            questionsCount: 8
          },
          {
            title: 'help-and-service.faq.group-6.title',
            icon: 'app/assets/ui_icons/help/6_booking-01.svg',
            questionsCount: 2
          },
          {
            title: 'help-and-service.faq.group-7.title',
            icon: 'app/assets/ui_icons/help/7_vouchers-01.svg',
            questionsCount: 1
          },
          {
            title: 'help-and-service.faq.group-8.title',
            icon: 'app/assets/ui_icons/help/8_ratings-01.svg',
            questionsCount: 2
          }
        ]
      }

      function iterateNumber(num) {
        return new Array(num);
      }

      function groupChange(index) {
        console.log('1');
        faq.activeGroupIndex = index;
      }

    }
  ]
});