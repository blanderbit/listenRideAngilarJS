'use strict';

angular.module('footer',['pascalprecht.translate']).component('footer', {
  templateUrl: 'app/modules/footer/footer.template.html',
  controllerAs: 'footer',
  controller: [
    '$scope', '$window', '$location', '$translate', '$stateParams', '$localStorage',
    function FooterController($scope, $window, $location, $translate, $stateParams, $localStorage) {
      var footer = this;

      footer.hideFooter = $stateParams.hideFooter;

      $scope.$watch(
        function() { return $stateParams.hideFooter; },
        function(newValue, oldValue) {
          if ( newValue !== oldValue ) {
            footer.hideFooter = newValue;
          }
        }
      );

      var url = "";
      var host = $location.host().split('.');
      if (host[host.length - 1] === "localhost") {
        url = "localhost:8080/#";
      } else {
        for (var i = 1; i < host.length; i ++) {
          url += host[i];
          if (i < host.length - 1) {
            url += ".";
          }
        }
      }

      footer.language = getLanguage($translate.use());

      footer.switchLanguage = function (locale) {
        // update the language
        $translate.use(locale).then(function () {
          // save in local storage
          $localStorage.selectedLanguage = locale;
          footer.language = getLanguage(locale);
        });
      };

      footer.onAppClick = function() {
        $window.open('https://itunes.apple.com/de/app/list-n-ride/id992114091?l=' + $translate.use(), '_blank');
      };

      footer.year = moment().year();

      function getLanguage(locale) {
        if (locale === 'en') {
          return 'English';
        } else if (locale === 'de') {
          return 'Deutsch';
        } else if (locale === 'nl') {
          return 'Nederlands';
        } else {
          return 'English';
        }
      }
    }
  ]
});
