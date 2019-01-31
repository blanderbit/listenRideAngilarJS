'use strict';

angular.module('event', []).component('event', {
  templateUrl: 'app/modules/events/event.template.html',
  controllerAs: 'event',
  controller: ['api', '$state', '$stateParams', '$translatePartialLoader', 'bikeOptions', 'notification',
    function EventController(api, $state, $stateParams, $tpl, bikeOptions, notification) {
      var event = this;
      $tpl.addPart('static');

      event.$onInit = function() {

        //VARIABLES
        event.sizes = [];
        event.bikes = [];
        event.hasLogo = false;

        //METHODS
        event.getRequestUrl = getRequestUrl;
        event.getEvents = getEvents;

        // INVOCATIONS
        event.object = {
          'berlin-triathlon'       : event.getRequestUrl('30', 'Berlin', '', '2019-06-02'),
          'berlin-triathlon-xl'    : event.getRequestUrl('30,31', 'Berlin', '', '2019-06-23'),
          'cyclassics-hamburg'     : event.getRequestUrl('30', 'Hamburg','cyclassics-hamburg', '2018-08-19'),
          'triathlon-hamburg'      : event.getRequestUrl('30', 'Hamburg','', '2018-07-14'),
          'toros-de-gravel'        : event.getRequestUrl('42,43', 'Mallorca','', '2018-10-13'),
          'riderman-rothaus'       : event.getRequestUrl('20', 'Bad Dürrheim','', ''),
          'velothon-bikerental'    : event.getRequestUrl('30', 'Berlin', 'velothon', '2018-05-13'),
          'vatternrundan'          : event.getRequestUrl('30,31', 'Motala,Sweden', '', '2019-06-07'),
          'epicgrancanaria'        : event.getRequestUrl('30,31,32,33', 'Gran Canaria, Provinz Las Palmas, Spanien', '', '2019-04-05'),
          'velorace-dresden'       : event.getRequestUrl('30', 'Dresden', '', '2019-08-11'),
          'lardita-arezzo'         : event.getRequestUrl('30', 'Arezzo, Tuscany', '', '2019-03-24'),
          'granfondo-via-del-sale' : event.getRequestUrl('30', 'Cesenatico', '', '2019-05-05'),
          'giro-sardegna'          : event.getRequestUrl('30', 'Cagliari', '', '2019-04-21')

          // CUSTOM DESIGN AND OLD PAGES

          // 'capeargus'              : '/rides?category=20&location=Capetown&priority=capeArgus&booked_at=2018-03-11',
          // 'supercross-munich'      : '/rides?category=35&location=Munich&booked_at=2017-10-14',
          // 'rapha-super-cross'      : '/rides?family=7',
          // 'in-velo-veritas'        : '/rides?family=4',
          // 'berliner-fahrradschau'  : '/rides?family=29',
          // 'herbstausfahrt'         : '/rides?family=22',
          // 'grand-depart'           : '/rides?family=18',
          // 'eroica-gaiole'          : '/users/6352',
          // 'mcbw'                   : '/users/1886',
          // 'constance-spin'         : '/bikes/1998',
          // 'velothon-coffeespin'    : '/users/1998',
          // 'cyclingworld'           : '/users/1998',
          // 'pushnpost'              : '/users/1998',
          // 'kuchenundraketen'       : '/users/1998'
        };

        bikeOptions.sizeOptions('search', null).then(function (resolve) {
          event.sizes = resolve;
        });

        event.name = $stateParams.event_name;

        event.path = event.object[event.name];

        event.imagePath = 'app/assets/ui_images/events/' + event.name + '_hero.jpg';

        if (!event.path) $state.go('404');

        if(event.name === 'vatternrundan') {
          event.hasLogo = true;
          event.logoPath = 'app/assets/ui_images/events/' + event.name + '_logo.png';
        }

        event.getEvents();
      }

      function getRequestUrl(categoryIds, location, priority, date){

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
        return '/rides?' + queryArray.join('&');
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
