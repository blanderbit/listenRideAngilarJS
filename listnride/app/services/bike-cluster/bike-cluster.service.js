'use strict';

angular.module('listnride')
    .factory('bikeCluster', ['bikeOptions', function (bikeOptions) {
      return {
        sizeTranslations: function (sizes) {
          bikeOptions.sizeOptions(false, true).then(function (resolve) {
            _.map(sizes, function (option) {
              option.name = _.find(resolve, function (o) {
                return o.value === option.size;
              }).label;
            });
          });
        },
      };
    }]);
