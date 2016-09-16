'use strict';

angular.
  module('listnride').
  config(function($translateProvider, $stateProvider, uiGmapGoogleMapApiProvider) {
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

    uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyAwLiE4WWvLne4sR4WuFlEYWtu-chKOTRs',
      v: '3.20',
      libraries: ''
    });

    $stateProvider.state({
      name: 'home',
      url: '/',
      component: 'home'
    });

    $stateProvider.state({
      name: 'bike',
      url: '/bikes',
      component: 'bike'
    });

    $stateProvider.state({
      name: 'search',
      url: '/search',
      component: 'search'
    });

    $stateProvider.state({
      name: 'profile',
      url: '/profile',
      component: 'profile'
    });

    $translateProvider.useStaticFilesLoader({
        prefix: 'i18n/',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('en');

  });