'use strict';

angular.module('event', []).component('event', {
  templateUrl: 'app/modules/events/event.template.html',
  controllerAs: 'event',
  controller: ['api', '$state', '$stateParams', '$translate', 'ngMeta', '$translatePartialLoader', 'bikeOptions', 'notification',
    function EventController(api, $state, $stateParams, $translate, ngMeta, $tpl, bikeOptions, notification) {
      var event = this;
      $tpl.addPart('static');
      event.name = $stateParams.event_name;
      ngMeta.setTitle($translate.instant("events." + event.name + ".meta-title"));
      ngMeta.setTag("description", $translate.instant("events." + event.name + ".meta-description"));
      ngMeta.setTag("og:image", "app/assets/ui_images/events/" + event.name + "_og.jpg");

      event.$onInit = function() {
        event.object = {
          'berlin-triathlon': getRequestUrl('30', 'Berlin', '', '2019-06-02'),
          'berlin-triathlon-xl': getRequestUrl('30,31', 'Berlin', '', '2019-06-23'),
          'cyclassics-hamburg': getRequestUrl('30', 'Hamburg', 'cyclassics-hamburg', '2018-08-19'),
          'triathlon-hamburg': getRequestUrl('30', 'Hamburg', '', '2018-07-14'),
          'toros-de-gravel': getRequestUrl('42,43', 'Mallorca', '', '2018-10-13'),
          'riderman-rothaus': getRequestUrl('20', 'Bad Dürrheim', '', ''),
          'velothon-bikerental': getRequestUrl('30', 'Berlin', 'velothon', '2018-05-13'),
          'vatternrundan': getRequestUrl('30,31', 'Motala,Sweden', '', '2019-06-07'),
          'epicgrancanaria': getRequestUrl('30,31,32,33', 'Gran Canaria, Provinz Las Palmas, Spanien', '', '2019-04-05'),
          'velorace-dresden': getRequestUrl('30', 'Dresden', '', '2019-08-11'),
          'lardita-arezzo': getRequestUrl('30', 'Arezzo, Tuscany', '', '2019-03-24'),
          'granfondo-via-del-sale': getRequestUrl('30', 'Cesenatico', '', '2019-05-05'),
          'giro-sardegna': getRequestUrl('30', 'Cagliari', '', '2019-04-21'),
          'cyclingworld': getRequestUrl('', '', '', '', '/rides?family=35'),
          'paris-brest-paris': getRequestUrl('30', 'Rambouillet, France', '', '2019-08-18'),
          'costadelsol': getRequestUrl('30', 'Marbella, Málaga, Spain', '', '2019-09-15'),
          '8bar-clubride': getRequestUrl('', '', '', '', '/rides?family=36'),
          'granfondo-bikedivision': getRequestUrl('30', 'Peschiera del Garda, Verona, italy', '', '2019-09-22'),

          // CUSTOM DESIGN AND OLD PAGES

          // 'capeargus'              : '/rides?category=20&location=Capetown&priority=capeArgus&booked_at=2018-03-11',
          // 'supercross-munich'      : '/rides?category=35&location=Munich&booked_at=2017-10-14',
          // 'rapha-super-cross'      : '/rides?family=7',
          // 'in-velo-veritas'        : '/rides?family=4',
          // 'berliner-fahrradschau'  : '/rides?family=29', -> crossride
          // 'herbstausfahrt'         : '/rides?family=22', -> velosoph
          // 'grand-depart'           : '/rides?family=18',
          // 'eroica-gaiole'          : '/users/6352',
          // 'mcbw'                   : '/users/1886',
          // 'constance-spin'         : '/bikes/1998',
          // 'velothon-coffeespin'    : '/users/1998', -> coffeespin
          // 'pushnpost'              : '/users/1998',
          // 'kuchenundraketen'       : '/users/1998'
        };
        if (!event.object[event.name]) $state.go('404');

        // VARIABLES
        event.sizes = [];
        event.bikes = [];
        event.hasLogo = false;
        event.path = event.object[event.name];
        event.imagePath = 'app/assets/ui_images/events/' + event.name + '_hero.jpg';
        bikeOptions.sizeOptions('search', null).then(function (resolve) {
          event.sizes = resolve;
        });

        // TODO: maybe we should delete this, because it's only one event with logo
        if (event.name === 'vatternrundan') {
          event.hasLogo = true;
          event.logoPath = 'app/assets/ui_images/events/' + event.name + '_logo.png';
        }

        // METHODS
        event.getEvents = getEvents;

        // INVOCATIONS
        event.getEvents();
      }

      function getRequestUrl(categoryIds, location, priority, date, specialUrl){

        var queryParams = {
          'category' : categoryIds,
          'location' : location,
          'priority' : priority,
          'booked_at': date
        };
        var queryArray = [];

        _.forEach(queryParams, function(value, key) {
          if(value) queryArray.push(key + '=' + encodeURIComponent(value));
        });
        return specialUrl ? specialUrl  : '/rides?' + queryArray.join('&');
      }
      function getEvents() {
        api.get(event.path).then(
          function (response) {
            event.bikes = response.data.bikes;
          },
          function (error) {
            notification.show(error);
          }
        );
      }
    }
  ]
});
