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
  'listings',
  'listingCard',
  'edit',
  'rating',
  'settings',
  'listingABike',
  'rentingABike',
  'raphaSuperCross',
  'static',
  'brand-integration',
  'listnride.constant',
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
  'angular-input-stars',
  'ngMeta'
])
.config(['$translateProvider', 'ezfbProvider', '$mdAriaProvider', '$locationProvider', 'ngMetaProvider', 'ENV',
  function($translateProvider, ezfbProvider, $mdAriaProvider, $locationProvider, ngMetaProvider, ENV) {
    $mdAriaProvider.disableWarnings();

    ezfbProvider.setInitParams({
      appId: '895499350535682',
      // Module default is `v2.6`.
      // If you want to use Facebook platform `v2.3`, you'll have to add the following parameter.
      // https://developers.facebook.com/docs/javascript/reference/FB.init
      version: 'v2.8'
    });

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
    var retrieveLocale = function() {
      var defaultLanguage = "en";
      var availableLanguages = ["de", "en", "nl"];
  
      var host = window.location.host;
      var retrievedLanguage = host.split('.')[0];
  
      if (availableLanguages.indexOf(retrievedLanguage) >= 0) {
        console.log("Language set to " + retrievedLanguage);
        return retrievedLanguage;
      } else {
        console.log("Language defaulting to " + defaultLanguage);
        return defaultLanguage;
      }
    
    };

    $translateProvider.preferredLanguage(retrieveLocale());
    $translateProvider.useSanitizeValueStrategy(['escapeParameters']);
    ngMetaProvider.setDefaultTitle('listnride');
  }
])
.run(['ngMeta', '$rootScope', '$location', function(ngMeta, $rootScope, $location) {

  $rootScope.location = $location;
  ngMeta.init();

}]);