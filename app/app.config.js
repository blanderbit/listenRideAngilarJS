'use strict';

angular.
  module('listnride').
  config(function(
    $translateProvider,
    $stateProvider,
    ezfbProvider,
    $mdAriaProvider) {

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

    $translateProvider.useStaticFilesLoader({
      prefix: 'app/i18n/',
      suffix: '.json'
    });

    $translateProvider.preferredLanguage('de');
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
  });