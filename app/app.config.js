'use strict';

angular.
  module('listnride').
  config(function(
    $translateProvider,
    $stateProvider,
    ezfbProvider,
    $mdAriaProvider) {
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
      component: 'home'
    });

    $stateProvider.state({
      name: 'bike',
      url: '/bikes/{bikeId}',
      component: 'bike'
    });

    $stateProvider.state({
      name: 'search',
      url: '/search/{location}',
      component: 'search',
      resolve: {
        location: function($transition$) {
          return $transition$.params().location; //'fake city_name';// $transition$.params().city_name;
        }
      }
    });

    $stateProvider.state({
      name: 'profile',
      url: '/profile',
      component: 'profile'
    });

    $stateProvider.state({
      name: 'requests',
      url: '/requests',
      component: 'requests'
    });

    $translateProvider.useStaticFilesLoader({
        prefix: 'i18n/',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('en');

  });