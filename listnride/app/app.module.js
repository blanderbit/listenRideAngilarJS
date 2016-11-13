(function(){
'use strict';
/*jshint -W097 */

angular.module('listnride', [
  /* internal modules */
	'header',
  'footer',
  'home',
  'search',
  'bikeCard',
  'user',
  'bike',
  'requests',
  'message',
  'list',
  'autocomplete',
  'listings',
  'listingCard',
  'edit',
  'rating',
  'settings',
  'listingABike',
  'raphaSuperCross',
  'static',
  /* external modules */
  'ngMaterial',
  'ngMessages',
  'pascalprecht.translate',
  'ui.router',
  'ngStorage',
  'ezfb',
  'ngMap',
  'luegg.directives',
  'ngFileUpload',
  'ngSanitize',
  'angular-input-stars'
])

.config(['$translateProvider', 'ezfbProvider', '$mdAriaProvider', '$locationProvider',
  function($translateProvider, ezfbProvider, $mdAriaProvider, $locationProvider) {
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
      prefix: 'i18n/',
      suffix: '.json'
    });

    var browserLanguage = $translateProvider.resolveClientLocale();
    var defaultLanguage = "en";
    var availableLanguages = ["de", "en"];
    var preferredLanguage;

    if (browserLanguage !== undefined && browserLanguage.length >= 2) {
      browserLanguage = browserLanguage.substring(0,2);
    }

    if (availableLanguages.indexOf(browserLanguage) >= 0) {
      preferredLanguage = browserLanguage;
    } else {
      preferredLanguage = defaultLanguage;
    }

    $translateProvider.preferredLanguage(preferredLanguage);
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
  }
]);
})();