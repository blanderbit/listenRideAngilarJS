'use strict';

angular.module('footer').component('footer', {
  templateUrl: 'app/modules/footer/footer.template.html',
  controllerAs: 'footer',
  controller: [
    '$translate',
    function FooterController($translate) {
      var footer = this;

      footer.language = getLanguage($translate.use());

      footer.switchLanguage = function(locale) {
        $translate.use(locale).then(function(data) {
          footer.language = getLanguage(locale);
          document.querySelector("md-content").scrollTop = 0;
        });
      }

      function getLanguage(locale) {
        if (locale === 'en') {
          return footer.language = 'English';
        } else if (locale === 'de') {
          return footer.language = 'Deutsch';
        } else {
          return footer.language = 'Deutsch';
        }
      }
    }
  ]
});