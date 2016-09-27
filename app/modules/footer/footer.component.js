'use strict';

angular.module('footer').component('footer', {
  templateUrl: 'app/modules/footer/footer.template.html',
  controllerAs: 'footer',
  controller: [
    '$translate',
    function FooterController($translate) {
      var footer = this;
      footer.locale = 'en';
      footer.language = "English";

      // This function may be written in a better way (considering event passing and ng-models)
      footer.switchLanguage = function(locale, language) {
        $translate.use(locale).then(function(data) {
          footer.language = language;
          document.querySelector("md-content").scrollTop = 0;
        });
      }
    }
  ]
});