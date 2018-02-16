angular
  .module('list')
  .directive('lnrMdFocusTabs', ['$window','$timeout',lnrMdFocusTabs]);
  
function lnrMdFocusTabs($window, $timeout) {
  return {
    restrict: "A",
    link: function ($scope, $tabs, attrs) {
      var tabBox = $tabs.find('md-tabs-wrapper');
      var tabViewWrapper = $tabs.find('md-pagination-wrapper');
      var activeTab;
      var currentLeftOffset;
      var newValue;
      var selectedIndex;

      // helper function to calc dom element offset().right
      // if element is not defined - returns false;
      function _offsetRight(el) {
        return el.length ? el.offset().left + el.outerWidth() : false;
      }

      $scope.$watch(attrs.lnrMdFocusTabs, function (value) {
        selectedIndex = value;
        changeFocus();
      });

      // This timeout is necessary, because the browser needs a little bit
      // of time to calculate the offsets and width
      $window.onload = function () {
        $timeout(function () {
          $tabs.addClass('lnr-md-focus-tabs');
          changeFocus();
        }, 10, false);
      } 

      /**
       * Scroll to active tab
       * When tab focus is changed, active tab may be not visible on the screen
       * @TODO: also add focus if active element's offet().left not on a view
       */
      function changeFocus () {
        if (!$tabs.find('md-tab-item').length && !$tabs.width()) return;

        activeTab = $tabs.find('md-tab-item').eq(selectedIndex);
        currentLeftOffset = parseInt(tabViewWrapper.css('left'));

        if (tabBox.width() + tabBox.offset().left >= _offsetRight(activeTab)) return false;

        newValue = Math.round(tabBox.width() + tabBox.offset().left - _offsetRight(activeTab) + currentLeftOffset);

        // if it's not a last tab - add some pixels to see next tab's label
        if (selectedIndex !== $tabs.find('md-tab-item').length - 1) {
          newValue -= 60;
        }

        // @TODO: find a way to change public properties in mdTabs controller
        // It rewrites transform on offsetLeft change
        // so we use left insead of transform
        tabViewWrapper.css({
          'left': newValue + 'px'
          // '-webkit-transform:': 'translate3d(' + newValue + 'px' + ', 0, 0)',
          // 'transform': 'translate3d(' + newValue + 'px' + ', 0, 0)'
        });
      }
    }
  }
};
