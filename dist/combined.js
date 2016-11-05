//Evaluated by gulp.
(function(){
'use strict';
/*jshint -W097 */

angular.module('listnride', [
  /* internal modules */
	'header',
  'footer',
  'home',
  'search',
  'bikeCard',
  'user',
  'bike',
  'requests',
  'message',
  'list',
  'autocomplete',
  'listings',
  'listingCard',
  'edit',
  'rating',
  'settings',
  'listingABike',
  'raphaSuperCross',
  'static',
  /* external modules */
  'ngMaterial',
  'ngMessages',
  'pascalprecht.translate',
  'ui.router',
  'ngStorage',
  'ezfb',
  'ngMap',
  'luegg.directives',
  'ngFileUpload',
  'ngSanitize',
  'angular-input-stars'
])

.config(['$translateProvider', 'ezfbProvider', '$mdAriaProvider', '$locationProvider',
  function($translateProvider, ezfbProvider, $mdAriaProvider, $locationProvider) {
    $mdAriaProvider.disableWarnings();

    ezfbProvider.setInitParams({
      appId: '895499350535682',
      // Module default is `v2.6`.
      // If you want to use Facebook platform `v2.3`, you'll have to add the following parameter.
      // https://developers.facebook.com/docs/javascript/reference/FB.init
      version: 'v2.3'
    });

    // $locationProvider.html5Mode(true);

    $translateProvider.useStaticFilesLoader({
      prefix: 'app/i18n/',
      suffix: '.json'
    });

    var browserLanguage = $translateProvider.resolveClientLocale();
    var defaultLanguage = "en";
    var availableLanguages = ["de", "en"];
    var preferredLanguage;

    if (browserLanguage !== undefined && browserLanguage.length >= 2) {
      browserLanguage = browserLanguage.substring(0,2);
    }

    if (availableLanguages.indexOf(browserLanguage) >= 0) {
      preferredLanguage = browserLanguage;
    } else {
      preferredLanguage = defaultLanguage;
    }

    $translateProvider.preferredLanguage(preferredLanguage);
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
  }
]);
})();
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
      name: 'about',
      url: '/about',
      templateUrl: 'app/modules/static/about.template.html'
    });

    $stateProvider.state({
      name: 'rentingABike',
      url: '/renting-a-bike',
      templateUrl: 'app/modules/static/renting-a-bike.template.html'
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
(function(){
'use strict';
angular.
module('listnride').
config(['$mdThemingProvider',
  function($mdThemingProvider) {
    $mdThemingProvider.definePalette('lnr-blue', {
      '50': '#ffffff',
      '100': '#ffffff',
      '200': '#f8fbff',
      '300': '#b4d4fb',
      '400': '#97c3fa',
      '500': '#7ab2f8',
      '600': '#5da1f6',
      '700': '#4090f5',
      '800': '#237ff3',
      '900': '#0c6feb',
      'A100': '#ffffff',
      'A200': '#7ab2f8',
      'A400': '#97c3fa',
      'A700': '#4090f5',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 300 A100 A400 A700'
    });

    $mdThemingProvider.definePalette('lnr-green', {
      '50': '#ffffff',
      '100': '#eaf8f1',
      '200': '#c1e9d5',
      '300': '#8cd6b1',
      '400': '#76cea2',
      '500': '#5fc693',
      '600': '#48be84',
      '700': '#3dab74',
      '800': '#359465',
      '900': '#2d7e56',
      'A100': '#ffffff',
      'A200': '#eaf8f1',
      'A400': '#76cea2',
      'A700': '#3dab74',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 300 A100 A200 A400 A700'
    });

    $mdThemingProvider.definePalette('lnr-background', $mdThemingProvider.extendPalette('grey', {
      '50': '#ffffff',
      'A400': '#343940'
    }));

    var DARK_FOREGROUND = {
      name: 'dark',
      '1': 'rgba(85,85,85,1.0)',
      '2': 'rgba(68,68,68,1.0)',
      '3': 'rgba(225,230,230,1.0)',
      '4': 'rgba(206,212,216,0.9)'
    };

    $mdThemingProvider.theme('default')
      .primaryPalette('lnr-green')
      .accentPalette('lnr-blue')
      .backgroundPalette('lnr-background')
      .foregroundPalette = DARK_FOREGROUND;

    $mdThemingProvider.theme('lnr-dark')
      .backgroundPalette('lnr-background')
      .dark().foregroundPalette['3'] ='rgba(255,255,255,0.12)';
  }
]);
})();
'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
function getDecimals(n) {
  n = n + '';
  var i = n.indexOf('.');
  return (i == -1) ? 0 : n.length - i - 1;
}

function getVF(n, opt_precision) {
  var v = opt_precision;

  if (undefined === v) {
    v = Math.min(getDecimals(n), 3);
  }

  var base = Math.pow(10, v);
  var f = ((n * base) | 0) % base;
  return {v: v, f: f};
}

$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "vorm.",
      "nachm."
    ],
    "DAY": [
      "Sonntag",
      "Montag",
      "Dienstag",
      "Mittwoch",
      "Donnerstag",
      "Freitag",
      "Samstag"
    ],
    "ERANAMES": [
      "v. Chr.",
      "n. Chr."
    ],
    "ERAS": [
      "v. Chr.",
      "n. Chr."
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "Januar",
      "Februar",
      "M\u00e4rz",
      "April",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember"
    ],
    "SHORTDAY": [
      "So.",
      "Mo.",
      "Di.",
      "Mi.",
      "Do.",
      "Fr.",
      "Sa."
    ],
    "SHORTMONTH": [
      "Jan.",
      "Feb.",
      "M\u00e4rz",
      "Apr.",
      "Mai",
      "Juni",
      "Juli",
      "Aug.",
      "Sep.",
      "Okt.",
      "Nov.",
      "Dez."
    ],
    "STANDALONEMONTH": [
      "Januar",
      "Februar",
      "M\u00e4rz",
      "April",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, d. MMMM y",
    "longDate": "d. MMMM y",
    "medium": "dd.MM.y HH:mm:ss",
    "mediumDate": "dd.MM.y",
    "mediumTime": "HH:mm:ss",
    "short": "dd.MM.yy HH:mm",
    "shortDate": "dd.MM.yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20ac",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": ".",
    "PATTERNS": [
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 3,
        "minFrac": 0,
        "minInt": 1,
        "negPre": "-",
        "negSuf": "",
        "posPre": "",
        "posSuf": ""
      },
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "-",
        "negSuf": "\u00a0\u00a4",
        "posPre": "",
        "posSuf": "\u00a0\u00a4"
      }
    ]
  },
  "id": "de",
  "localeID": "de",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
'use strict';

angular.
  module('listnride').
  filter('category', function() {

    return function(categoryId) {
      switch(categoryId) {
        case 10: return "Holland"; break;
        case 11: return "Touring"; break;
        case 12: return "Fixie"; break;
        case 13: return "Single Speed"; break;

        case 20: return "Roadbike"; break;
        case 21: return "Triathlon"; break;
        case 22: return "Indoor"; break;

        case 30: return "Trecking"; break;
        case 31: return "Enduro"; break;
        case 32: return "Freeride"; break;
        case 33: return "Cross Country"; break;
        case 34: return "Downhill"; break;
        case 35: return "Cyclocross"; break;

        case 40: return "Children City"; break;
        case 41: return "Children Allterrain"; break;
        case 42: return "Children Road"; break;

        case 50: return "Pedelec"; break;
        case 51: return "E-Bike"; break;

        case 60: return "Folding"; break;
        case 61: return "Tandem"; break;
        case 62: return "Cruiser"; break;
        case 63: return "Cargo"; break;
        case 64: return "Recumbent"; break;
        case 65: return "Mono"; break;

        default: return ""; break;
      }
    }

  });
'use strict';

angular.
module('listnride').
filter('mapCategory', function() {

  return function (bikes, categories) {
    if (bikes == undefined) {
      return [];
    }

    var categoryValues = Object.keys(categories).map(function(key) {
        return categories[key];
    });

    var allFalse = categoryValues.every(function(value) {
      return value === false;
    });

    if (allFalse) {
      return bikes;
    }

    var categoryArray = [
      "city",
      "race",
      "allterrain",
      "kids",
      "ebikes",
      "special"
    ];

    return bikes.filter(function(bike) {
      var categoryIndex = Math.floor(bike.category / 10) - 1;
      return (categories[categoryArray[categoryIndex]] === true);
    });
  }

});
(function(){
'use strict';
angular.module('bike', []).component('bike', {
  templateUrl: 'app/modules/bike/bike.template.html',
  controllerAs: 'bike',
  controller: ['api', '$stateParams', '$mdDialog', '$mdMedia', 'NgMap',
    function BikeController(api, $stateParams, $mdDialog, $mdMedia, NgMap) {
      GalleryDialogController.$inject = ["$mdDialog", "bikeData"];
      var bike = this;

      bike.mapOptions = {
        lat: 0,
        lng: 0,
        zoom: 14,
        radius: 500
      };

      bike.mobileCalendar = function() {
        if ($mdMedia('xs') || $mdMedia('sm')) {
          return true;
        }
        else {
          return false;
        }
      };

      api.get('/rides/' + $stateParams.bikeId).then(
        function(response) {
          bike.data = response.data;
          bike.mapOptions.lat = bike.data.lat_rnd;
          bike.mapOptions.lng = bike.data.lng_rnd;
        },
        function(error) {
          console.log("Error retrieving bike", error);
        }
      );

      bike.showGalleryDialog = function(event) {
        $mdDialog.show({
          controller: GalleryDialogController,
          controllerAs: 'galleryDialog',
          templateUrl: 'app/modules/bike/galleryDialog.template.html',
          locals: {
            bikeData: bike.data
          },
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: true // Changed in CSS to only be for XS sizes
        })
        .then(function(answer) {
          //
        }, function() {
          //
        });
      };

      bike.showCalendarDialog = function() {
        $mdDialog.show({
          controller: CalendarDialogController,
          controllerAs: 'calendarDialog',
          templateUrl: 'app/modules/bike/calendarDialog.template.html',
          // contentElement: '#calendar-dialog',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: true // Only for -xs, -sm breakpoints.
        });
      }

      function GalleryDialogController($mdDialog, bikeData) {
        var galleryDialog = this;
        galleryDialog.image_1 = bikeData.image_file_1.image_file_1.url;
        galleryDialog.image_2 = bikeData.image_file_2.image_file_2.url;
        galleryDialog.image_3 = bikeData.image_file_3.image_file_3.url;
        galleryDialog.image_4 = bikeData.image_file_4.image_file_4.url;
        galleryDialog.image_5 = bikeData.image_file_5.image_file_5.url;
        galleryDialog.hide = function() {
          $mdDialog.hide();
        }
      }

      var CalendarDialogController = function() {
        var calendarDialog = this;
        calendarDialog.bike = bike;

        calendarDialog.hide = function() {
          $mdDialog.hide();
        }
      }
    }
  ]
});
})();

'use strict';

angular.module('bike').component('calendar', {
  templateUrl: 'app/modules/bike/calendar.template.html',
  controllerAs: 'calendar',
  bindings: {
    bikeId: '<',
    bikeFamily: '<',
    userId: '<',
    priceHalfDay: '<',
    priceDay: '<',
    priceWeek: '<',
    requests: '<'
  },
  controller: ['$scope', '$localStorage', '$state', '$mdDialog', 'date', 'api', 'authentication', 'verification',
    function CalendarController($scope, $localStorage, $state, $mdDialog, date, api, authentication, verification) {
      var calendar = this;
      calendar.authentication = authentication;

      initOverview();

      var deregisterRequestsWatcher = $scope.$watch('calendar.requests', function() {
        if (calendar.requests !== undefined) {
          deregisterRequestsWatcher();
          calendar.owner = calendar.userId == $localStorage.userId;
          if (calendar.bikeFamily == 2) {
            calendar.event.reserved();
          }
          angular.element('#bikeCalendar').dateRangePicker({
            alwaysOpen: true,
            container: '#bikeCalendar',
            beforeShowDay: classifyDate,
            inline: true,
            selectForward: true,
            showShortcuts: false,
            showTopbar: false,
            singleMonth: true,
            startOfWeek: 'monday'
          }).bind('datepicker-change', function(event, obj) {
            var start = obj.date1;
            start.setHours(calendar.startTime, 0, 0, 0);
            var end = obj.date2;
            end.setHours(calendar.endTime, 0, 0, 0);

            $scope.$apply(function() {
              calendar.startDate = start;
              calendar.endDate = end;
              dateChange(calendar.startDate, calendar.endDate);
            })
          });
        }
      });

      calendar.onTimeChange = function(slot) {
        var slotDate = slot + "Date";
        var slotTime = slot + "Time";
        var date = new Date(calendar[slotDate]);
        date.setHours(calendar[slotTime], 0, 0, 0);
        calendar[slotDate] = date;
        dateChange(calendar.startDate, calendar.endDate);
      };

      calendar.onBikeRequest = function() {
        $mdDialog.hide();
        api.get('/users/' + $localStorage.userId).then(
          function (success) {
            var user = success.data;
            if (calendar.bikeFamily == 2 || (user.has_address && user.confirmed_phone && user.status >= 1)) {
              var data = {
                user_id: $localStorage.userId,
                ride_id: calendar.bikeId,
                start_date: calendar.startDate.toISOString(),
                end_date: calendar.endDate.toISOString()
              };

              api.post('/requests', data).then(
                function(response) {
                  $state.go('requests', {requestId: response.data.id});
                  console.log("Success", response);
                },
                function(error) {
                  console.log("Error posting request", error);
                }
              );
            }
            else {
              verification.openDialog(false);
            }
          },
          function (error) {

          }
        );
      };

      calendar.isFormInvalid = function() {
        return calendar.bikeId === undefined || calendar.startDate === undefined || 
          (calendar.startDate !== undefined  && calendar.startDate.getTime() >= calendar.endDate.getTime());
      };

      calendar.isDateInvalid = function() {
        return calendar.startDate !== undefined  &&
          calendar.startDate.getTime() >= calendar.endDate.getTime();
      };

      /* ---------- CODE FOR THE EVENT CALENDAR ---------- */

      calendar.event = {};
      calendar.event.slotId;

      var slotDuration = 2;
      var eventYear = 2016;
      var eventMonth = 10;

      calendar.event.slots = [
        {overnight: false, reserved: false, day: 21, month: eventMonth, year: eventYear, text: "18:00 - 20:00", startTime: 18},
        {overnight: false, reserved: false, day: 21, month: eventMonth, year: eventYear, text: "20:00 - 22:00", startTime: 20},
        {overnight: true, reserved: false, day: 21, month: eventMonth, year: eventYear, text: "Overnight (22:00 - 10:00)", startTime: 22},
        {overnight: false, reserved: false, day: 22, month: eventMonth, year: eventYear, text: "10:00 - 12:00", startTime: 10},
        {overnight: false, reserved: false, day: 22, month: eventMonth, year: eventYear, text: "12:00 - 14:00", startTime: 12},
        {overnight: false, reserved: false, day: 22, month: eventMonth, year: eventYear, text: "14:00 - 16:00", startTime: 14},
        {overnight: false, reserved: false, day: 22, month: eventMonth, year: eventYear, text: "16:00 - 18:00", startTime: 16},
        {overnight: false, reserved: false, day: 22, month: eventMonth, year: eventYear, text: "18:00 - 20:00", startTime: 18},
        {overnight: false, reserved: false, day: 22, month: eventMonth, year: eventYear, text: "20:00 - 22:00", startTime: 20},
        {overnight: true, reserved: false, day: 22, month: eventMonth, year: eventYear, text: "Overnight (22:00 - 10:00)", startTime: 22},
        {overnight: false, reserved: false, day: 23, month: eventMonth, year: eventYear, text: "10:00 - 12:00", startTime: 10},
        {overnight: false, reserved: false, day: 23, month: eventMonth, year: eventYear, text: "12:00 - 14:00", startTime: 12},
        {overnight: false, reserved: false, day: 23, month: eventMonth, year: eventYear, text: "14:00 - 16:00", startTime: 14},
        {overnight: false, reserved: false, day: 23, month: eventMonth, year: eventYear, text: "16:00 - 18:00", startTime: 16}
      ];

      calendar.event.changeSlot = function() {
        var slot = calendar.event.slots[calendar.event.slotId];
        calendar.startDate = new Date(eventYear, eventMonth - 1, slot.day, slot.startTime, 0, 0, 0);

        if (slot.overnight) {
          calendar.endDate = new Date(eventYear, eventMonth - 1, slot.day + 1, 10, 0, 0, 0);
        }
        else {
          calendar.endDate = new Date(eventYear, eventMonth - 1, slot.day, slot.startTime + slotDuration, 0, 0, 0);
        }

        dateChange(calendar.startDate, calendar.endDate);
      };

      calendar.event.reserved = function() {
        for (var i = 0; i < calendar.requests.length; i ++) {
          console.log(i);
          var startDate = new Date(calendar.requests[i].start_date);
          var endDate = new Date(calendar.requests[i].end_date);

          var startDay = startDate.getDate();
          var endDay
          var startTime = startDate.getHours();
          var endTime = endDate.getHours();
          var startYear = startDate.getFullYear();
          var startMonth = startDate.getMonth();

          console.log(startDay, startTime, endTime);

          for (var j = 0; j < calendar.event.slots.length; j ++) {
            if (startYear == eventYear && startMonth == eventMonth - 1 && calendar.event.slots[j].day == startDay && calendar.event.slots[j].startTime >= startTime && (calendar.event.slots[j].overnight || calendar.event.slots[j].startTime + slotDuration <= endTime)) {
              calendar.event.slots[j].reserved = true;
            }
          }
        }
      };

      /* ------------------------------------------------- */

      function classifyDate(date) {
        date.setHours(0, 0, 0, 0);
        var now = new Date();
        now.setHours(0, 0, 0, 0);
        if (date.getTime() < now.getTime()) {
          return [false, "date-past", ""];
        } else if (isReserved(date)) {
          return [false, "date-reserved", ""];
        } else {
          return [true, "date-available", ""];
        }
      }

      function isReserved(date) {
        for (var i = 0; i < calendar.requests.length; ++i) {
          var start = new Date(calendar.requests[i].start_date);
          start.setHours(0,0,0,0);
          var end = new Date(calendar.requests[i].end_date);
          end.setHours(0,0,0,0);

          if (start.getTime() <= date.getTime()
            && date.getTime() <= end.getTime()) {
            return true;
          }
        }
        return false;
      }

      function initOverview() {
        calendar.startTime = 10;
        calendar.endTime = 18;

        calendar.duration = date.duration(undefined, undefined);
        calendar.subtotal = 0;
        calendar.lnrFee = 0;
        calendar.total = 0;

        calendar.formValid = false;
        calendar.datesValid = false;
      }

      function dateChange(startDate, endDate) {
        if (calendar.isDateInvalid()) {
          calendar.duration = date.duration(undefined, undefined);
          calendar.subtotal = 0;
          calendar.lnrFee = 0;
          calendar.total = 0;
        } else {
          calendar.duration = date.duration(startDate, endDate);
          var subtotal = date.subtotal(startDate, endDate, calendar.priceHalfDay, calendar.priceDay, calendar.priceWeek);
          var fee = subtotal * 0.125;
          var tax = fee * 0.19;
          calendar.subtotal = subtotal;
          calendar.lnrFee = fee + tax;
          calendar.total = subtotal + fee + tax;
        }
      }

    }
  ]
});

'use strict';

angular.module('edit', []).component('edit', {
  templateUrl: 'app/modules/edit/edit.template.html',
  controllerAs: 'edit',
  controller: ['$mdDialog', '$localStorage', '$state', '$stateParams', 'Upload', 'bikeOptions', 'api', 'accessControl', 'loadingDialog',
    function EditController($mdDialog, $localStorage, $state, $stateParams, Upload, bikeOptions, api, accessControl, loadingDialog) {
      if (accessControl.requireLogin()) {
        return;
      }
      
      var edit = this;

      edit.form = { images: [] };
      edit.selectedIndex = 0;
      edit.sizeOptions = bikeOptions.sizeOptions();
      edit.kidsSizeOptions = bikeOptions.kidsSizeOptions();
      edit.categoryOptions = bikeOptions.categoryOptions();
      edit.subcategoryOptions = bikeOptions.subcategoryOptions();
      edit.accessoryOptions = bikeOptions.accessoryOptions();

      api.get('/rides/' + $stateParams.bikeId).then(
        function(response) {
          var data = response.data;

          if (data.user.id == $localStorage.userId) {
            var images = [];
            for (var i = 1; i <= 5; ++i) {
              if (data["image_file_" + i] !== undefined &&
                data["image_file_" + i]["image_file_" + i].small.url !== null) {
                images.push({
                  src: data["image_file_" + i],
                  url: data["image_file_" + i]["image_file_" + i].small.url,
                  local: "false"
                });
              }
            }

            data.images = images;
            data.price_half_daily = parseInt(data.price_half_daily);
            data.price_daily = parseInt(data.price_daily);
            data.price_weekly = parseInt(data.price_weekly);
            data.size = parseInt(data.size);
            data.mainCategory = (data.category + "").charAt(0);
            data.subCategory = (data.category + "").charAt(1);
            edit.form = data;
          }
        },
        function(error) {
          console.log("Error editing bike", error);
        }
      );

      edit.onFormSubmit = function() {
        edit.submitDisabled = true;
        loadingDialog.open();

        var ride = {
          "ride[name]": edit.form.name,
          "ride[brand]": edit.form.brand,
          "ride[description]": edit.form.description,
          "ride[size]": edit.form.size,
          "ride[category]": edit.form.mainCategory.concat(edit.form.subCategory),
          "ride[has_lock]": edit.form.has_lock || false,
          "ride[has_helmet]": edit.form.has_helmet || false,
          "ride[has_lights]": edit.form.has_lights || false,
          "ride[has_basket]": edit.form.has_basket || false,
          "ride[has_trailer]": edit.form.has_trailer || false,
          "ride[has_childseat]": edit.form.has_childseat || false,
          "ride[user_id]": $localStorage.userId,
          "ride[street]": edit.form.street,
          "ride[city]": edit.form.city,
          "ride[zip]": edit.form.zip,
          "ride[country]": edit.form.country,
          "ride[price_half_daily]": edit.form.price_half_daily,
          "ride[price_daily]": edit.form.price_daily,
          "ride[price_weekly]": edit.form.price_weekly,
          "ride[image_file_1]": (edit.form.images[0]) ? edit.form.images[0].src : undefined,
          "ride[image_file_2]": (edit.form.images[1]) ? edit.form.images[1].src : undefined,
          "ride[image_file_3]": (edit.form.images[2]) ? edit.form.images[2].src : undefined,
          "ride[image_file_4]": (edit.form.images[3]) ? edit.form.images[3].src : undefined,
          "ride[image_file_5]": (edit.form.images[4]) ? edit.form.images[4].src : undefined
        };
        
        Upload.upload({
          method: 'PUT',
          url: api.getApiUrl() + '/rides/' + $stateParams.bikeId,
          data: ride,
          headers: {
            'Authorization': $localStorage.auth
          }
        }).then(
          function(response) {
            loadingDialog.close();
            $state.go("bike", {bikeId: response.data.id});
            console.log("Success", response);
          },
          function(error) {
            edit.submitDisabled = false;
            hloadingDialog.close();
            console.log("Error while listing bike", error);
          }
        );
      };

      edit.nextTab = function() {
        edit.selectedIndex = edit.selectedIndex + 1;
        console.log(edit.form);
      }

      edit.previousTab = function() {
        edit.selectedIndex = edit.selectedIndex - 1;
        console.log(edit.form);
      }

      edit.addImage = function(files) {
        if (files && files.length)
          for (var i = 0; i < files.length && edit.form.images.length < 5; ++i)
            if (files[i] != null)
              edit.form.images.push({src: files[i], local: "true"});
      };

      edit.removeImage = function(index) {
        edit.form.images.splice(index, 1);
        console.log(edit.form.images);
      };

      edit.isFormValid = function() {
        return isCategoryValid() &&
          isDetailsValid() &&
          isPictureValid() &&
          isLocationValid() &&
          isPricingValid();
      };

      edit.categoryChange = function(oldCategory) {
        if (edit.form.mainCategory == 4 || oldCategory == 4) {
          edit.form.size = undefined;
        }
      };

      edit.fillAddress = function(place) {
        var components = place.address_components;
        if (components) {
          var desiredComponents = {
            "street_number": "",
            "route": "",
            "locality": "",
            "country": "",
            "postal_code": ""
          };

          for (var i = 0; i < components.length; i++) {
            var type = components[i].types[0];
            if (type in desiredComponents) {
              desiredComponents[type] = components[i].long_name;
            }
          }

          edit.form.street = desiredComponents.route + " " + desiredComponents.street_number;
          edit.form.zip = desiredComponents.postal_code;
          edit.form.city = desiredComponents.locality;
          edit.form.country = desiredComponents.country;
        }
      };

      function isCategoryValid() {
        return edit.form.mainCategory !== undefined &&
          edit.form.subCategory !== undefined;
      };

      function isDetailsValid() {
        return edit.form.name !== undefined &&
          edit.form.brand !== undefined &&
          edit.form.size !== undefined &&
          edit.form.description !== undefined;
      };

      function isPictureValid() {
        return edit.form.images.length > 0;
      };

      function isLocationValid() {
        return edit.form.street !== undefined &&
          edit.form.zip !== undefined &&
          edit.form.city !== undefined &&
          edit.form.country !== undefined;
      };

      function isPricingValid() {
        return edit.form.price_half_daily !== undefined &&
          edit.form.price_daily !== undefined &&
          edit.form.price_weekly !== undefined;
      };

    }
  ]
});

(function(){
'use strict';
angular.module('footer', ['pascalprecht.translate']).component('footer', {
  templateUrl: 'app/modules/footer/footer.template.html',
  controllerAs: 'footer',
  controller: [
    '$window', '$translate',
    function FooterController($window, $translate) {
      var footer = this;

      footer.language = getLanguage($translate.use());

      footer.switchLanguage = function(locale) {
        $translate.use(locale).then(function(data) {
          footer.language = getLanguage(locale);
          document.querySelector("md-content.single-column").scrollTop = 0;
        });
      }
      footer.onFacebookClick = function() {
        $window.open('https://www.facebook.com/Listnride', '_blank');
      }    

      footer.onInstagramClick = function() {
        $window.open('https://instagram.com/listnride/', '_blank');
      }
      
      footer.onAppClick = function() {
        $window.open('https://itunes.apple.com/de/app/list-n-ride/id992114091?l=' + $translate.use(), '_blank');
      }

      function getLanguage(locale) {
        if (locale === 'en') {
          return 'English';
        } else if (locale === 'de') {
          return 'Deutsch';
        } else {
          return 'English';
        }
      }
    }
  ]
});
})();

(function(){
'use strict';
angular.module('header',[]).component('header', {
  templateUrl: 'app/modules/header/header.template.html',
  controllerAs: 'header',
  controller: ['$mdSidenav', '$localStorage', 'api', 'authentication', 'verification',
    function HeaderController($mdSidenav, $localStorage, api, authentication, verification) {
      var header = this;
      header.authentication = authentication;
      header.verification = verification;
      header.name = $localStorage.name;
      header.userId = $localStorage.userId;
      // Contains the amount of unread messages to be displayed in the header
      header.unreadMessages = $localStorage.unreadMessages;

      header.toggleSidebar = function() {
        $mdSidenav('right').toggle();
      }
      
    }
  ]
});
})();


(function(){
'use strict';
angular.module('home',[]).component('home', {
  templateUrl: 'app/modules/home/home.template.html',
  controllerAs: 'home',
  controller: [ '$state', 'api',
    function HomeController($state, api) {
      var home = this;

      api.get("/featured").then(function(response) {
        home.featuredBikes = response.data.slice(0,6);
      });

      home.onSearch = function() {
        // TODO: This is coding excrement.
        // use the angular way to do things.
        // fix the google autocomplete and all will work.
        var myLocation = document.querySelector("#home.autocompleteSearch").value;
        $state.go('search', {location: myLocation});
      };
    }
  ]
});
})();

(function(){
'use strict';
angular.module('list',[]).component('list', {
  templateUrl: 'app/modules/list/list.template.html',
  controllerAs: 'list',
  controller: ['$mdDialog', '$localStorage', '$state', '$scope', 'Upload', 'bikeOptions', 'api', '$timeout', 'verification', 'accessControl', 'loadingDialog',
    function ListController($mdDialog, $localStorage, $state, $scope, Upload, bikeOptions, api, $timeout, verification, accessControl, loadingDialog) {
      if (accessControl.requireLogin()) {
        return;
      }

      var list = this;

      list.form = {
        images: []
      };

      // api.get('/users/' + $localStorage.userId).then(
      //   function (success) {
      //     var user = success.data;
      //     if (!user.has_address || !user.confirmed_phone || user.status == 0) {
      //       verification.openDialog(true);
      //     }
      //     list.form.street = user.street;
      //     list.form.zip = user.zip;
      //     list.form.city = user.city;
      //     list.form.country = user.country;
      //   },
      //   function (error) {
      //     console.log("Error fetching User");
      //   }
      // );

      list.selectedIndex = 0;
      list.sizeOptions = bikeOptions.sizeOptions();
      list.kidsSizeOptions = bikeOptions.kidsSizeOptions();
      list.categoryOptions = bikeOptions.categoryOptions();
      list.subcategoryOptions = bikeOptions.subcategoryOptions();
      list.accessoryOptions = bikeOptions.accessoryOptions();

      list.onFormSubmit = function() {


        list.submitDisabled = true;
        loadingDialog.open();

        var ride = {
          "ride[name]": list.form.name,
          "ride[brand]": list.form.brand,
          "ride[description]": list.form.description,
          "ride[size]": list.form.size,
          "ride[category]": list.form.mainCategory.concat(list.form.subCategory),
          "ride[has_lock]": list.form.has_lock || false,
          "ride[has_helmet]": list.form.has_helmet || false,
          "ride[has_lights]": list.form.has_lights || false,
          "ride[has_basket]": list.form.has_basket || false,
          "ride[has_trailer]": list.form.has_trailer || false,
          "ride[has_childseat]": list.form.has_childseat || false,
          "ride[user_id]": $localStorage.userId,
          "ride[street]": list.form.street,
          "ride[city]": list.form.city,
          "ride[zip]": list.form.zip,
          "ride[country]": list.form.country,
          "ride[price_half_daily]": list.form.price_half_daily,
          "ride[price_daily]": list.form.price_daily,
          "ride[price_weekly]": list.form.price_weekly,
          "ride[image_file_1]": list.form.images[0],
          "ride[image_file_2]": list.form.images[1],
          "ride[image_file_3]": list.form.images[2],
          "ride[image_file_4]": list.form.images[3],
          "ride[image_file_5]": list.form.images[4]
        };

        api.get('/users/' + $localStorage.userId).then(
          function (success) {
            var user = success.data;
            if (!user.has_address || !user.confirmed_phone || user.status == 0) {
              verification.openDialog(false);
              list.submitDisabled = false;
            } else {
              Upload.upload({
                method: 'POST',
                url: api.getApiUrl() + '/rides',
                data: ride,
                headers: {
                  'Authorization': $localStorage.auth
                }
              }).then(
                function(response) {
                  loadingDialog.close();
                  $state.go("listings");
                },
                function(error) {
                  list.submitDisabled = false;
                  loadingDialog.close();
                  console.log("Error while listing bike", error);
                }
              );
            }
          },
          function (error) {
            console.log("Error fetching User");
          }
        );

      };

      list.nextTab = function() {
        list.selectedIndex = list.selectedIndex + 1;
      }

      list.previousTab = function() {
        list.selectedIndex = list.selectedIndex - 1;
      }

      list.addImage = function(files) {
        if (files && files.length)
          for (var i = 0; i < files.length && list.form.images.length < 5; ++i)
            if (files[i] != null)
              list.form.images.push(files[i]);
      };

      list.removeImage = function(index) {
        list.form.images.splice(index, 1);
      }

      list.isCategoryValid = function() {
        return list.form.mainCategory !== undefined &&
          list.form.subCategory !== undefined;
      };

      list.isDetailsValid = function() {
        return list.form.name !== undefined &&
          list.form.brand !== undefined &&
          list.form.size !== undefined &&
          list.form.description !== undefined;
      };

      list.isPictureValid = function() {
        return list.form.images.length > 0;
      };

      list.isLocationValid = function() {
        return list.form.street !== undefined &&
          list.form.zip !== undefined &&
          list.form.city !== undefined &&
          list.form.country !== undefined;
      };

      list.isPricingValid = function() {
        return list.form.price_half_daily !== undefined &&
          list.form.price_daily !== undefined &&
          list.form.price_weekly !== undefined;
      };

      list.categoryChange = function(oldCategory) {
        if (list.form.mainCategory == 4 || oldCategory == 4) {
          list.form.size = undefined;
        }
      };

      list.fillAddress = function(place) {
        var components = place.address_components;
        if (components) {
          var desiredComponents = {
            "street_number": "",
            "route": "",
            "locality": "",
            "country": "",
            "postal_code": ""
          };

          for (var i = 0; i < components.length; i++) {
            var type = components[i].types[0];
            if (type in desiredComponents) {
              desiredComponents[type] = components[i].long_name;
            }
          }

          list.form.street = desiredComponents.route + " " + desiredComponents.street_number;
          list.form.zip = desiredComponents.postal_code;
          list.form.city = desiredComponents.locality;
          list.form.country = desiredComponents.country;
        }
      };

    }
  ]
});
})();

(function(){
'use strict';
angular.module('listingABike',[]).component('listingABike', {
  templateUrl: 'app/modules/listing-a-bike/listing-a-bike.template.html',
  controllerAs: 'listingABike',
  controller: [ 'authentication',
    function HomeController(authentication) {
      var listingABike = this;

      listingABike.authentication = authentication;
    }
  ]
});
})();
(function(){
'use strict';
angular.module('listings',[]).component('listings', {
  templateUrl: 'app/modules/listings/listings.template.html',
  controllerAs: 'listings',
  controller: ['$localStorage', 'api', 'accessControl',
    function ListingsController($localStorage, api, accessControl) {
      if (accessControl.requireLogin()) {
        return
      }
      var listings = this;

      api.get('/users/' + $localStorage.userId + "/rides").then(
        function(response) {
          console.log(response.data);
          listings.bikes = response.data;
        },
        function(error) {
          console.log("Error retrieving User", error);
        }
      );

      listings.removeBike = function(bikeId) {
        listings.bikes = listings.bikes.filter(function(bike) {
          return bike.id != bikeId;
        })
      };  
    }
  ]
});
})();
(function(){
'use strict';
angular.module('requests',[]).component('requests', {
  templateUrl: 'app/modules/requests/requests.template.html',
  controllerAs: 'requests',
  controller: ['$localStorage', '$interval', '$mdMedia', '$mdDialog', '$window', 'api', '$timeout', '$location', '$anchorScroll', '$state', '$stateParams', '$translate', 'date', 'accessControl',
    function RequestsController($localStorage, $interval, $mdMedia, $mdDialog, $window, api, $timeout, $location, $anchorScroll, $state, $stateParams, $translate, date, accessControl) {
      if (accessControl.requireLogin()) {
        return;
      }

      var requests = this;
      var poller;

      requests.requests = [];
      requests.request = {};
      requests.message = "";
      requests.showChat = false;
      requests.$mdMedia = $mdMedia;
      requests.request.glued = false;
      requests.loadingList = true;
      requests.loadingChat = false;
      requests.request.rideChat;
      requests.request.chatFlow;
      requests.userId = $localStorage.userId;

      api.get('/users/' + $localStorage.userId + '/requests').then(
        function(success) {
          requests.requests = success.data;
          requests.loadingList = false;
          if ($stateParams.requestId) {
            requests.loadRequest($stateParams.requestId);
          }
        },
        function(error) {
          console.log("Error fetching request list");
          requests.loadingList = false;
        }
      );

      var hideDialog = function() {
        // For small screens, show Chat Dialog again
        if ($mdMedia('xs')) {
          showChatDialog();
        } else {
          $mdDialog.hide();
        }
      }

      // Handles initial request loading
      requests.loadRequest = function(requestId) {
        $state.go(".", { requestId: requestId }, {notify: false});
        requests.loadingChat = true;
        // Cancel the poller
        $interval.cancel(poller);
        // Clear former request
        requests.request = {};
        // Load the new request and activate the poller
        reloadRequest(requestId);
        poller = $interval(function() {
            reloadRequest(requestId);
        }, 10000);

        // For small screens, disable the embedded chat and show chat in a fullscreen dialog instead
        if ($mdMedia('xs')) {
          requests.showChat = false;
          showChatDialog();
        } else {
          requests.showChat = true;
        }
      };

      requests.profilePicture = function(request) {
        if ($localStorage.userId == request.user.id) {
          return request.ride.image_file_1.thumb.url;
        } else {
          return request.user.profile_picture.url;
        }
      };

      var reloadRequest = function(requestId) {
        api.get('/requests/' + requestId).then(
          function(success) {
            // On initial load
            if (requests.request.messages == null || requests.request.messages.length != success.data.messages.length) {
              requests.request = success.data;
              requests.request.glued = true;
              requests.request = success.data;
              requests.request.rideChat = $localStorage.userId == requests.request.user.id;
              requests.request.rideChat? requests.request.chatFlow = "rideChat" : requests.request.chatFlow = "listChat";

              if (requests.request.rideChat) {
                requests.request.rating = requests.request.lister.rating_lister + requests.request.lister.rating_rider;
                if (requests.request.lister.rating_lister != 0 || requests.request.lister.rating_rider != 0) {
                  requests.request.rating = requests.request.rating / 2
                }
              }
              else {
                requests.request.rating = requests.request.user.rating_lister + requests.request.user.rating_rider;
                if (requests.request.user.rating_lister != 0 || requests.request.user.rating_rider != 0) {
                  requests.request.rating = requests.request.rating / 2
                }
              }
              requests.request.rating = Math.round(requests.request.rating);

              requests.loadingChat = false;
            }
            api.post('/requests/' + requestId + '/messages/mark_as_read', {"user_id": $localStorage.userId}).then(
              function (success) {
              },
              function (error) {
                //
              }
            );
          },
          function(error) {
            requests.loadingChat = false;
            console.log("Error fetching request!");
          }
        );
      };

      // This function handles booking and all necessary validations
      requests.confirmBooking = function() {
        api.get('/users/' + $localStorage.userId).then(
          function (success) {
            if (requests.request.ride.family == 2 || success.data.current_payment_method) {
              showBookingDialog();
            } else {
              // User did not enter any payment method yet
              showPaymentDialog();
            }
          },
          function (error) {
            console.log("Error retrieving User Details");
          }
        );
      }

      var showPaymentDialog = function(event) {
        $mdDialog.show({
          controller: PaymentDialogController,
          controllerAs: 'paymentDialog',
          templateUrl: 'app/modules/requests/paymentDialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: false // Only for -xs, -sm breakpoints.
        });
      }

      var showChatDialog = function(event) {
        $mdDialog.show({
          controller: ChatDialogController,
          controllerAs: 'chatDialog',
          templateUrl: 'app/modules/requests/chatDialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: true // Only for -xs, -sm breakpoints.
        });
      }

      var showBookingDialog = function(event) {
        $mdDialog.show({
          controller: BookingDialogController,
          controllerAs: 'bookingDialog',
          templateUrl: 'app/modules/requests/bookingDialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: true // Only for -xs, -sm breakpoints.
        });
      };

      requests.showRatingDialog = function(event) {
        $mdDialog.show({
          controller: RatingDialogController,
          controllerAs: 'ratingDialog',
          templateUrl: 'app/modules/requests/ratingDialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: true // Only for -xs, -sm breakpoints.
        });
      };

      // Fires if scope gets destroyed and cancels poller
      requests.$onDestroy = function() {
        $interval.cancel(poller);
      };

      // Sends a new message by directly appending it locally and posting it to the API
      requests.sendMessage = function() {
        requests.request.glued = true
        if( requests.message ) {
          var data = {
            "request_id": requests.request.id,
            "sender": $localStorage.userId,
            "content": requests.message,
            "is_read": false
          };
          var message = {
            "message": data
          };
          requests.request.messages.push(data);
          api.post('/messages', message).then(function(success) {
            reloadRequest(requests.request.id);
          }, function(error) {
            console.log("Error occured sending message");
          });
        } else {
          confirmBooking();
        }
        requests.message = "";
      };

      var ChatDialogController = function() {
        var chatDialog = this;
        chatDialog.requests = requests;

        // $timeout(function() {
        //   $location.hash('end');
        //   $anchorScroll();
        // }, 2000);

        chatDialog.hide = function() {
          $mdDialog.hide();
        };
      };

      var BookingDialogController = function() {
        var bookingDialog = this;
        bookingDialog.requests = requests;
        bookingDialog.duration = date.duration(requests.request.start_date, requests.request.end_date);

        bookingDialog.hide = hideDialog;

        bookingDialog.book = function() {
          var data = {
            "request": {
              "status": 3
            }
          };
          bookingDialog.hide();
          requests.loadingChat = true;
          api.put("/requests/" + requests.request.id, data).then(
            function(success) {
              reloadRequest(requests.request.id);
            },
            function(error) {
              reloadRequest(requests.request.id);
              console.log("error updating request");
            }
          );
        };
      };

      var PaymentDialogController = function() {
        var paymentDialog = this;

        paymentDialog.openPaymentForm = function() {
          var w = 550;
          var h = 700;
          var left = (screen.width / 2) - (w / 2);
          var top = (screen.height / 2) - (h / 2);

          var locale = $translate.proposedLanguage();
          console.log(locale);

          $window.open("https://listnride-staging.herokuapp.com/v2/users/" + $localStorage.userId + "/payment_methods/new", "popup", "width="+w+",height="+h+",left="+left+",top="+top);
          // For small screens, show Chat Dialog again
          hideDialog();
        }
      };

      var RatingDialogController = function() {
        var ratingDialog = this;

        ratingDialog.rating = 5;

        ratingDialog.rate = function() {
          var data = {
            "rating": {
              "score": ratingDialog.rating,
              "message": ratingDialog.message,
              "author_id": $localStorage.userId,
            }
          };
          var newStatus;

          if (requests.request.rideChat) {
            data.rating.ride_id = requests.request.ride.id;
            newStatus = 6;
          }
          else {
            data.rating.user_id = requests.request.user.id;
            newStatus = 5
          }

          requests.loadingChat = true;
          ratingDialog.hide();
          api.post('/ratings', data).then(
            function(success) {
              var data = {
                "request": {
                  "status": newStatus
                }
              };
              api.put("/requests/" + requests.request.id, data).then(
                function(success) {
                  reloadRequest(requests.request.id);
                },
                function(error) {
                  reloadRequest(requests.request.id);
                  console.log("error updating request");
                }
              );
              },
            function(error) {
              console.log("Error occured while rating");
            }
          );
        };

        ratingDialog.hide = hideDialog;
      }

    }
  ]
});
})();

(function(){
'use strict';
angular.module('search',[]).component('search', {
  templateUrl: 'app/modules/search/search.template.html',
  controllerAs: 'search',
  bindings: {
    location: '<'
  },
  controller: ['$translate', '$http', '$stateParams', '$state', 'NgMap', 'api',
    function SearchController($translate, $http, $stateParams, $state, NgMap, api) {
      var search = this;

      search.location = $stateParams.location;

      search.sizeFilter = {
        size: $stateParams.size
      };

      search.categoryFilter = {
        allterrain: $stateParams.allterrain == "true",
        city: $stateParams.city == "true",
        ebikes: $stateParams.ebikes == "true",
        kids: $stateParams.kids == "true",
        race: $stateParams.race == "true",
        special: $stateParams.special == "true"
      };

      search.sizeOptions = [
        {value: "", label: "-"},
        {value: 155, label: "155 - 165"},
        {value: 165, label: "165 - 175"},
        {value: 175, label: "175 - 185"},
        {value: 185, label: "185 - 195"},
        {value: 195, label: "195 - 205"}
      ];

      $translate('search.all-sizes').then(function (translation) {
        search.sizeOptions[0].label = translation;
      });

      search.mapOptions = {
        lat: 40,
        lng: -74,
        zoom: 5
      };

      populateBikes();

      NgMap.getMap({id: "searchMap"}).then(function(map) {
        console.log(map, map.infoWindows.infoWindow);
        search.map = map;
      });

      search.showBikeWindow = function(evt, bikeId) {
        if (search.map) {
          search.selectedBike = search.bikes.find(function(bike) {
            return bike.id == bikeId;
          });

          search.map.showInfoWindow('searchMapWindow', this);
        }
      };

      search.onLocationChange = function() {
        // TODO: This is coding excrement.
        // use the angular way to do things.
        // fix the google autocomplete and all will work.
        var myLocation = document.querySelector("#search.autocompleteSearch").value;
        search.location = myLocation;
        $state.go('.', {location: myLocation}, {notify: false});
        search.bikes = undefined;
        populateBikes();
      };

      search.onSizeChange = function() {
        $state.go('.', {size: search.sizeFilter.size}, {notify: false});
      };

      search.onCategoryChange = function(category) {
        var categoryMap = {};
        categoryMap[category] = search.categoryFilter[category];
        $state.go('.', categoryMap, {notify: false});
      };

      search.onMapClick = function(event) {
        if (search.map) {
          search.map.hideInfoWindow('searchMapWindow');
          search.selectedBike = undefined;
        }
      };

      function populateBikes() {
        api.get("/rides?location=" + search.location).then(function(response) {
          search.bikes = response.data;

          if (search.bikes.length > 0) {
            search.mapOptions.lat = search.bikes[0].lat_rnd;
            search.mapOptions.lng = search.bikes[0].lng_rnd;
            search.mapOptions.zoom = 10;
          } else {
            search.mapOptions.lat = 51.1657;
            search.mapOptions.lng = 10.4515;
            search.mapOptions.zoom = 4;
          }
        }, function(error) {
          console.log("Error retrieving bikes");
        });
      }

    }
  ]
});
})();

(function(){
'use strict';
angular.module('settings',[]).component('settings', {
  templateUrl: 'app/modules/settings/settings.template.html',
  controllerAs: 'settings',
  controller: ['$localStorage', '$window', '$mdToast', '$translate', 'api', 'accessControl', 'sha256', 'Base64', 'Upload', 'loadingDialog',
    function SettingsController($localStorage, $window, $mdToast, $translate, api, accessControl, sha256, Base64, Upload, loadingDialog) {
      if (accessControl.requireLogin()) {
        return;
      }

      var settings = this;
      settings.user = {};
      settings.loaded = false;
      settings.payoutMethod = {};
      settings.password = "";

      api.get('/users/' + $localStorage.userId).then(
        function(response) {
          settings.user = response.data;
          console.log(settings.user)
          settings.loaded = true;
        },
        function(error) {
          console.log("Error retrieving User", error);
        }
      );

      settings.addPayoutMethod = function() {
        var data = {
          "payment_method": settings.payoutMethod
        };

        data.payment_method.user_id = $localStorage.userId;

        if (settings.payoutMethod.family == 1) {
          data.payment_method.email = "";
        }
        else {
          data.payment_method.iban = "";
          data.payment_method.bic = "";
        }

        api.post('/users/' + $localStorage.userId + '/payment_methods', data).then(
          function (success) {
            $mdToast.show(
              $mdToast.simple()
              .textContent($translate.instant('toasts.add-payout-success'))
              .hideDelay(4000)
              .position('top center')
            );
          },
          function (error) {
            $mdToast.show(
              $mdToast.simple()
              .textContent($translate.instant('toasts.error'))
              .hideDelay(4000)
              .position('top center')
            );
          }
        );
      };

      settings.addVoucher = function() {
        var data = {
          "voucher": {
            "code": settings.voucherCode
          }
        };

        api.post('/vouchers', data).then(
          function (success) {
            settings.user.balance = parseInt(settings.user.balance) + parseInt(success.data.value);
            settings.voucherCode = "";
            $mdToast.show(
              $mdToast.simple()
              .textContent($translate.instant('toasts.add-voucher-success'))
              .hideDelay(4000)
              .position('top center')
            );
          },
          function (error) {
            settings.voucherCode = "";
            $mdToast.show(
              $mdToast.simple()
              .textContent($translate.instant('toasts.add-voucher-error'))
              .hideDelay(4000)
              .position('top center')
            );
          }
        );
      };

      settings.updateUser = function() {
        var data = {
          "user": {
            "description": settings.user.description,
            "profile_picture": settings.profilePicture,
            "street": settings.user.street,
            "zip": settings.user.zip,
            "city": settings.user.city,
            "country": settings.user.country
          }
        };

        if (settings.password && settings.password.length >= 6) {
          console.log("Updating Password");
          data.user.password_hashed = sha256.encrypt(settings.password);
        }

        loadingDialog.open();

        Upload.upload({
          method: 'PUT',
          url: api.getApiUrl() + '/users/' + $localStorage.userId,
          data: data,
          headers: {
            'Authorization': $localStorage.auth
          }
        }).then(
          function (success) {
            loadingDialog.close();
            $mdToast.show(
              $mdToast.simple()
              .textContent($translate.instant('toasts.update-profile-success'))
              .hideDelay(4000)
              .position('top center')
            );
            settings.user = success.data;
            $localStorage.profilePicture = success.data.profile_picture.profile_picture.url;
            var encoded = Base64.encode(success.data.email + ":" + success.data.password_hashed);
            $localStorage.auth = 'Basic ' + encoded;
          },
          function (error) {
            loadingDialog.close();
            $mdToast.show(
              $mdToast.simple()
              .textContent($translate.instant('toasts.error'))
              .hideDelay(4000)
              .position('top center')
            );
          }
        );
      }

      settings.openPaymentWindow = function() {
        var w = 550;
          var h = 700;
          var left = (screen.width / 2) - (w / 2);
          var top = (screen.height / 2) - (h / 2);

          $window.open("https://api.listnride.com/v2/users/" + $localStorage.userId + "/payment_methods/new", "popup", "width="+w+",height="+h+",left="+left+",top="+top);
      };
    }
  ]
});
})();
(function(){
'use strict';
angular.module('header',[]).component('sidebar', {
  templateUrl: 'app/modules/sidebar/sidebar.template.html',
  controllerAs: 'sidebar',
  controller: ['$mdSidenav', '$localStorage', 'authentication',
    function SidebarController($mdSidenav, $localStorage, authentication) {
      var sidebar = this;
      sidebar.authentication = authentication;
      sidebar.userId = $localStorage.userId;
      
      sidebar.toggle = function() {
        $mdSidenav('right').toggle();
      };
    }
  ]
});
})();
(function(){
'use strict';
angular.module('static',[]).component('static', {
  controllerAs: 'static',
  controller: ['$translate',
    function SettingsController($translate) {
      if (accessControl.requireLogin()) {
        return;
      }

    }
  ]
});
})();

(function(){
'use strict';
angular.module('user',[]).component('user', {
  templateUrl: 'app/modules/user/user.template.html',
  controllerAs: 'user',
  controller: ['$localStorage', '$stateParams', 'api',
    function ProfileController($localStorage, $stateParams, api) {
      var user = this;
      user.loaded = false;

      var userId;
      $stateParams.userId? userId = $stateParams.userId : userId = 1282;

      api.get('/users/' + userId).then(
        function(response) {
          console.log(response.data);
          user.user = response.data;
          user.loaded = true;
          user.rating = (user.user.lister_rating + user.user.rider_rating);
          if (user.user.lister_rating != 0 && user.user.rider_rating != 0) {
            user.rating = user.rating / 2;
          }
          user.rating = Math.round(user.rating);
        },
        function(error) {
          console.log("Error retrieving User", error);
        }
      );
    }
  ]
});
})();

'use strict';

angular.
  module('listnride').
  factory('Base64', function() {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
      'QRSTUVWXYZabcdef' +
      'ghijklmnopqrstuv' +
      'wxyz0123456789+/' +
      '=';
    return {
      encode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;
      
        do {
          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);
      
          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;
      
          if (isNaN(chr2)) {
            enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
            enc4 = 64;
          }
      
          output = output +
            keyStr.charAt(enc1) +
            keyStr.charAt(enc2) +
            keyStr.charAt(enc3) +
            keyStr.charAt(enc4);
          chr1 = chr2 = chr3 = "";
          enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);
    
        return output;
      },
    
      decode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;
      
        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
          alert("There were invalid base64 characters in the input text.\n" +
            "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
            "Expect errors in decoding.");
          }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      
        do {
          enc1 = keyStr.indexOf(input.charAt(i++));
          enc2 = keyStr.indexOf(input.charAt(i++));
          enc3 = keyStr.indexOf(input.charAt(i++));
          enc4 = keyStr.indexOf(input.charAt(i++));
      
          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;
          
          output = output + String.fromCharCode(chr1);
      
          if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
          }
          if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
          }
      
          chr1 = chr2 = chr3 = "";
          enc1 = enc2 = enc3 = enc4 = "";
      
        } while (i < input.length);
      
        return output;
      }
    };
  });
'use strict';

angular
.module('listnride')
.factory('bikeOptions', [
  function() {

    return {
      accessoryOptions: function() {
        return [
          {model: "has_lock", label: "lock"},
          {model: "has_helmet", label: "helmet"},
          {model: "has_lights", label: "lights"},
          {model: "has_basket", label: "basket"},
          {model: "has_trailer", label: "trailer"},
          {model: "has_childseat", label: "childseat"}
        ]
      },

      sizeOptions: function() {
        return [
          {value: 155, label: "155 cm - 165 cm"},
          {value: 165, label: "165 cm - 175 cm"},
          {value: 175, label: "175 cm - 185 cm"},
          {value: 185, label: "185 cm - 195 cm"},
          {value: 195, label: "195 cm - 205 cm"}
        ];
      },

      kidsSizeOptions: function() {
        return [
          {value: 85, label: "85 cm - 95 cm"},
          {value: 95, label: "95 cm - 105 cm"},
          {value: 105, label: "105 cm - 115 cm"},
          {value: 115, label: "115 cm - 125 cm"},
          {value: 125, label: "125 cm - 135 cm"},
          {value: 135, label: "135 cm - 145 cm"},
          {value: 145, label: "145 cm - 155 cm"}
        ];
      },

      categoryOptions: function() {
        return [
          {value: 1, label: "city"},
          {value: 2, label: "race"},
          {value: 3, label: "all terrain"},
          {value: 4, label: "kids"},
          {value: 5, label: "electro"},
          {value: 6, label: "special"}
        ];
      },

      subcategoryOptions: function() {
        return {
          "1": [
            {value: 0, label: "dutch-bike"},
            {value: 1, label: "touring-bike"},
            {value: 2, label: "fixie"},
            {value: 3, label: "single-speed"}
          ],
          "2": [
            {value: 0, label: "road-bike"},
            {value: 1, label: "triathlon"},
            {value: 2, label: "indoor"}
          ],
          "3": [
            {value: 0, label: "tracking"},
            {value: 1, label: "enduro"},
            {value: 2, label: "freeride"},
            {value: 3, label: "cross-country"},
            {value: 4, label: "downhill"},
            {value: 5, label: "cyclocross"}
          ],
          "4": [
            {value: 0, label: "city"},
            {value: 1, label: "all-terrain"},
            {value: 2, label: "road"},
          ],
          "5": [
            {value: 0, label: "pedelec"},
            {value: 1, label: "e-bike"},
          ],
          "6": [
            {value: 0, label: "folding-bike"},
            {value: 1, label: "tandem"},
            {value: 2, label: "cruiser"},
            {value: 3, label: "cargo-bike"},
            {value: 4, label: "recumbent"},
            {value: 5, label: "mono-bike"}
          ],
        };
      }

    };

  }
]);
'use strict';

angular.module('listnride').factory('date', ['$translate',
  function($translate) {

    return {
      duration: function(startDate, endDate) {
        if (startDate === undefined || endDate === undefined) {
          return "0 " + $translate.instant("shared.days") + " , 0 " + $translate.instant("shared.hours");
        } else {
          var startDate = new Date(startDate);
          var endDate = new Date(endDate);
          var diff = Math.abs(startDate - endDate);

          var seconds = (diff / 1000) | 0;
          diff -= seconds * 1000;
          var minutes = (seconds / 60) | 0;
          seconds -= minutes * 60;
          var hours = (minutes / 60) | 0;
          minutes -= hours * 60;
          var days = (hours / 24) | 0;
          hours -= days * 24;
          var weeks = (days / 7) | 0;
          days -= weeks * 7;

          var weeksLabel = (weeks == 1)? $translate.instant("shared.week") : $translate.instant("shared.weeks");
          var daysLabel = (days == 1)? $translate.instant("shared.day") : $translate.instant("shared.days");
          var hoursLabel = (hours == 1)? $translate.instant("shared.hour") : $translate.instant("shared.hours");

          var displayDuration = "";

          if (weeks > 0)
            displayDuration += weeks + " " + weeksLabel;
          if (days > 0)
            displayDuration += (weeks > 0)? (", " + days + " " + daysLabel) : (days + " " + daysLabel);
          if (hours > 0)
            displayDuration += (days > 0 || weeks > 0)? (", " + hours + " " + hoursLabel) : (hours + " " + hoursLabel);

          return displayDuration;
        }
      },
    
      subtotal: function(startDate, endDate, priceHalfDay, priceDay, priceWeek) {
        if (startDate === undefined || endDate === undefined) {
          return 0;
        } else {
          var diff = Math.abs(startDate - endDate);

          var seconds = (diff / 1000) | 0;
          diff -= seconds * 1000;
          var minutes = (seconds / 60) | 0;
          seconds -= minutes * 60;
          var hours = (minutes / 60) | 0;
          minutes -= hours * 60;
          var days = (hours / 24) | 0;
          hours -= days * 24;
          var weeks = (days / 7) | 0;
          days -= weeks * 7;

          var value = priceWeek * weeks;
          value += priceDay * days;

          if (weeks == 0 && days == 0) {
            value += (hours <= 6)? priceHalfDay * 1 : priceDay * 1;
          } else {
            if (0 < hours && hours < 6) {
                value += (priceHalfDay * 1);
            } else if (hours >= 6) {
                value += (priceDay * 1);
            }
          }

          if (weeks == 0 && value > priceWeek) {
            value = priceWeek * 1;
          }

          return value;
        }
      }

    };

  }
]);
'use strict';

angular.
  module('listnride').
  factory('loadingDialog', ['$mdDialog',
    function($mdDialog) {

      var open = function(event) {
        $mdDialog.show({
          templateUrl: 'app/services/loading-dialog/loading-dialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: false,
          escapeToClose: false
        });
      };

      var close = function() {
        $mdDialog.hide();
      }

      return {
        open: open,
        close: close
      };

    }
  ]);
/*
 *  This service adds basic SHA256 encryption.
 */

'use strict';

angular.
  module('listnride').
  factory("sha256", function() {

    return {
  
      encrypt: function(data){
        
  
        var rotateRight = function (n,x) {
          return ((x >>> n) | (x << (32 - n)));
        }
        var choice = function (x,y,z) {
          return ((x & y) ^ (~x & z));
        }
        function majority(x,y,z) {
          return ((x & y) ^ (x & z) ^ (y & z));
        }
        function sha256_Sigma0(x) {
          return (rotateRight(2, x) ^ rotateRight(13, x) ^ rotateRight(22, x));
        }
        function sha256_Sigma1(x) {
          return (rotateRight(6, x) ^ rotateRight(11, x) ^ rotateRight(25, x));
        }
        function sha256_sigma0(x) {
          return (rotateRight(7, x) ^ rotateRight(18, x) ^ (x >>> 3));
        }
        function sha256_sigma1(x) {
          return (rotateRight(17, x) ^ rotateRight(19, x) ^ (x >>> 10));
        }
        function sha256_expand(W, j) {
          return (W[j&0x0f] += sha256_sigma1(W[(j+14)&0x0f]) + W[(j+9)&0x0f] + 
        sha256_sigma0(W[(j+1)&0x0f]));
        }
  
        /* Hash constant words K: */
        var K256 = new Array(
          0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
          0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
          0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
          0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
          0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
          0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
          0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
          0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
          0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
          0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
          0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
          0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
          0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
          0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
          0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
          0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        );
  
        /* global arrays */
        var ihash, count, buffer;
        var sha256_hex_digits = "0123456789abcdef";
  
        /* Add 32-bit integers with 16-bit operations (bug in some JS-interpreters: 
        overflow) */
        function safe_add(x, y)
        {
          var lsw = (x & 0xffff) + (y & 0xffff);
          var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
          return (msw << 16) | (lsw & 0xffff);
        }
  
        /* Initialise the SHA256 computation */
        function sha256_init() {
          ihash = new Array(8);
          count = new Array(2);
          buffer = new Array(64);
          count[0] = count[1] = 0;
          ihash[0] = 0x6a09e667;
          ihash[1] = 0xbb67ae85;
          ihash[2] = 0x3c6ef372;
          ihash[3] = 0xa54ff53a;
          ihash[4] = 0x510e527f;
          ihash[5] = 0x9b05688c;
          ihash[6] = 0x1f83d9ab;
          ihash[7] = 0x5be0cd19;
        }
  
        /* Transform a 512-bit message block */
        function sha256_transform() {
          var a, b, c, d, e, f, g, h, T1, T2;
          var W = new Array(16);
  
          /* Initialize registers with the previous intermediate value */
          a = ihash[0];
          b = ihash[1];
          c = ihash[2];
          d = ihash[3];
          e = ihash[4];
          f = ihash[5];
          g = ihash[6];
          h = ihash[7];
  
                /* make 32-bit words */
          for(var i=0; i<16; i++)
            W[i] = ((buffer[(i<<2)+3]) | (buffer[(i<<2)+2] << 8) | (buffer[(i<<2)+1] 
        << 16) | (buffer[i<<2] << 24));
  
                for(var j=0; j<64; j++) {
            T1 = h + sha256_Sigma1(e) + choice(e, f, g) + K256[j];
            if(j < 16) T1 += W[j];
            else T1 += sha256_expand(W, j);
            T2 = sha256_Sigma0(a) + majority(a, b, c);
            h = g;
            g = f;
            f = e;
            e = safe_add(d, T1);
            d = c;
            c = b;
            b = a;
            a = safe_add(T1, T2);
                }
  
          /* Compute the current intermediate hash value */
          ihash[0] += a;
          ihash[1] += b;
          ihash[2] += c;
          ihash[3] += d;
          ihash[4] += e;
          ihash[5] += f;
          ihash[6] += g;
          ihash[7] += h;
        }
  
        /* Read the next chunk of data and update the SHA256 computation */
        function sha256_update(data, inputLen) {
          var i, index, curpos = 0;
          /* Compute number of bytes mod 64 */
          index = ((count[0] >> 3) & 0x3f);
                var remainder = (inputLen & 0x3f);
  
          /* Update number of bits */
          if ((count[0] += (inputLen << 3)) < (inputLen << 3)) count[1]++;
          count[1] += (inputLen >> 29);
  
          /* Transform as many times as possible */
          for(i=0; i+63<inputLen; i+=64) {
                        for(var j=index; j<64; j++)
              buffer[j] = data.charCodeAt(curpos++);
            sha256_transform();
            index = 0;
          }
  
          /* Buffer remaining input */
          for(var j=0; j<remainder; j++)
            buffer[j] = data.charCodeAt(curpos++);
        }
  
        /* Finish the computation by operations such as padding */
        function sha256_final() {
          var index = ((count[0] >> 3) & 0x3f);
                buffer[index++] = 0x80;
                if(index <= 56) {
            for(var i=index; i<56; i++)
              buffer[i] = 0;
                } else {
            for(var i=index; i<64; i++)
              buffer[i] = 0;
                        sha256_transform();
                        for(var i=0; i<56; i++)
              buffer[i] = 0;
          }
                buffer[56] = (count[1] >>> 24) & 0xff;
                buffer[57] = (count[1] >>> 16) & 0xff;
                buffer[58] = (count[1] >>> 8) & 0xff;
                buffer[59] = count[1] & 0xff;
                buffer[60] = (count[0] >>> 24) & 0xff;
                buffer[61] = (count[0] >>> 16) & 0xff;
                buffer[62] = (count[0] >>> 8) & 0xff;
                buffer[63] = count[0] & 0xff;
                sha256_transform();
        }
  
        /* Split the internal hash values into an array of bytes */
        function sha256_encode_bytes() {
                var j=0;
                var output = new Array(32);
          for(var i=0; i<8; i++) {
            output[j++] = ((ihash[i] >>> 24) & 0xff);
            output[j++] = ((ihash[i] >>> 16) & 0xff);
            output[j++] = ((ihash[i] >>> 8) & 0xff);
            output[j++] = (ihash[i] & 0xff);
          }
          return output;
        }
  
        /* Get the internal hash as a hex string */
        function sha256_encode_hex() {
          var output = new String();
          for(var i=0; i<8; i++) {
            for(var j=28; j>=0; j-=4)
              output += sha256_hex_digits.charAt((ihash[i] >>> j) & 0x0f);
          }
          return output;
        }
  
        
  
        /* test if the JS-interpreter is working properly */
        function sha256_self_test()
        {
          return sha256_digest("message digest") == 
        "f7846f55cf23e14eebeab5b4e1550cad5b509e3348fbc4efa3a1413d393cb650";
        }
  
        sha256_init();
        sha256_update(data, data.length);
        sha256_final();
        return sha256_encode_hex();
  
      }
  
    }

  });
'use strict';

angular.
  module('listnride').
  factory('verification', ['$mdDialog', '$mdToast', '$interval', '$localStorage', '$state', '$translate', 'api', 'Upload',
    function($mdDialog, $mdToast, $interval, $localStorage, $state, $translate, api, Upload) {

      var VerificationDialogController = function(lister) {
        var verificationDialog = this;
        var poller = $interval(function() {
          reloadUser();
        }, 5000);

        verificationDialog.lister = lister;
        console.log(verificationDialog.lister);

        verificationDialog.selectedIndex;
        verificationDialog.activeTab = 1;
        verificationDialog.firstName = $localStorage.firstName;
        verificationDialog.profilePicture = false;

        $state.current.name == "home" ? verificationDialog.firstTime = true : verificationDialog.firstTime = false;
        // Fires if scope gets destroyed and cancels poller
        verificationDialog.$onDestroy = function() {
          $interval.cancel(poller);
        };

        var reloadUser = function() {
          api.get('/users/' + $localStorage.userId).then(
            function (success) {
              if (verificationDialog.newUser == null) {
                verificationDialog.newUser = success.data;
              }
              verificationDialog.user = success.data;
            },
            function (error) {
              console.log("Error fetching User Details");
            }
          );
        };

        reloadUser();

        var uploadDescription = function() {
          var data = {
            "user": {
              "description": verificationDialog.newUser.description
            }
          };
          api.put('/users/' + $localStorage.userId, data).then(
            function (success) {
              console.log("Successfully updated description");
            },
            function (error) {
              console.log("Error updating description");
            }
          );
        };

        var uploadPicture = function() {
          var profilePicture = {
            "user": {
              "profile_picture": verificationDialog.profilePicture
            }
          };

          Upload.upload({
            method: 'PUT',
            url: api.getApiUrl() + '/users/' + $localStorage.userId,
            data: profilePicture,
            headers: {
              'Authorization': $localStorage.auth
            }
          }).then(
          function(response) {
            console.log(response.data);
            $localStorage.profilePicture = response.data.profile_picture.profile_picture.url;
          },
          function(error) {
            console.log("Error while uploading profile picture", error);
          }
        );
        };

        var uploadAddress = function() {
          var data = {
            "user": {
              "street": verificationDialog.newUser.street, 
              "zip": verificationDialog.newUser.zip,
              "city": verificationDialog.newUser.city,
              "country": verificationDialog.newUser.country
            }
          };
          api.put('/users/' + $localStorage.userId, data).then(
            function (success) {
              $mdToast.show(
                $mdToast.simple()
                .textContent('Congratulations, your profile was successfully verified!')
                .hideDelay(4000)
                .position('top center')
              );
            },
            function (error) {

            }
          );
        }

        verificationDialog.resendEmail = function() {
          api.post('/users/' + $localStorage.userId + '/resend_confirmation_mail').then(
            function (success) {
              $mdToast.show(
                $mdToast.simple()
                .textContent($translate.instant('toasts.verification-email-sent'))
                .hideDelay(6000)
                .position('top center')
              );
            },
            function (error) {
              
            }
          );
        };

        verificationDialog.sendSms = function() {
          var data = {
            "phone_number": verificationDialog.newUser.phone_number
          };
          api.post('/users/' + $localStorage.userId + '/update_phone', data).then(
            function (success) {
              console.log("Successfully updated phone number");
              $mdToast.show(
                $mdToast.simple()
                .textContent('An SMS with a confirmation code was sent to you right now.')
                .hideDelay(4000)
                .position('top center')
              );
            },
            function (error) {
              console.log("error updating phone number");
            }
          );
        };

        verificationDialog.confirmPhone = function() {
          var data = {
            "confirmation_code": verificationDialog.newUser.confirmation_code
          };
          api.post('/users/' + $localStorage.userId + '/confirm_phone', data).then(
            function (success) {
              $mdToast.show(
                $mdToast.simple()
                .textContent('Successfully verified phone number.')
                .hideDelay(4000)
                .position('top center')
              );
            },
            function (error) {
              $mdToast.show(
                $mdToast.simple()
                .textContent('Error: The Verification Code seems to be invalid.')
                .hideDelay(4000)
                .position('top center')
              );
            }
          );
        };

        verificationDialog.uploadAddress = function() {
          var data = {
            "user": {
              "street": verificationDialog.newUser.street,
              "zip": verificationDialog.newUser.zip,
              "city": verificationDialog.newUser.city,
              "country": verificationDialog.newUser.country
            }
          };
          api.put('/users/' + $localStorage.userId, data).then(
            function (success) {
              $mdToast.show(
                $mdToast.simple()
                .textContent('You\'ve successfully verified your profile, thank you!')
                .hideDelay(5000)
                .position('top center')
              );
            },
            function (error) {
              console.log("error updating address");
            }
          );
        };

        verificationDialog.next = function() {
          switch (verificationDialog.activeTab) {
            case 1: verificationDialog.selectedIndex += 1; break;
            case 2: uploadPicture(); verificationDialog.selectedIndex += 1; break;
            case 3: uploadDescription(); verificationDialog.selectedIndex += 1; break;
            case 4: verificationDialog.selectedIndex += 1; break;
            case 5: verificationDialog.selectedIndex += 1; break;
            case 6: uploadAddress(); $mdDialog.hide(); break;
          }
        };

        verificationDialog.nextDisabled = function() {
          switch (verificationDialog.activeTab) {
            case 1: return false;
            case 2: return !verificationDialog.profilePicture;
            case 3: return !verificationDialog.descriptionForm.$valid;
            case 4: return verificationDialog.user.status == 0
            case 5: return !verificationDialog.user.confirmed_phone;
            case 6: return !verificationDialog.addressForm.$valid;
          }
        };

        verificationDialog.hide = function() {
          $mdDialog.hide();
        };

        verificationDialog.fillAddress = function(place) {
          var components = place.address_components;
          if (components) {
            var desiredComponents = {
              "street_number": "",
              "route": "",
              "locality": "",
              "country": "",
              "postal_code": ""
            };

            for (var i = 0; i < components.length; i++) {
              var type = components[i].types[0];
              if (type in desiredComponents) {
                desiredComponents[type] = components[i].long_name;
              }
            }

            verificationDialog.newUser.street = desiredComponents.route + " " + desiredComponents.street_number;
            verificationDialog.newUser.zip = desiredComponents.postal_code;
            verificationDialog.newUser.city = desiredComponents.locality;
            verificationDialog.newUser.country = desiredComponents.country;
          }
        }
      };
      VerificationDialogController.$inject = ["lister"];

      var openDialog = function(lister, event) {
        $mdDialog.show({
          controller: VerificationDialogController,
          locals: {
            lister: lister
          },
          controllerAs: 'verificationDialog',
          templateUrl: 'app/services/verification/verification.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: false,
          escapeToClose: false,
          fullscreen: true
        });
      }

      return {
        openDialog: openDialog
      }
    }
  ]);
'use strict';

angular.
  module('listnride').
  factory('authentication', [
    'Base64', '$http', '$localStorage', '$mdDialog', '$mdToast', '$window', '$state', '$q', 'ezfb', 'api', 'verification', 'sha256',
    function(Base64, $http, $localStorage, $mdDialog, $mdToast, $window, $state, $q, ezfb, api, verification, sha256){

      // After successful login/loginFb, authorization header gets created and saved in localstorage
      var setCredentials = function (email, password, id, profilePicture, firstName, lastName, unreadMessages) {
        var encoded = Base64.encode(email + ":" + password);
        // Sets the Basic Auth String for the Authorization Header 
        $localStorage.auth = 'Basic ' + encoded;
        $localStorage.userId = id;
        $localStorage.name = firstName + " " + lastName;
        $localStorage.firstName = firstName;
        $localStorage.profilePicture = profilePicture;
        $localStorage.unreadMessages = unreadMessages;
        $localStorage.email = email;
      };

      // The Signup Dialog Controller
      var SignupDialogController = function($mdDialog) {
        var signupDialog = this;

        var signupFb = function(email, fbId, fbAccessToken, profilePicture, firstName, lastName) {
          var user = {
            "user": {
              "email": email,
              "facebook_id": fbId,
              "facebook_access_token": fbAccessToken,
              "profile_picture_url": profilePicture,
              "first_name": firstName,
              "last_name": lastName
            }
          };
          api.post("/users", user).then(function(success) {
            setCredentials(success.data.email, success.data.password_hashed, success.data.id, success.data.profile_picture.profile_picture.url, success.data.first_name, success.data.last_name, success.data.unread_messages);            
            verification.openDialog();
          }, function(error) {
            console.log("Could not Sign Up with Facebook");
          });
        };

        var showSignupError = function() {
          $mdToast.show(
            $mdToast.simple()
            .textContent('Could not sign up. It seems the email address provided is already in use.')
            .hideDelay(4000)
            .position('top center')
          );
        }

        signupDialog.hide = function() {
          $mdDialog.hide();
        };

        signupDialog.signup = function() {
          var user = {
            'user': {
              'email': signupDialog.email,
              'password_hashed': sha256.encrypt(signupDialog.password),
              'first_name': signupDialog.firstName,
              'last_name': signupDialog.lastName
            }
          };
          api.post('/users', user).then(function(success) {
            setCredentials(success.data.email, success.data.password_hashed, success.data.id, success.data.profile_picture.profile_picture.url, success.data.first_name, success.data.last_name, success.data.unread_messages);
            verification.openDialog();
          }, function(error) {
            console.log("Could not Sign Up");
          });
        };

        signupDialog.connectFb = function() {
          ezfb.getLoginStatus(function(response) {
            if (response.status === 'connected') {
              var accessToken = response.authResponse.accessToken;
              ezfb.api('/me?fields=id,email,first_name,last_name,picture.width(600).height(600)', function(response) {
                signupFb(response.email, response.id, accessToken, response.picture.data.url, response.first_name, response.last_name);
              });
            } else {
              ezfb.login(function(response) {
                ezfb.api('/me?fields=id,email,first_name,last_name,picture.width(600).height(600)', function(response) {
                  signupFb(response.email, response.id, accessToken, response.picture.data.url, response.first_name, response.last_name);
                });
              });
            }
          });
        };

      };
      SignupDialogController.$inject = ["$mdDialog"];

      // The Login Dialog Controller
      var LoginDialogController = function($mdDialog, $mdToast, sha256, ezfb) {
        var loginDialog = this;

        var showLoginSuccess = function() {
          $mdDialog.hide();
          $mdToast.show(
            $mdToast.simple()
            .textContent('Successfully logged in.')
            .hideDelay(3000)
            .position('top center')
          );
        }

        var showLoginError = function() {
          $mdToast.show(
            $mdToast.simple()
            .textContent('Could not log in. Please make sure you\'ve entered valid credentials and signed up already.')
            .hideDelay(4000)
            .position('top center')
          );
        }

        var loginFb = function(email, facebookId) {
          var user = {
            'user': {
              'email': email,
              'facebook_id': facebookId
            }
          };
          api.post('/users/login', user).then(function(response) {
            setCredentials(response.data.email, response.data.password_hashed, response.data.id, response.data.profile_picture.profile_picture.url, response.data.first_name, response.data.last_name, response.data.unread_messages);
            showLoginSuccess();
          }, function(response) {
            showLoginError();
          });
        };

        loginDialog.hide = function() {
          $mdDialog.hide();
        }

        loginDialog.login = function() {
          var user = {
            'user': {
              'email': loginDialog.email,
              'password_hashed': sha256.encrypt(loginDialog.password)
            }
          };
          api.post('/users/login', user).then(function(success) {
            console.log(success.data);
            setCredentials(success.data.email, success.data.password_hashed, success.data.id, success.data.profile_picture.profile_picture.url, success.data.first_name, success.data.last_name, success.data.unread_messages);
            showLoginSuccess();
          }, function(error) {
            console.log(error);
            showLoginError();
          });
        }

        loginDialog.connectFb = function() {
          ezfb.getLoginStatus(function(response) {
            if (response.status === 'connected') {
              ezfb.api('/me?fields=id,email,first_name,last_name,picture.width(600).height(600)', function(response) {
                console.log(response);
                loginFb(response.email, response.id);
              });
            } else {
              ezfb.login(function(response) {
                ezfb.api('/me?fields=id,email,first_name,last_name,picture.width(600).height(600)', function(response) {
                  console.log(response);
                  loginFb(response.email, response.id);
                });
              }, {scope: 'email'});
            }
          });
        }

        loginDialog.resetPassword = function() {
          var user = {
            "user": {
              "email": loginDialog.email
            }
          };
          api.post('/users/reset_password', user).then(function(success) {
            $mdToast.show(
              $mdToast.simple()
              .textContent('Please check your emails, we\'ve just sent you a new password.')
              .hideDelay(5000)
              .position('top center')
            );
          }, function(error) {
            console.log(response);
          });
        }

      };
      LoginDialogController.$inject = ["$mdDialog", "$mdToast", "sha256", "ezfb"];

      var showSignupDialog = function(event) {
        $mdDialog.show({
          controller: SignupDialogController,
          controllerAs: 'signupDialog',
          templateUrl: 'app/services/authentication/signupDialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: true // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          //
        }, function() {
          //
        });
      };

      var showLoginDialog = function(event) {
        $mdDialog.show({
          controller: LoginDialogController,
          controllerAs: 'loginDialog',
          templateUrl: 'app/services/authentication/loginDialog.template.html',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: true // Changed in CSS to only be for XS sizes
        })
        .then(function(answer) {
          //
        }, function() {
          //
        });
      };

      var loggedIn = function() {
        if ($localStorage.auth) {
          return true;
        } else {
          return false;
        }
      };

      // Logs out the user by deleting the auth header from localStorage
      var logout = function() {
        document.execCommand("ClearAuthenticationCache");
        delete $localStorage.auth;
        delete $localStorage.userId;
        delete $localStorage.profilePicture;
        delete $localStorage.name;
        $state.go('home');
        $mdToast.show(
          $mdToast.simple()
          .textContent('You are logged out.')
          .hideDelay(3000)
          .position('top center')
        );
      };

      // Further all functions to be exposed in the service
      return {
        showSignupDialog: showSignupDialog,
        showLoginDialog: showLoginDialog,
        loggedIn: loggedIn,
        logout: logout,
        profilePicture: function() {
          return $localStorage.profilePicture
        },
        userId: function() {
          return $localStorage.userId
        }
      };
    }
  ]);
'use strict';

angular
.module('listnride')
.factory('accessControl', ['$localStorage', '$state',
  function($localStorage, $state) {

    return {
      // TODO: redirect to login/signup page then pop the router stack upon authentication
      requireLogin: function() {
        if ($localStorage.userId == undefined) {
          $state.go('home');
          return true;
        } else {
          return false;
        }
      }
    };

  }
]);
'use strict';

angular.
  module('listnride').
  factory('api', ['$http', '$localStorage',
    function($http, $localStorage, authentication) {
      // var apiUrl = "https://api.listnride.com/v2";
      var apiUrl = "https://listnride-staging.herokuapp.com/v2"
      return {
        get: function(url) {
          return $http({
            method: 'GET',
            url: apiUrl + url,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': $localStorage.auth
            }
          });
        },
        post: function(url, data) {
          return $http({
            method: 'POST',
            url: apiUrl + url,
            data: data,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': $localStorage.auth
            }
          });
        },
        put: function(url, data) {
          return $http({
            method: 'PUT',
            url: apiUrl + url,
            data: data,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': $localStorage.auth
            }
          });
        },
        getApiUrl: function() {
          return apiUrl;
        }
      }
    }
  ]);
(function(){
'use strict';
angular.module('raphaSuperCross', []).component('raphaSuperCross', {
  templateUrl: 'app/modules/events/rapha-super-cross/rapha-super-cross.template.html',
  controllerAs: 'raphaSuperCross',
  controller: ['NgMap', 'api',
    function RaphaSuperCrossController(NgMap, api) {
      var raphaSuperCross = this;

      api.get('/rides?family=7').then(
        function(response) {
          raphaSuperCross.bikes = response.data;
        },
        function(error) {
          console.log("Error retrieving User", error);
        }
      );

    }
  ]
});
})();
(function(){
'use strict';
angular.module('autocomplete',[]).component('autocomplete', {
  templateUrl: 'app/modules/shared/autocomplete/autocomplete.template.html',
  controllerAs: 'autocomplete',
  bindings: {
    autocompleteId: '@',
    location: '=',
    labelId: '@',
    placeholderId: '@',
    required: '@',
    fillAddress: '&'
  },
  controller: ['$interval', '$scope', '$timeout',
    function AutocompleteController($interval, $scope, $timeout) {
      var autocomplete = this;

      var deregisterWatcher = $scope.$watch(function () {
        return document.getElementById(autocomplete.autocompleteId);
      }, function(newValue) {
        if (newValue) {
          deregisterWatcher();

          var autocompleteObject = new google.maps.places.Autocomplete(document.getElementById(autocomplete.autocompleteId), {types: ['geocode']});
          autocompleteObject.addListener('place_changed', function() {
            $scope.$apply(function() {
              if (autocomplete.fillAddress !== undefined) {
                autocomplete.fillAddress({place: autocompleteObject.getPlace()});
              }
            });
          });

        }
      });

      // TODO: Switch to watcher
      var timer = $interval(function() {
        if ($(".pac-container").length > 0) {
          var el = $(".pac-container").detach();
          el.appendTo("autocomplete");
          $interval.cancel(timer);
        }
      }, 100);
    }
  ]
});
})();
(function(){
'use strict';
angular.module('bikeCard',[]).component('bikeCard', {
  templateUrl: 'app/modules/shared/bike-card/bike-card.template.html',
  controllerAs: 'bikeCard',
  bindings: {
    bike: '<'
  },
  controller: [
    function BikeCardController() {
      var bikeCard = this;
    }
  ]
});
})();
(function(){
'use strict';
angular.module('listingCard',[]).component('listingCard', {
  templateUrl: 'app/modules/shared/listing-card/listing-card.template.html',
  controllerAs: 'listingCard',
  bindings: {
    bikeId: '<',
    name: '<',
    brand: '<',
    category: '<',
    price: '<',
    imageUrl: '<',
    available: '<',
    removeBike: '&'
  },
  controller: [ '$state', '$mdDialog', '$translate', 'api',
    function ListingCardController($state, $mdDialog, $translate, api) {
      var listingCard = this;

      listingCard.onDeleteClick = function(ev) {
        var confirm = $mdDialog.confirm()
          .title($translate.instant("listingCard.dialog-title"))
          .textContent($translate.instant("listingCard.dialog-subtitle"))
          .targetEvent(ev)
          .ok($translate.instant("listingCard.delete"))
          .cancel($translate.instant("listingCard.cancel"));

        $mdDialog.show(confirm).then(function() {
          deleteBike();
        }, function() {
          
        });
      };

      listingCard.onActivateClick = function() {
        listingCard.disableActivate = true;
        api.put("/rides/" + listingCard.bikeId, {"ride": {"available": "true"}}).then(
          function(response) {
            listingCard.disableActivate = false;
            listingCard.available = true;
          },
          function(error) {
            listingCard.disableActivate = false;
            console.log("Error activating bike", error);
          }
        );
      };

      listingCard.onDeactivateClick = function() {
        listingCard.disableDeactivate = true;
        api.put("/rides/" + listingCard.bikeId, {"ride": {"available": "false"}}).then(
          function(response) {
            listingCard.disableDeactivate = false;
            listingCard.available = false;
          },
          function(error) {
            listingCard.disableDeactivate = false;
            console.log("Error deactivating bike", error);
          }
        );
      };

      function deleteBike() {
        listingCard.disableDelete = true;
        api.put("/rides/" + listingCard.bikeId, {"ride": {"active": "false"}}).then(
          function(response) {
            listingCard.removeBike({'bikeId': listingCard.bikeId});
          },
          function(error) {
            console.log("Error deleting bike", error);
          }
        );
      };
    }
  ]
});
})();
(function(){
'use strict';
angular.module('message',[]).component('message', {
  templateUrl: 'app/modules/shared/message/message.template.html',
  controllerAs: 'message',
  bindings: {
    content: '<',
    status: '<',
    sender: '<',
    receiver: '<',
    timestamp: '<',
    confirmBooking: '&',
    showRatingDialog: '&',
    request: '<'
  },
  controller: [ '$translate', '$localStorage', '$mdDialog', 'api',
    function MessageController($translate, $localStorage, $mdDialog, api) {
      var message = this;
      
      message.closeDialog = function() {
        $mdDialog.hide();
      }

      message.sentMessage = function() {
        return message.status == null && $localStorage.userId == message.sender;
      }

      message.receivedMessage = function() {
        return message.status == null && $localStorage.userId != message.sender;
      }

      message.statusMessage = function() {
        if (message.request.rideChat) {
          return message.status != null && message.status != 7
        } else {
          return message.status != null && message.status != 7 && message.status != 6;
        }
        // return message.status != null && message.status != 7 && (!message.request.rideChat && message.status != 6);
      }

      // Unfortunately doublecoded in message.component and requests.component#bookingDialog
      message.updateStatus = function(statusId) {
        var data = {
          "request_id": message.request.id,
          "sender": $localStorage.userId,
          "status": statusId,
          "content": ""
        };

        message.request.messages.push(data);
        var data = {
          "request": {
            "status": statusId
          }
        };

        message.request.status = statusId;

        api.put("/requests/" + message.request.id, data).then(
          function(success) {
            console.log("successfully updated request");
            // message.request.status = statusId;
          },
          function(error) {
            console.log("error updating request");
          }
        );
      };

    }
  ]
});
})();
(function(){
'use strict';
angular.module('rating',[]).component('rating', {
  templateUrl: 'app/modules/shared/rating/rating.template.html',
  controllerAs: 'rating',
  bindings: {
    data: '<'
  },
  controller: [ 'api',
    function RatingController(api) {
      var rating = this;

    }
  ]
});
})();