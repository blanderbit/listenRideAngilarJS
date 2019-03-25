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

        updateCluster: function (component, startDate, endDate) {
          var durationInDays = moment.duration(date.diff(startDate, endDate)).asDays().toFixed();
          api.get('/clusters/' + component.cluster.id + '?start_date=' + moment(startDate).format('YYYY-MM-DD HH:mm') + '&duration=' + durationInDays).then(function (response) {
            _.map(component.bikeClusterSizes, function(option){
              option.notAvailable = !response.data.rides[option.size];
            });
            component.cluster.rides = response.data.rides;

            // update scope one more time
            _.defer(function () {
              $rootScope.$apply();
            });
          });
        }
      };
    }]);
