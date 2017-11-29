'use strict';

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
  'confirmation',
  'listings',
  'listingCard',
  'rating',
  'settings',
  'invoices',
  'velothonBikerental',
  'cyclassicsHamburg',
  'riderman',
  'jobs',
  'listingABike',
  'rentingABike',
  'raphaSuperCross',
  'inVeloVeritas',
  'crossride',
  'static',
  'ampler-integration',
  'vello-integration',
  'veletage-integration',
  'brompton-integration',
  'bonvelo-integration',
  'motoparilla-integration',
  'muli-integration',
  'mcbw',
  'pushnpost',
  'kuchenundraketen',
  'invite',
  'listnride.constant',
  'inviteLanding',
  'coffeespin',
  'depart',
  'invest',
  'supercrossMunich',
  'seoLanding',
  'constanceSpin',
  'velosoph',
  'metaTags',
  'vanmoofIntegration',
  'votec-integration',
  'capeArgus',
  'businessCommunity',
  'moeveIntegration',
  /* external modules */
  'ngAnimate',
  'ngMaterial',
  'ngMessages',
  'pascalprecht.translate',
  'ui.router',
  'internationalPhoneNumber',
  'ngStorage',
  'ezfb',
  'ngMap',
  'luegg.directives',
  'ngFileUpload',
  'ngImgCrop',
  'ngSanitize',
  'angular-input-stars',
  'ngMeta',
  'infinite-scroll',
  'slickCarousel',
  'angulartics',
  'angulartics.google.analytics',
  'angulartics.facebook.pixel',
  '720kb.socialshare',
  'angularMoment'
])
.config(['$translateProvider', '$localStorageProvider', '$translatePartialLoaderProvider', 'ezfbProvider', '$mdAriaProvider', '$locationProvider', '$compileProvider', 'ngMetaProvider', 'ENV', 'socialshareConfProvider',
  function($translateProvider, $localStorageProvider, $translatePartialLoaderProvider, ezfbProvider, $mdAriaProvider, $locationProvider, $compileProvider, ngMetaProvider, ENV, socialshareConfProvider) {
    $mdAriaProvider.disableWarnings();
    $compileProvider.debugInfoEnabled(false);

    ezfbProvider.setInitParams({
      appId: '895499350535682',
      // Module default is `v2.6`.
      // If you want to use Facebook platform `v2.3`, you'll have to add the following parameter.
      // https://developers.facebook.com/docs/javascript/reference/FB.init
      version: 'v2.8'
    });

    socialshareConfProvider.configure([
    {
      'provider': 'facebook',
      'conf': {
        'trigger': 'click',
        'popupHeight': 800,
        'popupWidth': 400
      }
    }
    ]);

    // cause to fail the route reload
    // when you are some route like /renting-a-bike or any
    // other then refreshing page fails
    // whoever worked on it fix it then enable it
    $locationProvider.html5Mode({
      enabled: ENV.html5Mode,
      requireBase: false
    });

    // use partial loader
    $translatePartialLoaderProvider.addPart('default');
    $translateProvider.useLoader('$translatePartialLoader', {
      urlTemplate: 'app/i18n/{part}/{lang}.json'
    });

    // use cached translation
    $translateProvider.useLoaderCache(true);

    // Retrieve current TLD, like 'com' or 'de'
    var retrieveTld = function () {
      var host = window.location.hostname.split(".");
      return host[host.length - 1];
    }

    // Retrieves locale from top level domain if valid, otherwise sets the default.
    var retrieveLocale = function () {
      // default and available languages
      var defaultLanguage = "en";
      var availableLanguages = ["de", "en", "nl", "it"];
      var topLevelDomain = retrieveTld();
      // select the language
      // either get from top level domain or select the default one
      var retrievedLanguage = "";
      if (availableLanguages.indexOf(topLevelDomain) >= 0) retrievedLanguage = topLevelDomain;
      else retrievedLanguage = defaultLanguage;
      return retrievedLanguage;
    };

    // Determine the short language key of the user's system
    var determineUserLanguage = function () {
      return $translateProvider.resolveClientLocale().split("_")[0];
    }

    // Determines TLD to a language key
    var languageToTld = function (language) {
      switch (language) {
        case 'en': return "com";
        case 'de': return "de";
        case 'nl': return "nl";
        case 'it': return "it";
        default: return null;
      }
    };

    // In case of accessing the .com version, users will see the website
    // in their own system's language in case we support it
    // if (retrieveTld() == 'com' && determineUserLanguage() != 'en') {
    if (retrieveTld() == 'localhost' && determineUserLanguage() == 'en') {
      var newUrl = 'https://' +
        window.location.hostname.split('listnride')[0] +
        '.' + languageToTld(determineUserLanguage());
      console.log(newUrl);
      window.location = newUrl;
    }

    $translateProvider.preferredLanguage(retrieveLocale());
    $translateProvider.useSanitizeValueStrategy(['escapeParameters']);
    ngMetaProvider.setDefaultTitle('listnride');
    // These default tags below are also set in ngMeta.js to be used if disableUpdate is true
    ngMetaProvider.setDefaultTag('prerender-status-code', '200');
    ngMetaProvider.setDefaultTag('og:image', 'http://www.listnride.com/app/assets/ui_images/opengraph/lnr_standard.jpg');
  }
])
.run(['$translate', 'ngMeta', '$rootScope', '$location', 'authentication', 'api', function($translate, ngMeta, $rootScope, $location, authentication, api) {

  // load partial translations based on the language selected
  $rootScope.$on('$translatePartialLoaderStructureChanged', function () {
    $translate.refresh();
  });
  $rootScope.location = $location;
  ngMeta.init();

  if (authentication.loggedIn && !_.isEmpty(authentication.userId())) {
    api.get('/users/' + authentication.userId()).then(
      function (success) {
        var user = success.data;
        authentication.setCredentials(user);
      },
      function (error) {
      }
    );
  }

}]);
