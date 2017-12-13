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
                // Below is how to set the OG:IMAGE if disableUpdate is true
                // ngMeta.setTag("og:image", "imageurl.jpg");
              })
          }
        },
        meta: {
          disableUpdate: true
          // Below is how to set the OG:IMAGE if disableUpate is false
          // 'og:image': 'imageurl.jpg'
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
        name: 'list-view',
        url: '/list-view',
        template: '<bike-list-view></bike-list-view>'
      });

      $stateProvider.state({
        name: 'search',
        url: '/search/{location}?size&allterrain&race&city&kids&ebikes&special',
        template: '<search></search>',
        params: {
          hideFooter: true,
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
          hideFooter: true,
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
        template: '<list heading="\'list.list-bike\'" is-list-mode=true discount-field-editable=true></list>'
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
        template: '<list heading="\'list.edit-bike\'" is-list-mode=false discount-field-editable=true></list>'
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

      /* event pages -- start */ 

      $stateProvider.state({
        name: 'raphaSuperCross',
        url: '/rapha-super-cross',
        template: '<rapha-super-cross></rapha-super-cross>',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["meta.events.common.meta-title", "meta.events.common.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.events.common.meta-title"]);
                ngMeta.setTag("description", translations["meta.events.common.meta-description"]);
              })
          }
        },
        meta: {
          disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'inVeloVeritas',
        url: '/in-velo-veritas',
        template: '<in-velo-veritas></in-velo-veritas>',
          resolve: {
              data: function ($translate, ngMeta) {
                  $translate(["meta.events.in-velo-veritas.meta-title", "meta.events.in-velo-veritas.meta-description"])
                      .then(function (translations) {
                          ngMeta.setTitle(translations["meta.events.in-velo-veritas.meta-title"]);
                          ngMeta.setTag("description", translations["meta.events.in-velo-veritas.meta-description"]);
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
            $translate(["meta.events.cyclassics-hamburg.meta-title", "meta.events.cyclassics-hamburg.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.events.cyclassics-hamburg.meta-title"]);
                ngMeta.setTag("description", translations["meta.events.cyclassics-hamburg.meta-description"]);
              })
          }
        },
        meta: {
          disableUpdate: true
        }
      });

      $stateProvider.state({
          name: 'riderman',
          url: '/riderman-rothaus',
          template: '<riderman></riderman>',
          resolve: {
              data: function ($translate, ngMeta) {
                  $translate(["meta.events.riderman.meta-title", "meta.events.riderman.meta-description"])
                      .then(function (translations) {
                          ngMeta.setTitle(translations["meta.events.riderman.meta-title"]);
                          ngMeta.setTag("description", translations["meta.events.riderman.meta-description"]);
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
            $translate(["meta.events.velothon-bikerental.meta-title", "meta.events.velothon-bikerental.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.events.velothon-bikerental.meta-title"]);
                ngMeta.setTag("description", translations["meta.events.velothon-bikerental.meta-description"]);
              })
          }
        },
        meta: {
          disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'capeArgus',
        url: '/capeargus',
        template: '<cape-argus></cape-argus>',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["meta.events.cape-argus.meta-title", "meta.events.cape-argus.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.events.cape-argus.meta-title"]);
                ngMeta.setTag("description", translations["meta.events.cape-argus.meta-description"]);
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
            $translate(["meta.events.supercross-munich.meta-title", "meta.events.supercross-munich.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.events.supercross-munich.meta-title"]);
                ngMeta.setTag("description", translations["meta.events.supercross-munich.meta-description"]);
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
            $translate(["meta.events.depart.meta-title", "meta.events.depart.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.events.depart.meta-title"]);
                ngMeta.setTag("description", translations["meta.events.depart.meta-description"]);
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
        template: '<coffeespin></coffeespin>',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["meta.events.common.meta-title", "meta.events.common.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.events.common.meta-title"]);
                ngMeta.setTag("description", translations["meta.events.common.meta-description"]);
              })
          }
        },
        meta: {
          disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'constanceSpin',
        url: '/constance-spin',
        template: '<constance-spin></constance-spin>',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["meta.events.constance-spin.meta-title", "meta.events.constance-spin.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.events.constance-spin.meta-title"]);
                ngMeta.setTag("description", translations["meta.events.constance-spin.meta-description"]);
              })
          }
        },
        meta: {
          disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'velosoph',
        url: '/herbstausfahrt',
        template: '<velosoph></velosoph>',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["meta.events.velosoph.meta-title", "meta.events.velosoph.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.events.velosoph.meta-title"]);
                ngMeta.setTag("description", translations["meta.events.velosoph.meta-description"]);
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
        template: '<crossride></crossride>',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["meta.events.common.meta-title", "meta.events.common.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.events.common.meta-title"]);
                ngMeta.setTag("description", translations["meta.events.common.meta-description"]);
              })
          }
        },
        meta: {
          disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'mcbw',
        url: '/mcbw',
        template: '<mcbw></mcbw>',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["meta.events.common.meta-title", "meta.events.common.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.events.common.meta-title"]);
                ngMeta.setTag("description", translations["meta.events.common.meta-description"]);
              })
          }
        },
        meta: {
          disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'cwd',
        url: '/cyclingworld',
        templateUrl: 'app/modules/events/cwd/cwd.template.html',
        controller: 'StaticController',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["meta.events.common.meta-title", "meta.events.common.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.events.common.meta-title"]);
                ngMeta.setTag("description", translations["meta.events.common.meta-description"]);
              })
          }
        },
        meta: {
          disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'pushnpost',
        url: '/pushnpost',
        template: '<pushnpost></pushnpost>',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["meta.events.common.meta-title", "meta.events.common.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.events.common.meta-title"]);
                ngMeta.setTag("description", translations["meta.events.common.meta-description"]);
              })
          }
        },
        meta: {
          disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'kuchenundraketen',
        url: '/kuchenundraketen',
        template: '<kuchenundraketen></kuchenundraketen>',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["meta.events.common.meta-title", "meta.events.common.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.events.common.meta-title"]);
                ngMeta.setTag("description", translations["meta.events.common.meta-description"]);
              })
          }
        },
        meta: {
          disableUpdate: true
        }
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
        controller: 'StaticController',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["meta.about-us.meta-title", "meta.about-us.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.about-us.meta-title"]);
                ngMeta.setTag("description", translations["meta.about-us.meta-description"]);
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
            $translate(["meta.invest.meta-title", "meta.invest.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.invest.meta-title"]);
                ngMeta.setTag("description", translations["meta.invest.meta-description"]);
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
        controller: 'StaticController',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["meta.trust-and-safety.meta-title", "meta.trust-and-safety.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.trust-and-safety.meta-title"]);
                ngMeta.setTag("description", translations["meta.trust-and-safety.meta-description"]);
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
        controller: 'StaticController',
        resolve: {
              data: function ($translate, ngMeta) {
                  $translate(["meta.terms-and-conditions.meta-title", "meta.terms-and-conditions.meta-description"])
                      .then(function (translations) {
                          ngMeta.setTitle(translations["meta.terms-and-conditions.meta-title"]);
                          ngMeta.setTag("description", translations["meta.terms-and-conditions.meta-description"]);
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
        controller: 'StaticController',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["meta.contact-and-help.meta-title", "meta.contact-and-help.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.contact-and-help.meta-title"]);
                ngMeta.setTag("description", translations["meta.contact-and-help.meta-description"]);
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
        templateUrl: 'app/modules/jobs/jobs.template.html',
        controller: 'StaticController',
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
                $translate(["meta.jobs.meta-title", "meta.jobs.meta-description"])
                    .then(function (translations) {
                        ngMeta.setTitle(translations["meta.jobs.meta-title"]);
                        ngMeta.setTag("description", translations["meta.jobs.meta-description"]);
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
        controller: 'StaticController',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["meta.press.meta-title", "meta.press.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.press.meta-title"]);
                ngMeta.setTag("description", translations["meta.press.meta-description"]);
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
        controller: 'StaticController',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["meta.imprint.meta-title", "meta.imprint.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.imprint.meta-title"]);
                ngMeta.setTag("description", translations["meta.imprint.meta-description"]);
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
        controller: 'StaticController',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["meta.privacy.meta-title", "meta.privacy.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.privacy.meta-title"]);
                ngMeta.setTag("description", translations["meta.privacy.meta-description"]);
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
        controller: 'StaticController',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["meta.how-it-works.meta-title", "meta.how-it-works.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.how-it-works.meta-title"]);
                ngMeta.setTag("description", translations["meta.how-it-works.meta-description"]);
              })
          }
        },
        meta: {
          disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'shopLanding',
        url: '/bikeshop',
        templateUrl: 'app/modules/static/shop-landing.template.html',
        controller: 'StaticController',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["meta.shop-landing.meta-title", "meta.shop-landing.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.shop-landing.meta-title"]);
                ngMeta.setTag("description", translations["meta.shop-landing.meta-description"]);
              })
          }
        },
        meta: {
          disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'businessCommunity',
        url: '/business-community',
        template: '<business-community></business-community>',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["meta.business-community.meta-title", "meta.business-community.meta-description"])
              .then(function (translations) {
                ngMeta.setTitle(translations["meta.business-community.meta-title"]);
                ngMeta.setTag("description", translations["meta.business-community.meta-description"]);
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
                $translate(["meta.brand-integration.ampler.meta-title", "meta.brand-integration.ampler.meta-descr"])
                    .then(function (translations) {
                        ngMeta.setTitle(translations["meta.brand-integration.ampler.meta-title"]);
                        ngMeta.setTag("description", translations["meta.brand-integration.ampler.meta-descr"]);
                    })
            }
        },
        meta: {
            disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'vanmoof',
        url: '/rent-vanmoof-bikes',
        template: '<vanmoof></vanmoof>',
        resolve: {
            data: function ($translate, ngMeta) {
                $translate(["meta.brand-integration.vanmoof.meta-title", "meta.brand-integration.vanmoof.meta-descr"])
                    .then(function (translations) {
                        ngMeta.setTitle(translations["meta.brand-integration.vanmoof.meta-title"]);
                        ngMeta.setTag("description", translations["meta.brand-integration.vanmoof.meta-descr"]);
                        ngMeta.setTag("og:image", "app/assets/ui_images/opengraph/vanmoof.jpg");
                    })
            }
        },
        meta: {
            disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'moeve',
        url: '/rent-moeve-bikes',
        template: '<moeve></moeve>',
        resolve: {
            data: function ($translate, ngMeta) {
                $translate(["meta.brand-integration.moeve.meta-title", "meta.brand-integration.moeve.meta-descr"])
                    .then(function (translations) {
                        ngMeta.setTitle(translations["meta.brand-integration.moeve.meta-title"]);
                        ngMeta.setTag("description", translations["meta.brand-integration.moeve.meta-descr"]);
                        ngMeta.setTag("og:image", "app/assets/ui_images/opengraph/moeve.jpg");
                    })
            }
        },
        meta: {
            disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'votec',
        url: '/rent-votec-bikes',
        template: '<votec></votec>',
        resolve: {
            data: function ($translate, ngMeta) {
                $translate(["meta.brand-integration.votec.meta-title", "meta.brand-integration.votec.meta-descr"])
                    .then(function (translations) {
                        ngMeta.setTitle(translations["meta.brand-integration.votec.meta-title"]);
                        ngMeta.setTag("description", translations["meta.brand-integration.votec.meta-descr"]);
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
            $translate(["meta.brand-integration.vello.meta-title", "meta.brand-integration.vello.meta-description"])
              .then(function (translations) {
                  ngMeta.setTitle(translations["meta.brand-integration.vello.meta-title"]);
                  ngMeta.setTag("description", translations["meta.brand-integration.vello.meta-description"]);
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
            $translate(["meta.brand-integration.veletage.meta-title", "meta.brand-integration.veletage.meta-descr"])
              .then(function (translations) {
                  ngMeta.setTitle(translations["meta.brand-integration.veletage.meta-title"]);
                  ngMeta.setTag("description", translations["meta.brand-integration.veletage.meta-descr"]);
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
            $translate(["meta.brand-integration.bonvelo.meta-title", "meta.brand-integration.bonvelo.meta-description"])
              .then(function (translations) {
                  ngMeta.setTitle(translations["meta.brand-integration.bonvelo.meta-title"]);
                  ngMeta.setTag("description", translations["meta.brand-integration.bonvelo.meta-description"]);
                })
          }
        },
        meta: {
          disableUpdate: true
        }
      });

      $stateProvider.state({
        name: 'motoparilla',
        url: '/rent-motoparilla-bikes',
        template: '<motoparilla></motoparilla>',
        resolve: {
          data: function ($translate, ngMeta) {
            $translate(["meta.brand-integration.motoparilla.meta-title", "meta.brand-integration.motoparilla.meta-description"])
              .then(function (translations) {
                  ngMeta.setTitle(translations["meta.brand-integration.motoparilla.meta-title"]);
                  ngMeta.setTag("description", translations["meta.brand-integration.motoparilla.meta-description"]);
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
                $translate(["meta.brand-integration.ampler.meta-title", "meta.brand-integration.ampler.meta-descr"])
                    .then(function (translations) {
                        ngMeta.setTitle(translations["meta.brand-integration.ampler.meta-title"]);
                        ngMeta.setTag("description", translations["meta.brand-integration.ampler.meta-descr"]);
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
                $translate(["meta.brand-integration.brompton.meta-title", "meta.brand-integration.brompton.meta-descr"])
                    .then(function (translations) {
                        ngMeta.setTitle(translations["meta.brand-integration.brompton.meta-title"]);
                        ngMeta.setTag("description", translations["meta.brand-integration.brompton.meta-descr"]);
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
                $translate(["meta.brand-integration.muli.meta-title", "meta.brand-integration.muli.meta-descr"])
                    .then(function (translations) {
                        ngMeta.setTitle(translations["meta.brand-integration.muli.meta-title"]);
                        ngMeta.setTag("description", translations["meta.brand-integration.muli.meta-descr"]);
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
        controller: 'StaticController',
        resolve: {
            data: function ($translate, ngMeta) {
                $translate(["meta.cities.berlin.meta-title", "meta.cities.berlin.meta-description"])
                    .then(function (translations) {
                        ngMeta.setTitle(translations["meta.cities.berlin.meta-title"]);
                        ngMeta.setTag("description", translations["meta.cities.berlin.meta-description"]);
                    })
            }
        },
        meta: {
            disableUpdate: true
        }
      });

      // $stateProvider.state({
      //   name: 'cities-munich',
      //   url: '/munich',
      //   templateUrl: 'app/modules/static/cities-munich.template.html',
      //   controller: 'StaticController',
      //   resolve: {
      //       data: function ($translate, ngMeta) {
      //           $translate(["meta.cities.munich.meta-title", "meta.cities.munich.meta-description"])
      //               .then(function (translations) {
      //                   ngMeta.setTitle(translations["meta.cities.munich.meta-title"]);
      //                   ngMeta.setTag("description", translations["meta.cities.munich.meta-description"]);
      //               })
      //       }
      //   },
      //   meta: {
      //       disableUpdate: true
      //   }
      // });

      $stateProvider.state({
        name: 'cities-amsterdam',
        url: '/amsterdam',
        templateUrl: 'app/modules/static/cities-amsterdam.template.html',
        controller: 'StaticController',
        resolve: {
            data: function ($translate, ngMeta) {
                $translate(["meta.cities.amsterdam.meta-title", "meta.cities.amsterdam.meta-description"])
                    .then(function (translations) {
                        ngMeta.setTitle(translations["meta.cities.amsterdam.meta-title"]);
                        ngMeta.setTag("description", translations["meta.cities.amsterdam.meta-description"]);
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
        controller: 'StaticController',
        resolve: {
            data: function ($translate, ngMeta) {
                $translate(["meta.cities.vienna.meta-title", "meta.cities.vienna.meta-description"])
                    .then(function (translations) {
                        ngMeta.setTitle(translations["meta.cities.vienna.meta-title"]);
                        ngMeta.setTag("description", translations["meta.cities.vienna.meta-description"]);
                    })
            }
        },
        meta: {
            disableUpdate: true
        }
      });

      /* event pages -- end */

      $stateProvider.state({
        name: 'how-to-shoot-bike-photos',
        url: '/how-to-shoot-bike-photos',
        templateUrl: 'app/modules/static/how-to-shoot-bike-photos.template.html',
        controller: 'StaticController',
        resolve: {
          data: function ($translate, ngMeta) {
              $translate(["meta.events.common.meta-title", "meta.events.common.meta-description"])
                  .then(function () {
                      ngMeta.setTitle("");
                      ngMeta.setTag("description", "");
                  })
          }
      },
      meta: {
          disableUpdate: true
      }
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

      $stateProvider.state({
        name: 'city-landing',
        url: '/munich',
        template: '<city-landing></city-landing>'
      });

      // $stateProvider.state({
      //   name: 'seo-landing',
      //   url: '/{pageTitle: string}',
      //   template: '<seo-landing></seo-landing>'
      // });

      $urlRouterProvider.otherwise(function ($injector) {
        var state = $injector.get('$state');
        state.go('404');
      });
    }
  ]);
})();
