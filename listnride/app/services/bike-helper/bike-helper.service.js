'use strict';

angular.module('listnride')
  .factory('bikeHelper', function (api) {

    let getBikeEditUrl = (bike) => {
      return bike.is_cluster ? '/clusters/' + bike.cluster_id + '/update_rides/' : '/rides/' + bike.id;
    }

    let changeBikeAvailableTo = (bike, changeTo) => {
      let data = {
        "ride": {
          "id": bike.id,
          "available": changeTo
        }
      }
      return api.put(getBikeEditUrl(bike), data);
    }

    return {
      changeBikeAvailableTo,
      getBikeEditUrl
    };
  });
