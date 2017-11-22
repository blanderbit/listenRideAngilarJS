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

      footer.language = getLanguage($translate.use());

      // switch url based on language
      footer.switchDomain = function (language) {
        var url = window.location.host.split('.'), route = window.location.pathname, root = '';
        // using localhost
        if (url.indexOf("localhost") >= 0) {
          if (language == 'nl' || language == 'de') {
            root = ['www.listnride', language].join('.');
            window.location = 'https://' + root + route;
          } else {
            root = "https://www.listnride.com";
            window.location = root + route;
          }
        }
        // staging or production
        else {
          url.splice(-1).join('.');
          if (language == 'nl' || language == 'de') {
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
        // update the language
        $translate.use(locale).then(function () {
          // save in local storage
          $localStorage.selectedLanguage = locale;
          footer.switchDomain($localStorage.selectedLanguage);
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
        } else if (locale === 'it') {
          return 'Italiano';
        } else {
          return 'English';
        }
      }
    }
  ]
});
