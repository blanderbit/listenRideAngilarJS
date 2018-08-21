'use strict';

angular.module('faq', []).component('faq', {
  templateUrl: 'app/modules/faq/faq.template.html',
  controllerAs: 'faq',
  controller: ['$state',
    function FaqController($state) {
      var faq = this;

      faq.$onInit = function() {
        // variables
        faq.groupsCount = 8;

        // methods
        faq.groupChange = groupChange;
      }

      function groupChange(index) {
        for (var i = 0; i < faq.groupsCount; i++) {

        }
      }

    }
  ]
});