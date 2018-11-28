'use strict';

angular.module('user',[]).component('user', {
  templateUrl: 'app/modules/user/user.template.html',
  controllerAs: 'user',
  controller: ['$localStorage', '$state', '$stateParams', '$translate', 'ngMeta', 'api',
    function ProfileController($localStorage, $state, $stateParams, $translate, ngMeta, api) {
      var user = this;
      user.hours = {};
      user.weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      user.loaded = false;
      user.current_payment = false;
      user.display_name = '';
      user.picture = '';
      user.closedDay = closedDay;

      var userId;
      $stateParams.userId? userId = $stateParams.userId : userId = 1930;

      api.get('/users/' + userId).then(
        function(response) {
          if (!response.data.active) {
            $state.go('404');
          } else {
            user.showAll = false;
            user.user = response.data;
            user.loaded = true;
            user.anyHours = !_.isEmpty(response.data.opening_hours);
            user.openingHoursEnabled = user.anyHours ? response.data.opening_hours.enabled : false;
            user.openingHours = user.anyHours ? response.data.opening_hours.hours : {};
            user.rating = (user.user.rating_lister + user.user.rating_rider);

            user.display_name = setName();
            user.picture = setPicture();

            user.current_payment = response.data.status === 3;
            if (user.user.rating_lister != 0 && user.user.rating_rider != 0) {
              user.rating = user.rating / 2;
            }
            user.rating = Math.round(user.rating);
            if (user.openingHoursEnabled) setOpeningHours();

            generateMetaDescription(user.user.has_business);
          }
        },
        function(error) {
        }
      );

      function generateMetaDescription(isCompany) {
        var title = isCompany ? "user.company-meta-title" : "user.meta-title";
        var description = isCompany ? "user.company-meta-description" : "user.meta-description";
        var params = isCompany ? { company: $translate.instant('shared.local-business') } : { name: user.user.first_name };

        $translate([title, description] , params)
          .then(function(translations) {
            ngMeta.setTitle(translations[title]);
            ngMeta.setTag("description", translations[description]);
            if (isCompany) {
              ngMeta.setTag("noindex", false);
            }
          });
      }

      function setName() {
        if (user.user.has_business) {
           if (userId !== $localStorage.userId) {
             return $translate.instant('shared.local-business')
           } else {
             return user.user.business.company_name
           }
        } else {
          return user.user.first_name
        }
      }

      function setPicture() {
        if (user.user.has_business && userId !== $localStorage.userId) {
          return 'app/assets/ui_icons/lnr_shop_avatar.svg'
        } else {
          return user.profile_picture.profile_picture.url
        }
      }

      function setOpeningHours() {
        if (!user.anyHours) return;
        cookHours();
        compactHours();
        compactDays();
      }

      function cookHours() {
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

      function compactHours() {
        var dayName = '', currentDay = {}, prevDay = {}, shortenHours = {};

        _.each(user.weekDays, function (day) {
          currentDay = user.hours[day];

          if (_.isEqual(currentDay, prevDay) && currentDay !== user.hours['Mon']) {
            if (!_.isEmpty(shortenHours[dayName])) delete shortenHours[dayName];
            dayName = dayName + ', ' + $translate.instant('shared.' + day);
            shortenHours[dayName] = currentDay;
          } else {
            dayName = $translate.instant('shared.' + day);
            shortenHours[dayName] = currentDay;
            prevDay = currentDay;
          }
        });
        user.hours = shortenHours;
      }

      function compactDays() {
        var ranges = [];
        var hours = {};
        _.each(_.keys(user.hours), function (daysRange) {
          var d = daysRange.split(', ');
          if (d.length > 1) {
            var rangeDays = d[0] + ' - ' +  d[d.length-1];
            ranges.push(rangeDays);
            hours[rangeDays] = user.hours[daysRange];
          } else {
            var rangeDay = d[0];
            ranges.push(rangeDay);
            hours[rangeDay] = user.hours[rangeDay];
          }
        });
        user.weekDays = ranges;
        user.hours = hours;
      }

      function closedDay(range) {
        if (range.closed) return true
      }
    }
  ]
});
