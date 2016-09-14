// 'use strict';

angular.
  module('listnride').
  config(function($translateProvider, $stateProvider) {
    /*    
    Sample route:
      Route:
      localhost/app/#/footer/5

      Params:
      In the controller add the following attribute:
      bindings: {id: '<'}

      Params description:
      The resolved params (in this case: id) will be available in 
      the controller of the specified component as this.id (or since
      we rename 'this' to component name, the variable will be 
      found under footer.id)

    $stateProvider.state({
      name: 'footer',
      url: '/footer/{id}',
      component: 'footer',
      resolve: {
        id: function($transition$) {
          return $transition$.params().id;
        }
      }
    });
    */

    $translateProvider.useStaticFilesLoader({
        prefix: 'i18n/',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('en');

  });