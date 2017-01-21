(function(){
'use strict';
angular.
module('listnride').
config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider',
  function($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider) {



    $stateProvider.state({
      name: 'home',
      url: '/',
      template: '<home></home>',
      resolve : {
        data: function($translate, ngMeta) {
          $translate(["home.meta-title", "home.meta-description"])
          .then(function(translations) {
            ngMeta.setTitle(translations["home.meta-title"]);
            ngMeta.setTag("description", translations["home.meta-description"]);
          })
        }
      },
      meta: {
        disableUpdate: true
      }
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
      template: '<settings></settings>',
      resolve : {
        data: function($translate, ngMeta) {
          $translate(["settings.meta-title", "settings.meta-description"])
          .then(function(translations) {
            ngMeta.setTitle(translations["settings.meta-title"]);
            ngMeta.setTag("description", translations["settings.meta-description"]);
          })
        }
      },
      meta: {
        disableUpdate: true
      }
    });

    $stateProvider.state({
      name: 'raphaSuperCross',
      url: '/rapha-super-cross',
      template: '<rapha-super-cross></rapha-super-cross>'
    });

    $stateProvider.state({
      name: 'listingABike',
      url: '/listing-a-bike',
      template: '<listing-a-bike></listing-a-bike>',
      resolve : {
        data: function($translate, ngMeta) {
          $translate(["list-a-bike.meta-title", "list-a-bike.meta-description"])
          .then(function(translations) {
            ngMeta.setTitle(translations["list-a-bike.meta-title"]);
            ngMeta.setTag("description", translations["list-a-bike.meta-description"]);
          })
        }
      },
      meta: {
        disableUpdate: true
      }
    });

    $stateProvider.state({
      name: 'rentingABike',
      url: '/renting-a-bike',
      template: '<renting-a-bike></renting-a-bike>',
      resolve : {
        data: function($translate, ngMeta) {
          $translate(["rent-a-bike.meta-title", "rent-a-bike.meta-description"])
          .then(function(translations) {
            ngMeta.setTitle(translations["rent-a-bike.meta-title"]);
            ngMeta.setTag("description", translations["rent-a-bike.meta-description"]);
          })
        }
      },
      meta: {
        disableUpdate: true
      }
    });

    $stateProvider.state({
      name: 'about',
      url: '/about',
      templateUrl: 'app/modules/static/about.template.html',
      resolve : {
        data: function($translate, ngMeta) {
          $translate(["about-us.meta-title", "about-us.meta-description"])
          .then(function(translations) {
            ngMeta.setTitle(translations["about-us.meta-title"]);
            ngMeta.setTag("description", translations["about-us.meta-description"]);
          })
        }
      },
      meta: {
        disableUpdate: true
      }
    });

    $stateProvider.state({
      name: 'trustAndSafety',
      url: '/trust-and-safety',
      templateUrl: 'app/modules/static/trust-and-safety.template.html',
      resolve : {
        data: function($translate, ngMeta) {
          $translate(["trust-and-safety.meta-title", "trust-and-safety.meta-description"])
          .then(function(translations) {
            ngMeta.setTitle(translations["trust-and-safety.meta-title"]);
            ngMeta.setTag("description", translations["trust-and-safety.meta-description"]);
          })
        }
      },
      meta: {
        disableUpdate: true
      }
    });

    $stateProvider.state({
      name: 'terms',
      url: '/terms',
      templateUrl: 'app/modules/static/terms.template.html'
    });

    $stateProvider.state({
      name: 'help',
      url: '/help',
      templateUrl: 'app/modules/static/help.template.html',
      resolve : {
        data: function($translate, ngMeta) {
          $translate(["contact-and-help.meta-title", "contact-and-help.meta-description"])
          .then(function(translations) {
            ngMeta.setTitle(translations["contact-and-help.meta-title"]);
            ngMeta.setTag("description", translations["contact-and-help.meta-description"]);
          })
        }
      },
      meta: {
        disableUpdate: true
      }
    });

    $stateProvider.state({
      name: 'jobs',
      abstract: true,
      url: '',
      templateUrl: 'app/modules/jobs/jobs.template.html'
    });

    $stateProvider.state({
      name: 'jobs-list',
      parent: 'jobs',
      url: '/jobs',
      views: {
        'jobsView': {
          templateUrl: 'app/modules/jobs/jobs.list.template.html',
                controller: 'JobsListController as jobs'
        }
      }
    });

    $stateProvider.state({
      name: 'jobs-details',
      parent: 'jobs',
      url: '/jobs/position/{positionId}',
      views: {
        'jobsView': {
          templateUrl: 'app/modules/jobs/jobs.details.template.html',
          controller: 'JobsDetailsController as jobs'
        }
      }
    });

    $stateProvider.state({
      name: 'press',
      url: '/press',
      templateUrl: 'app/modules/static/press.template.html',
      resolve : {
        data: function($translate, ngMeta) {
          $translate(["press.meta-title", "press.meta-description"])
          .then(function(translations) {
            ngMeta.setTitle(translations["press.meta-title"]);
            ngMeta.setTag("description", translations["press.meta-description"]);
          })
        }
      },
      meta: {
        disableUpdate: true
      }
    });

    $stateProvider.state({
      name: 'imprint',
      url: '/imprint',
      templateUrl: 'app/modules/static/imprint.template.html',
      resolve : {
        data: function($translate, ngMeta) {
          $translate(["imprint.meta-title", "imprint.meta-description"])
          .then(function(translations) {
            ngMeta.setTitle(translations["imprint.meta-title"]);
            ngMeta.setTag("description", translations["imprint.meta-description"]);
          })
        }
      },
      meta: {
        disableUpdate: true
      }
    });

    $stateProvider.state({
      name: 'privacy',
      url: '/privacy',
      templateUrl: 'app/modules/static/privacy.template.html',
      resolve : {
        data: function($translate, ngMeta) {
          $translate(["privacy.meta-title", "privacy.meta-description"])
          .then(function(translations) {
            ngMeta.setTitle(translations["privacy.meta-title"]);
            ngMeta.setTag("description", translations["privacy.meta-description"]);
          })
        }
      },
      meta: {
        disableUpdate: true
      }
    });

    $stateProvider.state({
      name: 'howItWorks',
      url: '/how-it-works',
      templateUrl: 'app/modules/static/how-it-works.template.html',
      resolve : {
        data: function($translate, ngMeta) {
          $translate(["how-it-works.meta-title", "how-it-works.meta-description"])
          .then(function(translations) {
            ngMeta.setTitle(translations["how-it-works.meta-title"]);
            ngMeta.setTag("description", translations["how-it-works.meta-description"]);
          })
        }
      },
      meta: {
        disableUpdate: true
      }
    });

    $stateProvider.state({
      name: 'ampler',
      url: '/rent-ampler-bikes',
      template: '<ampler></ampler>'
    });

    $stateProvider.state({
      name: 'cities-berlin',
      url: '/berlin',
      templateUrl: 'app/modules/static/cities-berlin.template.html'
    });

    $stateProvider.state({
      name: 'cities-munich',
      url: '/munich',
      templateUrl: 'app/modules/static/cities-munich.template.html'
    });

    $stateProvider.state({
      name: 'cities-amsterdam',
      url: '/amsterdam',
      templateUrl: 'app/modules/static/cities-amsterdam.template.html'
    });

    $stateProvider.state({
      name: 'cities-vienna',
      url: '/vienna',
      templateUrl: 'app/modules/static/cities-vienna.template.html'
    });
    
    // for testing embed-bikes feature
    // change userID in route to fetch new bikes
    // ONLY for staging environment
    $stateProvider.state({
      name: 'embed',
      url: '/embed-bikes-test/{userId}/{userLang}',
      templateProvider: function ($timeout, $stateParams) {
        return $timeout(function () {
          return '<div><script src="https://s3.eu-central-1.amazonaws.com/listnride-cdn/lnr-embed.min.js"></script><div id="listnride" data-user="'
            + $stateParams.userId + '" data-lang="' + $stateParams.userLang + '"></div><div>'
        }, 100);
      }
    });
    $stateProvider.state('404', {
      templateUrl: 'app/modules/static/error-404.template.html',
      data: {
        meta: {
          'title': 'listnride - 404',
          'prerender-status-code': '404'
        }
      }
    });

    $urlRouterProvider.otherwise(function($injector, $location) {
      var state = $injector.get('$state');
      state.go('404');
    });
  }
]);
})();