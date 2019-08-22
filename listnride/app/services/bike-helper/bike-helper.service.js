'use strict';

angular.module('listnride')
  .factory('bikeHelper', function (api) {

    const insuranceCountries = ['DE', 'AT'];

    let getBikeEditUrl = bike => bike.is_cluster ? '/clusters/' + bike.cluster_id + '/update_rides/' : '/rides/' + bike.id;

    let changeBikeAvailableTo = (bike, changeTo) => {
      let data = {
        "ride": {
          "id": bike.id,
          "available": changeTo
        }
      }
      return api.put(getBikeEditUrl(bike), data);
    }
    let createBikeAvailability = ({id, isCluster, data}) => {
      let availabilityUrl = (isCluster ? '/clusters/' : '/rides/') + id + '/availabilities';

      return api.post(availabilityUrl, data);
    }
    let removeBikeAvailability = (id, availabilityId) => {
      return api.delete(`/rides/${id}/availabilities/${availabilityId}`)
    }
    let isBikeCountryInsuranced = (bike) => _.includes(insuranceCountries, bike.country_code);

    return {
      changeBikeAvailableTo,
      getBikeEditUrl,
      createBikeAvailability,
      removeBikeAvailability,
      isBikeCountryInsuranced
    };
  });
