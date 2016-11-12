(function () {
  'use strict';
  angular.module('footer', ['pascalprecht.translate']).component('footer', {
    templateUrl: 'app/modules/footer/footer.template.html',
    controllerAs: 'footer',
    controller: [
      '$window', '$translate',
      function FooterController($window, $translate) {
        var footer = this;

        footer.language = getLanguage($translate.use());

        footer.switchLanguage = function (locale) {
          $translate.use(locale).then(function () {
            footer.language = getLanguage(locale);
            document.querySelector("md-content.single-column").scrollTop = 0;
          });
        };

        footer.onFacebookClick = function () {
          $window.open('https://www.facebook.com/Listnride', '_blank');
        };

        footer.onInstagramClick = function () {
          $window.open('https://instagram.com/listnride/', '_blank');
        };

        footer.onAppClick = function () {
          $window.open('https://itunes.apple.com/de/app/list-n-ride/id992114091?l=' + $translate.use(), '_blank');
        };

        function getLanguage(locale) {
          if (locale === 'en') {
            return 'English';
          } else if (locale === 'de') {
            return 'Deutsch';
          } else {
            return 'English';
          }
        };
      }
    ]
  });
})();