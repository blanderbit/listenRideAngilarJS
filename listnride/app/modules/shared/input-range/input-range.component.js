'use strict';

angular
  .module('inputRange', [])
  .directive('inputRange', function() {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'app/modules/shared/input-range/input-range.template.html',
      controllerAs: 'vm',
      bindToController: {
        data: '=',
        disabledDates: '<',
        requests: '<?',
        onChange: '<?',
        onClear: '<?'
      },
      controller: ['$scope', '$translate', inputRangeController],
      link: function ($scope, element, attrs) {
        $scope.el = angular.element(element[0]).find('.js-datapicker');
        $scope.isSingle = attrs.hasOwnProperty('lnrSingleInput');
      }
    }
  });


function inputRangeController($scope, $translate) {
  var vm = this;

  vm._updateData = _updateData;
  vm._clearData = _clearData;
  vm.$postLink = postLink;
  vm.$onDestroy = onDestroy;
  vm.openCalendar = openCalendar;
  vm.isSingle = false;
  
  ////////////

  /**
  * Function to update data object
  *
  * @param {Object} date1 Date Object with first chosen date
  * @param {Object} date2 Date Object with second chosen date
  */
  function _updateData(date1, date2) {
    date1 = moment(date1);
    // if user doesn't pick end date - duration will be 0
    date2 = date2 ? moment(date2) : date1;

    var duration = date1.diff(date2, 'days');
    var startDate = duration > 0 ? date2 : date1;
    var newData = {
      'start_date': startDate.format('YYYY-MM-DD'),
      'duration': Math.abs(duration),
      'is_changed': true
    }

    angular.extend(vm.data, newData);

    if (typeof vm.onChange == 'function') vm.onChange();
    $scope.$apply();
  }

  function _clearData() {
    angular.extend(vm.data, {
      'start_date': null,
      'duration': null
    });

    if (typeof vm.onClear == 'function') vm.onClear();
    $scope.$apply();
  }

  function postLink() {
    vm.isSingle = $scope.isSingle;
    $scope.el.dateRangePicker({
      autoClose: true,
      showTopbar: false,
      stickyMonths: true,
      singleMonth: 'auto',
      selectForward: true,
      startOfWeek: 'monday',
      showShortcuts: false,
      beforeShowDay: classifyDate,
      lnrIsWidthStatic: true,
      lnrShowTimeDom: false,
      language: $translate.preferredLanguage(),
      lnrSingleMonthMinWidth: 659, // 320px - min-width for 1 calendar part + gap
      extraClass: 'date-picker-wrapper--ngDialog date-picker-wrapper--two-months'
    }).bind('datepicker-change', function (event, obj) {
      vm._updateData(obj.date1, obj.date2);
    }).bind('datepicker-first-date-selected', function (event, obj) {
      vm._clearData();
      changeRange();
      setFirstDate(obj.date1);
    }).bind('datepicker-closed', function (event, obj) {
      if (obj.date1 && !obj.date2) {
        setEndDate(new Date(obj.date1));
        vm._updateData(obj.date1, obj.date2);
      }
      
    });

    //TODO: make services for this
    function classifyDate(date) {
      date.setHours(0, 0, 0, 0);
      var now = new Date();
      now.setHours(0, 0, 0, 0);
      if (date.getTime() <= now.getTime()) {
        return [false, "date-past", ""];
      } else if (isReserved(date)) {
        return [false, "date-reserved", ""];
      } else if (bikeNotAvailable(date)) {
        return [false, "date-closed", ""];
      } else {
        return [true, "date-available", ""];
      }
    }

    function setFirstDate(d) {
      $scope.el.dateRange.setStart(d);
    }

    function setEndDate(d) {
      $scope.el.dateRange.setEnd(d);
    }

    function changeRange() {
      if (vm.data.start_date) {
        // set range to datepicker with datepicker special method
        // setDateRange({String}, {String}) 
        var startDate = moment(vm.data.start_date);
        var lastDate = startDate.clone().add(vm.data.duration, 'd');
        $scope.el.dateRange
          .setDateRange(startDate._d, lastDate._d, true);
      } else {
        $scope.el.dateRange.clear();
      }
    }

    function bikeNotAvailable(date) {
      date.setHours(0, 0, 0, 0);
      var result = false;
      _.forEach(vm.disabledDates, function (slot) {
        result = result || moment(date).isBetween(slot.start_at, slot.end_at, null, '[]') // all inclusive
      });
      return result;
    }

    function isReserved(date) {
      if (!vm.requests) return;
      for (var i = 0; i < vm.requests.length; ++i) {
        var start = new Date(vm.requests[i].start_date_tz);
        start.setHours(0, 0, 0, 0);
        var end = new Date(vm.requests[i].end_date_tz);
        end.setHours(0, 0, 0, 0);

        if (start.getTime() <= date.getTime()
          && date.getTime() <= end.getTime()) {
          return true;
        }
      }
      return false;
    }

    // save this data, because mdDialog destroys elements before $onDestroy method
    $scope.el.dateRange = $scope.el.data('dateRangePicker');

    changeRange();
  };

  function onDestroy() {
    $scope.el.dateRange.destroy();
  };

  function openCalendar($event) {
    $event.stopPropagation();
    $scope.el.dateRange.open();
  }
}