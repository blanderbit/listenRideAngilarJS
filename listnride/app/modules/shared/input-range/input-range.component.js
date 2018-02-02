'use strict';

angular
  .module('inputRange', [])
  .directive('inputRange', function(){
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'app/modules/shared/input-range/input-range.template.html',
      controllerAs: 'inputRange',
      bindToController: {  
        data: '='
      },
      controller: ['$scope', inputRangeController],
      link: function ($scope, element, attrs) {
        $scope.el = angular.element(element[0]).find('.input-range__before');
      }
    }
  });


function inputRangeController($scope) {
  var inputRange = this;

  /**
  * Function to convert unixtimestamp into Date object
  *
  * @param {Number} date unixtimestamp format
  * @return {Object} Moment Object
  */
  inputRange._convertFromUnix = function (date) {
    return moment.unix(date);
  }

  /**
  * Function to update data object
  *
  * @param {Object} date1 Date Object with first chosen date
  * @param {Object} date2 Date Object with second chosen date
  */
  inputRange._updateData = function (date1, date2) {
    date1 = moment(date1);
    date2 = moment(date2);

    var duration = date1.diff(date2, 'days');
    var startDate = duration > 0 ? date2 : date1;
    var newData = {
      'startDate': startDate.unix(),
      'duration': Math.abs(duration)
    }

    angular.extend(inputRange.data, newData);
    
    $scope.$apply();
  }
  
  inputRange.$postLink = function () {
    $scope.el.dateRangePicker({
      autoClose: true,
      showTopbar: false,
      isWidthStatic: true,
      showTimeDom: false,
      extraClass: 'date-picker-wrapper--ngDialog date-picker-wrapper--two-months'
    }).bind('datepicker-change', function (event, obj) {
        inputRange._updateData(obj.date1, obj.date2);
    });

    // save this data, because mdDialog destroys elements before inputRange.$onDestroy
    $scope.el.dataRange = $scope.el.data('dateRangePicker');

    if (inputRange.data.startDate) {
      // set range to datepicker with datepicker special method
      // setDateRange({String}, {String}) 
      var startDate = inputRange._convertFromUnix(inputRange.data.startDate);
      var lastDate = startDate.clone().add(inputRange.data.duration, 'd');
      $scope.el.dataRange
        .setDateRange(startDate._d, lastDate._d, true);
    }

  };

  inputRange.$onDestroy = function () {
    $scope.el.dataRange.destroy();
  };

  inputRange.openCalendar = function($event) {
    $event.stopPropagation();
    $scope.el.dataRange.open();
  }
}