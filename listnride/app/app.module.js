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
.config(['$translateProvider', '$localStorageProvider', 'ezfbProvider', '$mdAriaProvider', '$locationProvider', '$compileProvider', 'ngMetaProvider', 'ENV', 'socialshareConfProvider',
  function($translateProvider, $localStorageProvider, ezfbProvider, $mdAriaProvider, $locationProvider, $compileProvider, ngMetaProvider, ENV, socialshareConfProvider) {
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
        'popupWidth' : 400
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

    $translateProvider.useStaticFilesLoader({
      prefix: 'app/i18n/',
      suffix: '.json'
    });

    // Retrieves locale from subdomain if valid, otherwise sets the default.
    var retrieveLocale = function () {
      // default and available languages
      var defaultLanguage = "en";
      var availableLanguages = ["de", "en", "nl", "it"];
      // get language from local storage
      var localStorageLanguage = $localStorageProvider.get('selectedLanguage');
      // host and domains
      var host = window.location.host;
      var domain = host.split(".");
      // sub domain, currently in use
      var subDomain = domain[0];
      // top level domain, will be used in future
      var topLevelDomain = domain[domain.length - 1];

      var retrievedLanguage = "";
      
      // select the language
      if (availableLanguages.indexOf(localStorageLanguage) >= 0) retrievedLanguage = localStorageLanguage;
      else if (availableLanguages.indexOf(subDomain) >= 0) retrievedLanguage = subDomain;
      else if (availableLanguages.indexOf(topLevelDomain) >= 0) retrievedLanguage = topLevelDomain;
      else retrievedLanguage = defaultLanguage;

      return retrievedLanguage;
    };

    $translateProvider.preferredLanguage(retrieveLocale());
    $translateProvider.useSanitizeValueStrategy(['escapeParameters']);
    ngMetaProvider.setDefaultTitle('listnride');
    // These default tags below are also set in ngMeta.js to be used if disableUpdate is true
    ngMetaProvider.setDefaultTag('prerender-status-code', '200');
    ngMetaProvider.setDefaultTag('og:image', 'http://www.listnride.com/app/assets/ui_images/opengraph/lnr_standard.jpg');
  }
])
.run(['ngMeta', '$rootScope', '$location', 'authentication', 'api', function(ngMeta, $rootScope, $location, authentication, api) {

  $rootScope.location = $location;
  ngMeta.init();

  if (authentication.loggedIn && !_.isEmpty(authentication.userId())) {
    api.get('/users/' + authentication.userId()).then(
      function (success) {
        var user = success.data;
        console.log(user);
        authentication.setCredentials(user);
      },
      function (error) {

      }
    );
  }

}]);
