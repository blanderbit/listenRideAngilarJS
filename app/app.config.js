'use strict';

angular.
  module('listnride').
  config(function(
    $translateProvider,
    ezfbProvider,
    $mdAriaProvider,
    $locationProvider) {

    $mdAriaProvider.disableWarnings();

    ezfbProvider.setInitParams({
      appId: '895499350535682',
  
      // Module default is `v2.6`.
      // If you want to use Facebook platform `v2.3`, you'll have to add the following parameter.
      // https://developers.facebook.com/docs/javascript/reference/FB.init
      version: 'v2.3'
    });

    // $locationProvider.html5Mode(true);

    $translateProvider.useStaticFilesLoader({
      prefix: 'app/i18n/',
      suffix: '.json'
    });

    var browserLanguage = $translateProvider.resolveClientLocale();
    var defaultLanguage = "en";
    var availableLanguages = ["de", "en"];
    var language;

    if (browserLanguage != undefined && browserLanguage.length >= 2) {
      browserLanguage = browserLanguage.substring(0,2);
    }

    if (availableLanguages.indexOf(browserLanguage) >= 0) {
      language = browserLanguage;
    } else {
      language = defaultLanguage;
    }

    $translateProvider.preferredLanguage(language);
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');

  });
