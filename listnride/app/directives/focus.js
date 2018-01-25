angular.module('list').directive('focus', function() {
  return {
    restrict: "A",
    link: function($scope, element) {
      element.on("keydown", function(e) {
        var input = element.find('input');
        if(input[0].value.length == input.attr("maxlength")) {
          var $nextElement = element.next();
          var key = e.keyCode || e.charCode;
          if (key === 8 || key === 46) {
            return
          }

          if ($nextElement.length) {
            $nextElement.find('input').focus();
          }
        }
      });
    }
  }
});
