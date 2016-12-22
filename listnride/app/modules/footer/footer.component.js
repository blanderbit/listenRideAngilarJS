'use strict';

angular.module('footer',['pascalprecht.translate']).component('footer', {
  templateUrl: 'app/modules/footer/footer.template.html',
  controllerAs: 'footer',
  controller: [
    '$window', '$location', '$translate', '$state',
    function FooterController($window, $location, $translate, $state) {
      var footer = this;

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

      footer.switchLanguage = function(locale) {
        // $translate.use(locale).then(function(data) {
        //   footer.language = getLanguage(locale);
        //   $state.reload();
        // });
        $window.location.href = 'http://' + locale + "." + url + $location.path();
      }
      
      footer.onAppClick = function() {
        $window.open('https://itunes.apple.com/de/app/list-n-ride/id992114091?l=' + $translate.use(), '_blank');
      }

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