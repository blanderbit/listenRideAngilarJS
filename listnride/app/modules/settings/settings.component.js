'use strict';

angular.module('settings',[]).component('settings', {
  templateUrl: 'app/modules/settings/settings.template.html',
  controllerAs: 'settings',
  controller: ['$localStorage', '$window', '$mdToast', '$translate', 'api', 'accessControl', 'sha256', 'Base64',
                'Upload', 'loadingDialog', 'ENV', 'ngMeta', 'userApi', '$timeout',
    function SettingsController($localStorage, $window, $mdToast, $translate, api, accessControl, sha256, Base64,
                                Upload, loadingDialog, ENV, ngMeta, userApi, $timeout) {
      if (accessControl.requireLogin()) {
        return;
      }
      ngMeta.setTitle($translate.instant("settings.meta-title"));
      ngMeta.setTag("description", $translate.instant("settings.meta-description"));

      var settings = this;

      var formData = {};

      settings.$onInit = initSettings;

      function initSettings() {
        settings.user = {};
        settings.loaded = false;
        settings.payoutMethod = {};
        settings.password = "";
        settings.startTime = {};
        settings.endTime = {};
        settings.errorTime = {};
        settings.enabledTime = {};
        settings.getInputDate = getInputDate;
        settings.onSubmit = onSubmit;
        settings.performInputDay = performInputDay;
        settings.time = Date.now();
        settings.hoursFormValid = hoursFormValid;
        settings.error = false;
        settings.openingHoursId = null;

        settings.weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        userApi.getUserData().then(function (response) {
          settings.user = response.data;
          settings.loaded = true;
          settings.openingHoursEnabled = settings.user.opening_hours ? settings.user.opening_hours.enabled : false;
          $timeout(setInitFormState.bind(this), 0);
        });
      }

      function getInputDate(weekDay, isStart) {
        var date = isStart ? settings.startTime[weekDay] : settings.endTime[weekDay];
        var duration = null;

        if (isStart) {
          saveDate(weekDay, 'start_at', date);
          return hoursFormValid();
        }

        saveDate(weekDay, 'end_at', date);

        duration = getDuration(weekDay);

        if (!duration) {
          _.set(settings.errorTime, weekDay, true);
          return hoursFormValid();
        }

        _.set(settings.errorTime, weekDay, false);

        saveDate(weekDay, 'duration', duration);

      }

      function performInputDay(weekDay, model) {
        if (model) {
          fillInputDate(weekDay)
        } else {
          clearInputDate(weekDay)
        }
      }

      function clearInputDate(weekDay) {
        settings.startTime = _.omit(settings.startTime, weekDay);
        settings.endTime = _.omit(settings.endTime, weekDay);
        delete formData[weekDay];
      }

      function fillInputDate(weekDay) {
        if (weekDay == 'Monday') {return}
        var prev_day = {};
        var currentDay = _.findIndex(settings.weekDays, function(o) { return o == weekDay; });
        var hours = settings.user.opening_hours.hours;
        _.each(settings.weekDays, function (weekDay, key) { // Check for previously completed days
          if (key > currentDay) {return prev_day}           // Return if day after current day
          if (!_.isEmpty(hours[key])) {
            prev_day = {
              'start_at': hours[key][0].start_at / 3600,
              'duration': hours[key][0].duration / 3600
            }
          } else if (!_.isEmpty(formData[weekDay])) {       // If previous day chosen, but not saved yet
            prev_day = {
              'start_at': Number(formData[weekDay].start_at),
              'duration': formData[weekDay].duration
            }
          }
        });
        if (!_.isEmpty(prev_day)) {setDayTime(weekDay, prev_day.start_at, prev_day.duration)}
      }

      function getDuration(weekDayKey) {
        var startTime = _.get(formData, weekDayKey + '.' + 'start_at');
        var endTime = _.get(formData, weekDayKey + '.' + 'end_at');
        var duration = null;

        if (!startTime && !endTime) return null;

        duration = (endTime - startTime);

        return  duration <= 0 ? null : duration;
      }

      function changeKeys(data) {
        var formatedData = {};

        _.each(data, function (value, key) {
          var key = settings.weekDays.findIndex(function (element) {
            return key === element;
          });

          var startAt = _.get(value, 'start_at') * 3600;
          var duration = _.get(value, 'duration') * 3600;

          _.set(formatedData, key, [{
              start_at: startAt,
              duration: duration
          }]);
        });

        return formatedData;
      }

      function onSubmit() {
        var reqData = {
          'hours': _.isEmpty(formData) ? {0:null, 1:null, 2:null, 3:null, 4:null, 5:null, 6:null} : changeKeys(formData),
          'enabled': settings.openingHoursEnabled
        };

        if (settings.openingHoursId) {
          updateOpeningHours(reqData)
        } else {
          createOpeningHours(reqData)
        }
      }

      function createOpeningHours(data) {
        api.post('/opening_hours', data).then(
          function (success) {
            settings.openingHoursId = success.data[0].id;
            $mdToast.show(
              $mdToast.simple()
                .textContent($translate.instant('toasts.opening-hours-success'))
                .hideDelay(4000)
                .position('top center')
            );
          },
          function (error) {
            $mdToast.show(
              $mdToast.simple()
                .textContent($translate.instant('toasts.opening-hours-error'))
                .hideDelay(4000)
                .position('top center')
            );
          }
        );
      }

      function updateOpeningHours(data) {
        api.put("/opening_hours/" + settings.openingHoursId, data).then(
          function(success) {
            $mdToast.show(
              $mdToast.simple()
                .textContent($translate.instant('toasts.opening-hours-success'))
                .hideDelay(4000)
                .position('top center')
            );
          },
          function(error) {
            $mdToast.show(
              $mdToast.simple()
                .textContent($translate.instant('toasts.opening-hours-error'))
                .hideDelay(4000)
                .position('top center')
            );
          }
        );
      }

      function setInitFormState() {
        if (!_.isEmpty(settings.user.opening_hours)) {
          settings.openingHoursId = settings.user.opening_hours.id;
          var hours = settings.user.opening_hours.hours;
          _.each(settings.weekDays, function (weekDay, key) {
            if (!_.isEmpty(hours[key])) {
              //TODO: refactor, after new design to work with date arrays
              var start_at = hours[key][0].start_at / 3600;
              var duration = hours[key][0].duration / 3600;
              setDayTime(weekDay, start_at, duration);
            }
          });
        }
      }

      function setDayTime(day, start_at, duration) {
        settings.startTime[day] = start_at;
        settings.endTime[day] = duration + start_at;
        settings.enabledTime[day] = true;
        formData = _.set(formData, day + '.' + 'start_at', start_at);
        formData = _.set(formData, day + '.' + 'duration', duration);
      }

      function saveDate(weekDay, key, value) {
        var weekDayKey = weekDay + '.' + key;
        formData = _.set(formData, weekDayKey , value);
      }

      function hoursFormValid(){
        var errors = Object.values(settings.errorTime);
        settings.error = errors.some(function(e) { return e === true; })
      }

      settings.fillAddress = function(place) {
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

          settings.user.street = desiredComponents.route + " " + desiredComponents.street_number;
          settings.user.zip = desiredComponents.postal_code;
          settings.user.city = desiredComponents.locality;
          settings.user.country = desiredComponents.country;
        }
      };

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
      };

      settings.openPaymentWindow = function() {
        var w = 550;
          var h = 700;
          var left = (screen.width / 2) - (w / 2);
          var top = (screen.height / 2) - (h / 2);

          $window.open(ENV.userEndpoint + $localStorage.userId + "/payment_methods/new", "popup", "width="+w+",height="+h+",left="+left+",top="+top);
      };
    }
  ]
});
