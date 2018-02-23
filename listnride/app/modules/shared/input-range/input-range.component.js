'use strict';

angular
  .module('inputRange', [])
  .directive('inputRange', function(){
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'app/modules/shared/input-range/input-range.template.html',
      controllerAs: 'vm',
      bindToController: {  
        data: '=',
        dataChanged: '=?'
      },
      controller: ['$scope', inputRangeController],
      link: function ($scope, element, attrs) {
        $scope.el = angular.element(element[0]).find('.js-datapicker');
      }
    }
  });


function inputRangeController($scope) {
  var vm = this;

  vm._updateData = _updateData;
  vm.$postLink = postLink;
  vm.$onDestroy = onDestroy;
  vm.openCalendar = openCalendar;

  ////////////

  /**
  * Function to update data object
  *
  * @param {Object} date1 Date Object with first chosen date
  * @param {Object} date2 Date Object with second chosen date
  */
  function _updateData(date1, date2) {
    date1 = moment(date1);
    date2 = moment(date2);

    var duration = date1.diff(date2, 'days');
    var startDate = duration > 0 ? date2 : date1;
    var newData = {
      'start_date': startDate.format('YYYY-MM-DD'),
      'duration': Math.abs(duration),
      'is_changed': true
    }

    angular.extend(vm.data, newData);

    // inform parent component that state was changed
    if (vm.dataChanged) {
      vm.dataChanged = true;
    }
    
    $scope.$apply();
  }
  
  function postLink() {
    $scope.el.dateRangePicker({
      autoClose: true,
      showTopbar: false,
      isWidthStatic: true,
      showTimeDom: false,
      stickyMonths: true,
      singleMonth: 'auto',
      extraClass: 'date-picker-wrapper--ngDialog date-picker-wrapper--two-months',
      singleMonthMinWidth: 659
    }).bind('datepicker-change', function (event, obj) {
        vm._updateData(obj.date1, obj.date2);
    });

    // save this data, because mdDialog destroys elements before $onDestroy method
    $scope.el.dataRange = $scope.el.data('dateRangePicker');

    if (vm.data.start_date) {
      // set range to datepicker with datepicker special method
      // setDateRange({String}, {String}) 
      var startDate = moment(vm.data.start_date);
      var lastDate = startDate.clone().add(vm.data.duration, 'd');
      $scope.el.dataRange
        .setDateRange(startDate._d, lastDate._d, true);
    }

  };

  function onDestroy() {
    $scope.el.dataRange.destroy();
  };

  function openCalendar($event) {
    $event.stopPropagation();
    $scope.el.dataRange.open();
  }
}