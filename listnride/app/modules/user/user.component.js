'use strict';

angular.module('user',[]).component('user', {
  templateUrl: 'app/modules/user/user.template.html',
  controllerAs: 'user',
  controller: ['$localStorage', '$stateParams', '$translate', 'ngMeta', 'api',
    function ProfileController($localStorage, $stateParams, $translate, ngMeta, api) {
      var user = this;
      user.hours = {};
      user.weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      user.loaded = false;
      user.closedDay = closedDay;

      var userId;
      $stateParams.userId? userId = $stateParams.userId : userId = 1282;

      api.get('/users/' + userId).then(
        function(response) {
          user.showAll = false;
          user.user = response.data;
          user.loaded = true;
          user.openingHoursEnabled = response.data.opening_hours.enabled;
          user.openingHours = response.data.opening_hours.hours;
          user.rating = (user.user.rating_lister + user.user.rating_rider);
          if (user.user.rating_lister != 0 && user.user.rating_rider != 0) {
            user.rating = user.rating / 2;
          }
          user.rating = Math.round(user.rating);
          if (user.openingHoursEnabled) setOpeningHours();

          $translate(["user.meta-title", "user.meta-description"] , { name: user.user.first_name })
          .then(function(translations) {
            ngMeta.setTitle(translations["user.meta-title"]);
            ngMeta.setTag("description", translations["user.meta-description"]);
          });
        },
        function(error) {
          console.log("Error retrieving User", error);
        }
      );

      function setOpeningHours() {
        _.each(user.weekDays, function (day, key) {
          var weekDay = user.openingHours[key];
          var dayRange = [];
          if (_.isEmpty(weekDay)) dayRange = [{'closed': true}];
          _.each(weekDay, function (range, key) {
            dayRange.push({
              'closed': false,
              'start_at': range.start_at / 3600,
              'end_at': (range.start_at + range.duration) / 3600
            })
          });
          user.hours[day] = dayRange;
        });
      }

      function closedDay(range) {
        if (range.closed) return true
      }
    }
  ]
});
