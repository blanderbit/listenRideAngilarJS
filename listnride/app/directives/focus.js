angular.module('list').directive('focus', function() {
  return {
    restrict: "A",
    link: function($scope, element) {
      element.on("keyup", function(e) {
        var input = element.find('input');
        var key = e.keyCode || e.charCode;

        if(input[0].value.length == input.attr("maxlength")) {
          var $nextElement = element.next();
          if ($nextElement.length) {
            $nextElement.find('input').focus();
          }
        }

        if (key === 8 || key === 46) {
          var $prevElement = element.prev();
          $prevElement.find('input').focus();
        }
      });

      element.on("input", function(e) {
        var input = element.find('input')[0];
        input.value = input.value.replace(/[^0-9.]/g, '');
        input.value = input.value.replace(/(\..*)\./g, '$1');
      });

      element.on("keydown", function(e) {
        var input = element.find('input');
        if(input[0].value.length == input.attr("maxlength") && e.keyCode !=8) return false;
      });
    }
  }
});
