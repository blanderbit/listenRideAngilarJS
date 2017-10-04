'use strict';

angular.module('settings',[]).component('settings', {
  templateUrl: 'app/modules/settings/settings.template.html',
  controllerAs: 'settings',
  controller: [
    '$localStorage',
    '$window',
    '$mdToast',
    '$translate',
    'api',
    'accessControl',
    'sha256',
    'Base64',
    'Upload',
    'loadingDialog',
    'ENV',
    'ngMeta',
    'userApi',
    '$timeout',
    '$mdDialog',
    'authentication',
    function SettingsController(
      $localStorage, $window, $mdToast,
      $translate, api, accessControl, sha256, Base64,
      Upload, loadingDialog, ENV, ngMeta,
      userApi, $timeout, $mdDialog, authentication
      ) {
      if (accessControl.requireLogin()) {
        return;
      }
      ngMeta.setTitle($translate.instant("settings.meta-title"));
      ngMeta.setTag("description", $translate.instant("settings.meta-description"));

      var settings = this;

      var formData = {};

      /**
       * controller for change contact info
       * $mdDialog has a bug. it doesn't allow render template
       * correctly for component. thats why 
       * inline controller is used instead of controller
       * @param {userApi} userApi 
       * @param {$mdDialog} $mdDialog 
       * @param {verification} verification
       * @returns {void}
       */
      var ChangeContactController = function(userApi, $mdDialog, verification) {
        var changeContact = this;
        
        changeContact.sentConfirmationSms = false;
                
        changeContact.confirmPhone = function () {
          verification.confirmPhone(changeContact.user.confirmation_code).then(function () {
            $mdDialog.hide({
              phone_number: changeContact.user.new_phone_number
            });
          });
        };

        changeContact.sendSms = function () {
          verification.sendSms(changeContact.user.new_phone_number).then(function () {
            changeContact.sentConfirmationSms = true;
          }, function () {
            changeContact.changeContact.sentConfirmationSms = false;
          });
        };
        
        // cancel the modal
        changeContact.closeDialog = $mdDialog.cancel;

        changeContact.onInit = function () {
          userApi.getUserData().then(function (response) {
            var phone_number = response.data.phone_number ? angular.copy('+' + response.data.phone_number) : null;
            changeContact.user = response.data;
            changeContact.user.new_phone_number = phone_number;
          });
        };

        changeContact.onInit(); 
      };
  
      settings.$onInit = initSettings;
      function initSettings() {
        settings.user = {};
        settings.croppedDataUrl = false;
        settings.loaded = false;
        settings.payoutMethod = {};
        settings.password = "";
        settings.startTime = {};
        settings.endTime = {};
        settings.errorTime = {};
        settings.enabledTime = {};
        settings.time = Date.now();
        settings.error = false;
        settings.openingHoursId = null;
        settings.weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        settings.completeClosed = false;
        settings.hoursFormValid = hoursFormValid;
        settings.getInputDate = getInputDate;
        settings.onSubmit = onSubmit;
        settings.performInputDay = performInputDay;
        settings.performOpeningHours = performOpeningHours;
        settings.addChild = addChild;
        settings.removeInputDate = removeInputDate;
        settings.emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        settings.current_payment = false;
        settings.business = {};
        settings.user.business = false;
        userApi.getUserData().then(function (response) {
          settings.user = response.data;
          settings.current_payment = response.data.status === 3;
          updatePrivatePhoneNumber(response.data.phone_number);
          settings.loaded = true;
          settings.openingHoursEnabled = settings.user.opening_hours ? settings.user.opening_hours.enabled : false;
          $timeout(setInitFormState.bind(this), 0);
          if (!_.isEmpty(settings.user.business)) { getBusinessData() }
        });
      }

      /**
       * converts phone number to private number
       * 1234567890 -> 123****890
       * @param {string} phone_number 
       * @returns {void}
       */
      function updatePrivatePhoneNumber(phone_number) {
        var initials = phone_number.slice(0, 3);
        var endings = phone_number.slice(-3);
        var length = phone_number.length - initials.length - endings.length + 1;
        settings.user.phone_number_privatized = initials.concat(Array(length).join('*')).concat(endings);
      }

      function getBusinessData() {
        api.get('/businesses/' + settings.user.business.id).then(
          function(response) {
            settings.business = response.data;
          },
          function(error) {

          }
        );
      }

      function performOpeningHours(model) {
        if (model) {
          _.each(settings.weekDays, function (weekDay, key) {
            setDayTime(weekDay, null, null, 0);
          });
          completeClosed()
        } else {
          onSubmit()
        }
      }

      function getInputDate(weekDay, isStart, index) {
        var date = isStart ? settings.startTime[weekDay][index] : settings.endTime[weekDay][index];
        var field = isStart ? 'start_at' : 'end_at';
        saveDate(weekDay, field, date, index);
        var duration = getDuration(weekDay, index);
        var endTime = _.get(formData, weekDay + '.' + index + '.' + 'end_at');

        if (duration) {
          _.set(settings.errorTime, weekDay, false);
          saveDate(weekDay, 'duration', duration, index);
        } else if (endTime == null) { // If second input still blank
          _.set(settings.errorTime, weekDay, false);
        } else {
          _.set(settings.errorTime, weekDay, true);
        }

        hoursFormValid();
        completeClosed();
      }

      function saveDate(weekDay, key, value, index) {
        var weekDayKey = weekDay + '.' + index + '.' + key;
        formData = _.set(formData, weekDayKey, value);
      }

      function getDuration(weekDayKey, index) {
        var startTime = _.get(formData, weekDayKey + '.' + index + '.' + 'start_at');
        var endTime = _.get(formData, weekDayKey + '.' + index + '.' + 'end_at');
        var duration = null;
        // Get values that came from server
        if (!startTime) startTime = Number(settings.startTime[weekDayKey][index]);
        if (!endTime) endTime = Number(settings.endTime[weekDayKey][index]);

        if (!startTime && !endTime) return null;
        duration = (endTime - startTime);
        return duration <= 0 ? null : duration;
      }

      function hoursFormValid() {
        var errors = Object.values(settings.errorTime);
        settings.error = errors.some(function (e) {
          return e === true;
        })
      }

      function performInputDay(weekDay, model) {
        if (model) {
          fillInputDate(weekDay)
        } else {
          clearInputDate(weekDay);
          completeClosed();
        }
      }

      function removeInputDate(weekDay, index) {
        settings.startTime[weekDay].splice(index, 1);
        settings.endTime[weekDay].splice(index, 1);
        formData[weekDay].splice(index, 1);
      }

      function clearInputDate(weekDay) {
        settings.startTime[weekDay] = [{}];
        settings.endTime[weekDay] = [{}];
        delete formData[weekDay];
      }

      function fillInputDate(weekDay) {
        if (unableToPreFill(weekDay)) return;
        var prev_day = [];
        var currentDay = _.findIndex(settings.weekDays, function (o) {
          return o == weekDay;
        });
        var hours = _.isEmpty(settings.user.opening_hours) ? [] : settings.user.opening_hours.hours;
        _.each(settings.weekDays, function (weekDay, key) { // Check for previously completed days
          if (key > currentDay) {
            return prev_day
          } // Return if day after current day
          var anyData = formDataPresent(weekDay);
          if (!_.isEmpty(hours[key]) && !anyData) {
            prev_day = getPreviousDay(hours[key], true);

          } else if (anyData) { // If previous day chosen, but not saved yet
            prev_day = getPreviousDay(formData[weekDay], false);
          }
        });

        if (!_.isEmpty(prev_day)) {
          _.each(prev_day, function (data, key) {
            setDayTime(weekDay, data.start_at, data.duration, key)
          });
        }
      }

      function unableToPreFill(weekDay) {
        var formEmphty = true;
        _.each(settings.weekDays, function (weekDay, key) {
          if (formDataPresent(weekDay)) formEmphty = false
        });

        return (weekDay == 'Monday' || (_.isEmpty(settings.user.opening_hours) && formEmphty))
      }

      function getPreviousDay(dayRanges, inSeconds) {
        var day = [];
        _.each(dayRanges, function (range, key) {
          day.push({
            'start_at': inSeconds ? range.start_at / 3600 : Number(range.start_at),
            'duration': inSeconds ? range.duration / 3600 : range.duration
          })
        });

        return day
      }

      function formDataPresent(weekDay) {
        var present = false;
        _.each(formData[weekDay], function (range, key) {
          if (range.start_at !== null || range.duration !== null) {
            present = true
          }
        });
        return present
      }

      function onSubmit() {
        var reqData = {
          'hours': _.isEmpty(formData) ? {
            0: null,
            1: null,
            2: null,
            3: null,
            4: null,
            5: null,
            6: null
          } : changeKeys(formData),
          'enabled': settings.openingHoursEnabled
        };

        if (settings.openingHoursId) {
          updateOpeningHours(reqData)
        } else {
          createOpeningHours(reqData)
        }
      }

      function changeKeys(data) {
        var formatedData = {};
        _.each(data, function (value, key) {
          var key = settings.weekDays.findIndex(function (element) {
            return key === element;
          });
          _.set(formatedData, key, formatDayData(value));
        });
        return formatedData;
      }

      function formatDayData(data) {
        var range = [];
        _.each(data, function (value, key) {
          var startAt = _.get(value, 'start_at') * 3600;
          var duration = _.get(value, 'duration') * 3600;
          if (startAt != 0 && startAt != 0) range.push({
            start_at: startAt,
            duration: duration
          });
        });
        return range
      }

      function createOpeningHours(data) {
        api.post('/opening_hours', data).then(
          function (success) {
            settings.openingHoursId = success.data.id;
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
          function (success) {
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

      function setInitFormState() {
        if (!_.isEmpty(settings.user.opening_hours)) {
          settings.openingHoursId = settings.user.opening_hours.id;
          var hours = settings.user.opening_hours.hours;
          _.each(settings.weekDays, function (weekDay, key) {
            if (!_.isEmpty(hours[key])) {
              _.each(hours[key], function (range, index) {
                var start_at = hours[key][index].start_at / 3600;
                var duration = hours[key][index].duration / 3600;
                settings.enabledTime[weekDay] = true;
                setDayTime(weekDay, start_at, duration, index);
              })
            } else {
              setDayTime(weekDay, null, null, 0);
            }
          });
          completeClosed();
        }
      }

      function setDayTime(day, start_at, duration, rangeIndex) {
        settings.startTime = _.set(settings.startTime, day + '.' + rangeIndex, start_at);
        settings.endTime = _.set(settings.endTime, day + '.' + rangeIndex, duration + start_at);
        formData = _.set(formData, day + '.' + rangeIndex + '.' + 'start_at', start_at);
        formData = _.set(formData, day + '.' + rangeIndex + '.' + 'duration', duration);
      }

      settings.fillAddress = function (place) {
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

      // TODO: this code is appearing twice, here and in the paoutDialog Controller (requests.component.rb)
      settings.addPayoutMethod = function () {
        var data = {
          "payment_method": settings.payoutMethod
        };

        data.payment_method.user_id = $localStorage.userId;

        if (settings.payoutMethod.family == 1) {
          data.payment_method.email = "";
        } else {
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
            // TODO: Properly configure API to output payout method details and use those instead of making another call to the user
            userApi.getUserData().then(function (response) {
              settings.user.current_payout_method = response.data.current_payout_method;
            });
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

      settings.addVoucher = function () {
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

      settings.deleteAccount = function(event) {
        var confirm = $mdDialog.confirm()
          .title($translate.instant('settings.delete-account-sure'))
          .textContent($translate.instant('settings.delete-account-sure-description'))
          .targetEvent(event)
          .ok($translate.instant('settings.delete-account-yes'))
          .cancel($translate.instant('settings.delete-account-no'));

        $mdDialog.show(confirm).then(
          function() {
            api.delete('/users/' + authentication.userId()).then(
              function(success) {
                console.log("User successfully deleted");
                authentication.logout();
              },
              function(error) {
                console.log("User could not be deleted");
              }
            );
          },
          function() {
          
          }
        );
      }

      settings.updateUser = function () {
        var data = {
          "description": settings.user.description,
          "profile_picture": Upload.dataUrltoBlob(settings.croppedDataUrl, _.isEmpty(settings.profilePicture) ? '' : settings.profilePicture.name),
          "street": settings.user.street,
          "zip": settings.user.zip,
          "city": settings.user.city,
          "country": settings.user.country
        };

        if (settings.password && settings.password.length >= 6) {
          data.user.password_hashed = sha256.encrypt(settings.password);
        }

        loadingDialog.open();

        Upload.upload({
          method: 'PUT',
          url: api.getApiUrl() + '/users/' + $localStorage.userId,
          data: {'user': settings.compactObject(data)},
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
            settings.profilePicture = false;
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

      settings.compactObject  = function(o) {
        var clone = _.clone(o);
        _.each(clone, function(v, k) {
          if(!v) {
            delete clone[k];
          }
        });
        return clone;
      };

      settings.updateBusiness = function () {
        var data = {
          'business': {
            'company_name': settings.business.company_name,
            'vat': settings.business.vat
          }
        };

        api.put("/businesses/" + settings.user.business.id, data).then(
          function (success) {
            $mdToast.show(
              $mdToast.simple()
                .textContent($translate.instant('toasts.update-profile-success'))
                .hideDelay(4000)
                .position('top center')
            );

            settings.user.business = true;
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

      settings.openPaymentWindow = function () {
        var w = 550;
        var h = 700;
        var left = (screen.width / 2) - (w / 2);
        var top = (screen.height / 2) - (h / 2);

        $window.open(ENV.userEndpoint + $localStorage.userId + "/payment_methods/new", "popup", "width=" + w + ",height=" + h + ",left=" + left + ",top=" + top);
      };

      settings.currentPaymentMethod = function () {
        api.get('/users/' + settings.user.id + '/current_payment').then(
          function(response) {
            settings.user.current_payment_method = response.data;
          },
          function(error) {

          }
        );
      };
      
      settings.changePhoneNumber = function (event) {
        $mdDialog.show({
          templateUrl: 'app/modules/settings/change-contact.template.html',
          controller: ChangeContactController,
          controllerAs: 'changeContact',
          parent: angular.element(document.body),
          targetEvent: event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: true,
          escapeToClose: true
        }).then(function (success) {
          // update model with new number
          settings.user.phone_number = success.phone_number;
          // update model with private number
          updatePrivatePhoneNumber(success.phone_number);
        });
      };

      function addChild(day) {
        if (settings.startTime[day]) {
          return settings.startTime[day].push({})
        }
        settings.startTime[day] = [{}]
      }

      function completeClosed() {
        if (!settings.openingHoursEnabled) return settings.completeClosed = false;
        _.each(formData, function (weekDay, key) {
          if (_.isEmpty(weekDay[0])) return settings.completeClosed = true;
          if (weekDay[0].start_at != undefined || weekDay[0].end_at!= undefined) {
            return settings.completeClosed = false
          } else {
            settings.completeClosed =  true
          }
        });
      }
    }
  ]
});
