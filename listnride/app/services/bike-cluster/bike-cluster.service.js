'use strict';

angular.module('listnride')
    .factory('bikeCluster', ['api', 'date', 'bikeOptions', '$rootScope', function (api, date, bikeOptions, $rootScope) {
      return {
        getSizeTranslations: function (sizes) {
          bikeOptions.sizeOptions(false, true).then(function (resolve) {
            _.map(sizes, function (option) {
              option.name = _.find(resolve, function (o) {
                return o.value === option.size;
              }).label;
            });
          });
        },

        getAvailableClusterBikes: function (clusterId, startDate, endDate) {
          var durationInDays = moment.duration(date.diff(startDate, endDate)).asDays().toFixed();

          return api.get('/clusters/' + clusterId + '?start_date=' + moment(startDate).format('YYYY-MM-DD HH:mm') + '&duration=' + durationInDays);
        },

        markAvailableSizes: function (bikeClusterSizes, bikes) {
          // add special flag to our parameter that will show it's availability
          _.map(bikeClusterSizes, function (option) {
            option.notAvailable = !bikes[option.size];
          });
        }
      };
    }]);
