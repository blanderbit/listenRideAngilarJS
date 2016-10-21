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
      url: '/requests/{requestId}',
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
      name: 'settings',
      url: '/settings',
      template: '<settings></settings>'
    });

    $stateProvider.state({
      name: 'raphaSuperCross',
      url: '/rapha-super-cross',
      template: '<rapha-super-cross></rapha-super-cross>'
    });

    $stateProvider.state({
      name: 'listingABike',
      url: '/listing-a-bike',
      template: '<listing-a-bike></listing-a-bike>'
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
      '50': '#ffffff',
      '100': '#ffffff',
      '200': '#f8fbff',
      '300': '#b4d4fb',
      '400': '#97c3fa',
      '500': '#7ab2f8',
      '600': '#5da1f6',
      '700': '#4090f5',
      '800': '#237ff3',
      '900': '#0c6feb',
      'A100': '#ffffff',
      'A200': '#7ab2f8',
      'A400': '#97c3fa',
      'A700': '#4090f5',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 300 A100 A400 A700'
    });

    $mdThemingProvider.definePalette('lnr-green', {
      '50': '#ffffff',
      '100': '#eaf8f1',
      '200': '#c1e9d5',
      '300': '#8cd6b1',
      '400': '#76cea2',
      '500': '#5fc693',
      '600': '#48be84',
      '700': '#3dab74',
      '800': '#359465',
      '900': '#2d7e56',
      'A100': '#ffffff',
      'A200': '#eaf8f1',
      'A400': '#76cea2',
      'A700': '#3dab74',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 300 A100 A200 A400 A700'
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
      '4': 'rgba(206,212,216,0.9)'
    };

    $mdThemingProvider.theme('default')
        .primaryPalette('lnr-green')
        .accentPalette('lnr-blue')
        .backgroundPalette('lnr-background')
        .foregroundPalette = DARK_FOREGROUND;

    $mdThemingProvider.theme('lnr-dark')
        .backgroundPalette('lnr-background')
        .dark().foregroundPalette['3'] ='rgba(255,255,255,0.12)';

  });