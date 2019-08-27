'use strict';

angular.module('footer',['pascalprecht.translate']).component('footer', {
  templateUrl: 'app/modules/footer/footer.template.html',
  controllerAs: 'footer',
  controller: [
    '$scope',
    '$window',
    '$location',
    '$localStorage',
    '$translate',
    '$stateParams',
    function FooterController($scope, $window, $location, $localStorage, $translate, $stateParams) {
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

      footer.language = getLanguage($translate.preferredLanguage());

      // switch url based on language
      footer.switchDomain = function (language) {
        var url = window.location.host.split('.'), route = window.location.pathname, root = '';
        // using localhost
        if (url.indexOf("localhost") >= 0 || url[0].match('localhost')) {
          $scope.$emit('$translatePartialLoaderStructureChanged');
          $window.location.reload();
        }
        // staging or production
        else {
          url.splice(-1).join('.');
          if (language == 'nl' || language == 'de' || language == 'it' || language == 'es' || language == 'fr') {
            url = url.join('.');
            root = [url, language].join('.');
            window.location = 'https://' + root + route;
          } else {
            url = url.join('.');
            root = [url, 'com'].join('.');
            window.location = 'https://' + root + route;
          }
        }
      };

      // switch url based on language
      footer.switchLanguage = function (locale) {
        // save language in local storage
        // switch to correct language specific domain
        $localStorage.selectedLanguage = locale;
        footer.switchDomain($localStorage.selectedLanguage);
      };

      footer.onAppClick = function() {
        $window.open('https://itunes.apple.com/de/app/list-n-ride/id992114091?l=' + $translate.use(), '_blank');
      };

      footer.year = moment().year();

      function getLanguage(locale) {
        switch (locale) {
          case 'de': return 'footer.languages.german';
          case 'nl': return 'footer.languages.dutch';
          case 'it': return 'footer.languages.italian';
          case 'es': return 'footer.languages.spanish';
          case 'fr': return 'footer.languages.french';
          case 'en':
          default: return 'footer.languages.english';
        }
      }
    }
  ]
});
