angular.module('list').directive('focus', function() {
  return {
    restrict: "A",
    link: function($scope, element) {
      element.on("input", function(e) {
        var input = element.find('input');
        if(input.length == input.attr("maxlength")) {
          var $nextElement = element.next();
          if($nextElement.length) {
            $nextElement.find('input').focus();
          }
        }
      });
    }
  }
});
