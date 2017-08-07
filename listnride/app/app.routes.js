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
        name: 'verify',
        url: '/verify',
        template: '<home></home>'
      });

      $stateProvider.state({
        name: 'confirm',
        url: '/confirm/{userId:int}/{confirmationCode:string}',
        template: '<home></home>'
      });

      $stateProvider.state({
        name: 'bike',
        url: '/bikes/{bikeId:int}',
        template: '<bike></bike>'
      });

      $stateProvider.state({
        name: 'seo-landing',
        url: '/rent-ebikes-berlin',
        template: '<seo-landing></seo-landing>'
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
                authentication.setCredentials(success.data);
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
        template: '<in-velo-veritas></in-velo-veritas>',
          resolve: {
              data: function ($translate, ngMeta) {
                  $translate(["events.in-velo-veritas.meta-title", "events.in-velo-veritas.meta-description"])
                      .then(function (translations) {
                          ngMeta.setTitle(translations["events.in-velo-veritas.meta-title"]);
                          ngMeta.setTag("description", translations["events.in-velo-veritas.meta-description"]);
                      })
              }
          },
          meta: {
              disableUpdate: true
          }
      });

      $stateProvider.state({
        name: 'cyclassicsHamburg',
        url: '/cyclassics-hamburg',
        template: '<cyclassics-hamburg></cyclassics-hamburg>',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["events.cyclassics-hamburg.meta-title", "events.cyclassics-hamburg.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["events.cyclassics-hamburg.meta-title"]);
                ngMeta.setTag("description", translations["events.cyclassics-hamburg.meta-description"]);
              })
          }
        },
        meta: {
          disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'velothonBikerental',
        url: '/velothon-bikerental',
        template: '<velothon-bikerental></velothon-bikerental>',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["events.velothon-bikerental.meta-title", "events.velothon-bikerental.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["events.velothon-bikerental.meta-title"]);
                ngMeta.setTag("description", translations["events.velothon-bikerental.meta-description"]);
              })
          }
        },
        meta: {
          disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'supercrossMunich',
        url: '/supercross-munich',
        template: '<supercross-munich></supercross-munich>',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["events.supercross-munich.meta-title", "events.supercross-munich.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["events.supercross-munich.meta-title"]);
                ngMeta.setTag("description", translations["events.supercross-munich.meta-description"]);
              })
          }
        },
        meta: {
          disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'depart',
        url: '/grand-depart',
        template: '<depart></depart>',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["events.depart.meta-title", "events.depart.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["events.depart.meta-title"]);
                ngMeta.setTag("description", translations["events.depart.meta-description"]);
              })
          }
        },
        meta: {
          disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'coffeespin',
        url: '/velothon-coffeespin',
        template: '<coffeespin></coffeespin>'
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
        name: 'invest',
        url: '/invest',
        template: '<invest></invest>',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["invest.meta-title", "invest.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["invest.meta-title"]);
                ngMeta.setTag("description", translations["invest.meta-description"]);
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
        templateUrl: 'app/modules/static/terms.template.html',
          resolve: {
              data: function ($translate, ngMeta) {
                  $translate(["terms-and-conditions.meta-title", "terms-and-conditions.meta-description"])
                      .then(function (translations) {
                          ngMeta.setTitle(translations["terms-and-conditions.meta-title"]);
                          ngMeta.setTag("description", translations["terms-and-conditions.meta-description"]);
                      })
              }
          },
          meta: {
              disableUpdate: true
          }
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
        },
        resolve: {
            data: function ($translate, ngMeta) {
                $translate(["jobs.meta-title", "jobs.meta-description"])
                    .then(function (translations) {
                        ngMeta.setTitle(translations["jobs.meta-title"]);
                        ngMeta.setTag("description", translations["jobs.meta-description"]);
                    })
            }
        },
        meta: {
            disableUpdate: true
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
        template: '<ampler></ampler>',
        resolve: {
            data: function ($translate, ngMeta) {
                $translate(["brand-integration.ampler.meta-title", "brand-integration.ampler.meta-descr"])
                    .then(function (translations) {
                        ngMeta.setTitle(translations["brand-integration.ampler.meta-title"]);
                        ngMeta.setTag("description", translations["brand-integration.ampler.meta-descr"]);
                    })
            }
        },
        meta: {
            disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'vello',
        url: '/rent-vello-bikes',
        template: '<vello></vello>',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["brand-integration.vello.meta-title", "brand-integration.vello.meta-description"])
              .then(function (translations) {
                  ngMeta.setTitle(translations["brand-integration.vello.meta-title"]);
                  ngMeta.setTag("description", translations["brand-integration.vello.meta-description"]);
              })
          }
        },
        meta: {
          disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'veletage',
        url: '/veletage',
        template: '<veletage></veletage>',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["brand-integration.veletage.meta-title", "brand-integration.veletage.meta-descr"])
              .then(function (translations) {
                  ngMeta.setTitle(translations["brand-integration.veletage.meta-title"]);
                  ngMeta.setTag("description", translations["brand-integration.veletage.meta-descr"]);
                })
          }
        },
        meta: {
          disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'bonvelo',
        url: '/rent-bonvelo-bikes',
        template: '<bonvelo></bonvelo>',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["brand-integration.bonvelo.meta-title", "brand-integration.bonvelo.meta-description"])
              .then(function (translations) {
                  ngMeta.setTitle(translations["brand-integration.bonvelo.meta-title"]);
                  ngMeta.setTag("description", translations["brand-integration.bonvelo.meta-description"]);
                })
          }
        },
        meta: {
          disableUpdate: true
        }
      });

      // TODO: The following state is redundant and only a hotfix for a wrong PR email
      $stateProvider.state({
        name: 'ampler2',
        url: '/rent-ampler-bike',
        template: '<ampler></ampler>',
        resolve: {
            data: function ($translate, ngMeta) {
                $translate(["brand-integration.ampler.meta-title", "brand-integration.ampler.meta-descr"])
                    .then(function (translations) {
                        ngMeta.setTitle(translations["brand-integration.ampler.meta-title"]);
                        ngMeta.setTag("description", translations["brand-integration.ampler.meta-descr"]);
                    })
            }
        },
        meta: {
            disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'brompton',
        url: '/rent-brompton-bikes',
        template: '<brompton></brompton>',
        resolve: {
            data: function ($translate, ngMeta) {
                $translate(["brand-integration.brompton.meta-title", "brand-integration.brompton.meta-descr"])
                    .then(function (translations) {
                        ngMeta.setTitle(translations["brand-integration.brompton.meta-title"]);
                        ngMeta.setTag("description", translations["brand-integration.brompton.meta-descr"]);
                    })
            }
        },
        meta: {
            disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'muli',
        url: '/rent-muli-bikes',
        template: '<muli></muli>',
        resolve: {
            data: function ($translate, ngMeta) {
                $translate(["brand-integration.muli.meta-title", "brand-integration.muli.meta-descr"])
                    .then(function (translations) {
                        ngMeta.setTitle(translations["brand-integration.muli.meta-title"]);
                        ngMeta.setTag("description", translations["brand-integration.muli.meta-descr"]);
                    })
            }
        },
        meta: {
            disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'factoryberlin',
        url: '/factoryberlin',
        template: '<user></user>'
      });

      $stateProvider.state({
        name: 'cities-berlin',
        url: '/berlin',
        templateUrl: 'app/modules/static/cities-berlin.template.html',
        resolve: {
            data: function ($translate, ngMeta) {
                $translate(["cities.berlin.meta-title", "cities.berlin.meta-description"])
                    .then(function (translations) {
                        ngMeta.setTitle(translations["cities.berlin.meta-title"]);
                        ngMeta.setTag("description", translations["cities.berlin.meta-description"]);
                    })
            }
        },
        meta: {
            disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'cities-munich',
        url: '/munich',
        templateUrl: 'app/modules/static/cities-munich.template.html',
        resolve: {
            data: function ($translate, ngMeta) {
                $translate(["cities.munich.meta-title", "cities.munich.meta-description"])
                    .then(function (translations) {
                        ngMeta.setTitle(translations["cities.munich.meta-title"]);
                        ngMeta.setTag("description", translations["cities.munich.meta-description"]);
                    })
            }
        },
        meta: {
            disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'cities-amsterdam',
        url: '/amsterdam',
        templateUrl: 'app/modules/static/cities-amsterdam.template.html',
        resolve: {
            data: function ($translate, ngMeta) {
                $translate(["cities.amsterdam.meta-title", "cities.amsterdam.meta-description"])
                    .then(function (translations) {
                        ngMeta.setTitle(translations["cities.amsterdam.meta-title"]);
                        ngMeta.setTag("description", translations["cities.amsterdam.meta-description"]);
                    })
            }
        },
        meta: {
            disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'cities-vienna',
        url: '/vienna',
        templateUrl: 'app/modules/static/cities-vienna.template.html',
        resolve: {
            data: function ($translate, ngMeta) {
                $translate(["cities.vienna.meta-title", "cities.vienna.meta-description"])
                    .then(function (translations) {
                        ngMeta.setTitle(translations["cities.vienna.meta-title"]);
                        ngMeta.setTag("description", translations["cities.vienna.meta-description"]);
                    })
            }
        },
        meta: {
            disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'how-to-shoot-bike-photos',
        url: '/how-to-shoot-bike-photos',
        templateUrl: 'app/modules/static/how-to-shoot-bike-photos.template.html'
      });

      $stateProvider.state({
        name: 'invite',
        url: '/invite-friends',
        template: '<invite></invite>'
      });

      $stateProvider.state({
        name: 'inviteLanding',
        url: '/invitation/{inviteCode: string}',
        template: '<invite-landing></invite-landing>'
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
