// 'use strict';

angular.
  module('listnride').
  config(function($translateProvider, $stateProvider) {

    /*
    
    Sample routes:

    var helloState = {
      name: 'hello',
      url: '/hello',
      templateUrl: './path/to/template'
    }

    $stateProvider.state(helloState);
    
    */

    $translateProvider.useStaticFilesLoader({
        prefix: 'i18n/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('en');

  });