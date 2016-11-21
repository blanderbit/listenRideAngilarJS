(function(){
'use strict';
angular.
module('listnride').
config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
      name: 'home',
      url: '/',
      template: '<home></home>'
    });

    $stateProvider.state({
      name: 'bike',
      url: '/bikes/{bikeId:int}',
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
      url: '/users/{userId:int}',
      template: '<user></user>'
    });

    $stateProvider.state({
      name: 'wfs',
      url: '/wfs',
      template: '<user></user>' 
    });

    $stateProvider.state({
      name: 'requests',
      url: '/requests/{requestId:int}',
      params: {
        requestId: { squash: true, value: null }
      },
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
      url: '/edit/{bikeId:int}',
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
      name: 'rentingABike',
      url: '/renting-a-bike',
      template: '<renting-a-bike></renting-a-bike>'
    });

    $stateProvider.state({
      name: 'about',
      url: '/about',
      templateUrl: 'app/modules/static/about.template.html'
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

    $stateProvider.state({
      name: 'ampler',
      url: '/rent-ampler-bikes',
      template: '<ampler></ampler>'
    });

    $stateProvider.state('404', {
      templateUrl: 'app/modules/static/error-404.template.html',
    });

    $urlRouterProvider.otherwise(function($injector, $location) {
      var state = $injector.get('$state');
      state.go('404');
    });
  }
]);
})();