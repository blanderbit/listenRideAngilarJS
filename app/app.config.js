// 'use strict';

angular.
  module('listnride').
  config(function($translateProvider) {

    $translateProvider.useStaticFilesLoader({
        prefix: 'i18n/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('en');

  });