(function () {
  'use strict';
  angular.
  module('listnride').
  config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

      $stateProvider.state({
        name: 'home',
        url: '/',
        template: '<home></home>',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["home.meta-title", "home.meta-description"])
              .then(function (translations) {
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
          size: {
            value: "",
            squash: true
          },
          allterrain: {
            value: "false",
            squash: true
          },
          race: {
            value: "false",
            squash: true
          },
          city: {
            value: "false",
            squash: true
          },
          kids: {
            value: "false",
            squash: true
          },
          ebikes: {
            value: "false",
            squash: true
          },
          special: {
            value: "false",
            squash: true
          }
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
          requestId: {
            squash: true,
            value: null
          }
        },
        template: '<requests></requests>'
      });

      $stateProvider.state({
        name: 'tokenlogin',
        url: '/requests/{requestId: int}/tokenlogin?shop_token&email',
        template: '<requests></requests>',
        resolve: {
          login: ['$state', '$stateParams', 'authentication', function($state, $stateParams, authentication) {
            return authentication.tokenLogin($stateParams.shop_token, $stateParams.email).then(
              function (success) {
                console.log('success');
                authentication.setCredentials(success.data.email, success.data.password_hashed, success.data.id, success.data.profile_picture.profile_picture.url, success.data.first_name, success.data.last_name, success.data.unread_messages);
              },
              function (error) {
                console.log('error');
              }
            );
          }]
        }
      });

      $stateProvider.state({
        name: 'list',
        url: '/list-bike',
        template: '<list></list>'
      });

      $stateProvider.state({
        name: 'listings',
        url: '/listings',
        template: '<listings></listings>'
      });

      $stateProvider.state({
        name: 'invoices',
        url: '/invoices',
        template: '<invoices></invoices>'
      });

      $stateProvider.state({
        name: 'edit',
        url: '/edit-bike/{bikeId:int}',
        template: '<edit></edit>'
      });

      $stateProvider.state({
        name: 'settings',
        url: '/settings',
        template: '<settings></settings>',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["settings.meta-title", "settings.meta-description"])
              .then(function (translations) {
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
        name: 'inVeloVeritas',
        url: '/in-velo-veritas',
        template: '<in-velo-veritas></in-velo-veritas>'
      });

      $stateProvider.state({
        name: 'velothonBikerental',
        url: '/velothon-bikerental',
        template: '<velothon-bikerental></velothon-bikerental>',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["events.velothon-bikerental.title", "events.velothon-bikerental.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["events.velothon-bikerental.title"]);
                ngMeta.setTag("description", translations["events.velothon-bikerental.meta-description"]);
              })
          }
        },
        meta: {
          disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'crossride',
        url: '/berliner-fahrradschau',
        template: '<crossride></crossride>'
      });

      $stateProvider.state({
        name: 'mcbw',
        url: '/mcbw',
        template: '<mcbw></mcbw>'
      });

      $stateProvider.state({
        name: 'cwd',
        url: '/cyclingworld',
        templateUrl: 'app/modules/events/cwd/cwd.template.html'
      });

      $stateProvider.state({
        name: 'pushnpost',
        url: '/pushnpost',
        template: '<pushnpost></pushnpost>'
      });

      $stateProvider.state({
        name: 'kuchenundraketen',
        url: '/kuchenundraketen',
        template: '<kuchenundraketen></kuchenundraketen>'
      });

      $stateProvider.state({
        name: 'listingABike',
        url: '/listing-a-bike',
        template: '<listing-a-bike></listing-a-bike>',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["list-a-bike.meta-title", "list-a-bike.meta-description"])
              .then(function (translations) {
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
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["rent-a-bike.meta-title", "rent-a-bike.meta-description"])
              .then(function (translations) {
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
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["about-us.meta-title", "about-us.meta-description"])
              .then(function (translations) {
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
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["trust-and-safety.meta-title", "trust-and-safety.meta-description"])
              .then(function (translations) {
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
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["contact-and-help.meta-title", "contact-and-help.meta-description"])
              .then(function (translations) {
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
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["press.meta-title", "press.meta-description"])
              .then(function (translations) {
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
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["imprint.meta-title", "imprint.meta-description"])
              .then(function (translations) {
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
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["privacy.meta-title", "privacy.meta-description"])
              .then(function (translations) {
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
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["how-it-works.meta-title", "how-it-works.meta-description"])
              .then(function (translations) {
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
        name: 'brompton',
        url: '/rent-brompton-bikes',
        template: '<brompton></brompton>'
      });

      $stateProvider.state({
        name: 'muli',
        url: '/rent-muli-bikes',
        template: '<muli></muli>'
      });

      $stateProvider.state({
        name: 'factoryberlin',
        url: '/factoryberlin',
        template: '<user></user>'
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

      $stateProvider.state({
        name: 'how-to-shoot-bike-photos',
        url: '/how-to-shoot-bike-photos',
        templateUrl: 'app/modules/static/how-to-shoot-bike-photos.template.html'
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

      $urlRouterProvider.otherwise(function ($injector) {
        var state = $injector.get('$state');
        state.go('404');
      });
    }
  ]);
})();
