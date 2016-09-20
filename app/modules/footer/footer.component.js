'use strict';

angular.module('footer').component('footer', {
  templateUrl: 'modules/footer/footer.template.html',
  controllerAs: 'footer',
  controller: [
    '$translate',
    function FooterController($translate) {
      var footer = this;
      footer.locale = 'en';
      footer.language = "English";
  
      // footer.switchLanguage = function switchLanguage() {
      //   $translate.use(footer.locale);
      // }

      // This function may be written in a better way (considering event passing and ng-models)
      footer.switchLanguage = function(locale, language) {
        $translate.use(locale);
        footer.language = language;
        document.querySelector("md-content#main").scrollTop = 0;
      }
    }
  ]
});