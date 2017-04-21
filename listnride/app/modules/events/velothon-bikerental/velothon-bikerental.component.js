'use strict';

angular.module('velothonBikerental',[]).component('velothonBikerental', {
    templateUrl: 'app/modules/events/velothon-bikerental/velothon-bikerental.template.html',
    controllerAs: 'velothonBikerental',
    controller: ['NgMap', 'api',
        function VelothonBikerental(NgMap, api) {
            var velothonBikerental = this;

            api.get('/rides?category=20&location=Berlin&priority=714,166,905,635,290,283,909,906,19,903,904,907').then(
                function(response) {
                    velothonBikerental.bikes = response.data;
                },
                function(error) {
                    console.log("Error retrieving User", error);
                }
            );

        }
    ]
});
