'use strict';

angular.module('footer').component('footer', {
  templateUrl: 'modules/footer/footer.template.html',
  controllerAs: 'footer',
  controller: [
    '$translate',
    function FooterController($translate) {
      var footer = this;
      footer.language = 'en';
  
      footer.switchLanguage = function switchLanguage() {
        $translate.use(footer.language);
      }
    }
  ]
});