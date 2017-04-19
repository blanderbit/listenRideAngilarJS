'use strict';

angular.module('velothonBikerental',[]).component('velothonBikerental', {
    templateUrl: 'app/modules/events/velothon-bikerental/velothon-bikerental.template.html',
    controllerAs: 'velothonBikerental',
    controller: ['NgMap', 'api',
        function VelothonBikerental(NgMap, api) {
            var velothonBikerental = this;

            api.get('/rides?location=Berlin&cat1=false&cat3=false&cat4=false&cat5=false&cat6=false').then(
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
