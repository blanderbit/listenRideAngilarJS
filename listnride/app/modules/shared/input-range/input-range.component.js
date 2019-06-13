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
        data: '='
      },
      controller: ['$scope', inputRangeController],
      link: function ($scope, element, attrs) {
        $scope.isSingle = attrs.hasOwnProperty('lnrSingleInput');
      }
    }
  });


function inputRangeController($scope) {
  var vm = this;

  vm.$postLink = postLink;
  vm.isSingle = false;
  
  function postLink() {
    vm.isSingle = $scope.isSingle;
  }
}