'use strict';

angular.
  module('listnride').
  config(function(
    $translateProvider,
    $stateProvider,
    ezfbProvider,
    $mdAriaProvider,
    $mdThemingProvider) {

    $mdAriaProvider.disableWarnings();

    ezfbProvider.setInitParams({
      // This is my FB app id for plunker demo app
      appId: '895499350535682',
  
      // Module default is `v2.6`.
      // If you want to use Facebook platform `v2.3`, you'll have to add the following parameter.
      // https://developers.facebook.com/docs/javascript/reference/FB.init
      version: 'v2.3'
    });

    $stateProvider.state({
      name: 'home',
      url: '/',
      template: '<home></home>'
    });

    $stateProvider.state({
      name: 'bike',
      url: '/bikes/{bikeId}',
      template: '<bike></bike>'
    });

    $stateProvider.state({
      name: 'search',
      url: '/search/{location}?size&allterrain&race&city&kids&ebikes&special',
      template: '<search></search>',
      params: {
        size: { value: "", squash: true },
        allterrain: { value: "false", squash: true },
        race: { value: "false", squash: true },
        city: { value: "false", squash: true },
        kids: { value: "false", squash: true },
        ebikes: { value: "false", squash: true },
        special: { value: "false", squash: true },
      }
    });

    $stateProvider.state({
      name: 'user',
      url: '/users/{userId}',
      template: '<user></user>'
    });

    $stateProvider.state({
      name: 'requests',
      url: '/requests',
      template: '<requests></requests>'
    });

    $stateProvider.state({
      name: 'list',
      url: '/list',
      template: '<list></list>'
    });

    $stateProvider.state({
      name: 'listings',
      url: '/listings',
      template: '<listings></listings>'
    });

    $stateProvider.state({
      name: 'edit',
      url: '/edit/{bikeId}',
      template: '<edit></edit>'
    });

    $stateProvider.state({
      name: 'about',
      url: '/about',
      templateUrl: 'app/modules/static/about.template.html'
    });

    $stateProvider.state({
      name: 'rentingABike',
      url: '/renting-a-bike',
      templateUrl: 'app/modules/static/renting-a-bike.template.html'
    });

    $stateProvider.state({
      name: 'listingABike',
      url: '/listing-a-bike',
      templateUrl: 'app/modules/static/listing-a-bike.template.html'
    });

    $stateProvider.state({
      name: 'trustAndSafety',
      url: '/trust-and-safety',
      templateUrl: 'app/modules/static/trust-and-safety.template.html'
    });

    $stateProvider.state({
      name: 'terms',
      url: '/terms',
      templateUrl: 'app/modules/static/terms.template.html'
    });

    $stateProvider.state({
      name: 'help',
      url: '/help',
      templateUrl: 'app/modules/static/help.template.html'
    });

    $stateProvider.state({
      name: 'jobs',
      url: '/jobs',
      templateUrl: 'app/modules/static/jobs.template.html'
    });

    $stateProvider.state({
      name: 'press',
      url: '/press',
      templateUrl: 'app/modules/static/press.template.html'
    });

    $stateProvider.state({
      name: 'imprint',
      url: '/imprint',
      templateUrl: 'app/modules/static/imprint.template.html'
    });

    $stateProvider.state({
      name: 'privacy',
      url: '/privacy',
      templateUrl: 'app/modules/static/privacy.template.html'
    });

    $stateProvider.state({
      name: 'howItWorks',
      url: '/how-it-works',
      templateUrl: 'app/modules/static/how-it-works.template.html'
    });

    $translateProvider.useStaticFilesLoader({
      prefix: 'app/i18n/',
      suffix: '.json'
    });

    $translateProvider.preferredLanguage('de');
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');


    // Themes & Colors
    $mdThemingProvider.definePalette('lnr-blue', {
      '50': '#f3f8fe',
      '100': '#dbeafd',
      '200': '#c3dcfc',
      '300': '#aacefb',
      '400': '#92c0f9',
      '500': '#7ab2f8',
      '600': '#62a4f7',
      '700': '#4a96f5',
      '800': '#3188f4',
      '900': '#197af3',
      'A100': '#ffffff',
      'A200': '#ffffff',
      'A400': '#ffffff',
      'A700': '#0c6de6',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 300 A100 A400 A700'
    });

    $mdThemingProvider.definePalette('lnr-green', {
      '50': '#256746',
      '100': '#2b7a53',
      '200': '#328d60',
      '300': '#39a06d',
      '400': '#40b27a',
      '500': '#4cbf86',
      '600': '#72cda0',
      '700': '#85d3ac',
      '800': '#97dab9',
      '900': '#aae1c6',
      'A100': '#72cda0',
      'A200': '#5FC693',
      'A400': '#4cbf86',
      'A700': '#bde7d2',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 300 A100 A400 A700'
    });

    $mdThemingProvider.definePalette('lnr-background', $mdThemingProvider.extendPalette('grey', {
      '50': '#ffffff',
      'A400': '#343940'
    }));

    var DARK_FOREGROUND = {
      name: 'dark',
      '1': 'rgba(85,85,85,1.0)',
      '2': 'rgba(68,68,68,1.0)',
      '3': 'rgba(229,234,234,1.0)',
      '4': 'rgba(206,212,216,1.0)'
    };

    // var LIGHT_FOREGROUND = {
    //   name: 'light',
    //   '1': 'rgba(255,255,255,1.0)',
    //   '2': 'rgba(255,255,255,0.7)',
    //   '3': 'rgba(255,255,255,0.5)',
    //   '4': 'rgba(255,255,255,0.12)'
    // };

    $mdThemingProvider.theme('default')
        .primaryPalette('lnr-blue')
        .accentPalette('lnr-green')
        .backgroundPalette('lnr-background')
        .foregroundPalette = DARK_FOREGROUND;

    $mdThemingProvider.theme('lnr-dark')
        .backgroundPalette('lnr-background')
        .dark().foregroundPalette['3'] ='rgba(255,255,255,0.12)';

    $mdThemingProvider.enableBrowserColor({
        palette: 'accent'
    });

  });