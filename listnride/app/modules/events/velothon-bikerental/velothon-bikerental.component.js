'use strict';

angular.module('velothonBikerental',[]).component('velothonBikerental', {
    templateUrl: 'app/modules/events/velothon-bikerental/velothon-bikerental.template.html',
    controllerAs: 'velothonBikerental',
    controller: ['NgMap', 'api', '$translate', 'ngMeta',
        function VelothonBikerental(NgMap, api, $translate, ngMeta) {
            var velothonBikerental = this;

            ngMeta.setTitle($translate.instant("events.velothon-bikerental.meta-title"));
            ngMeta.setTag("description", $translate.instant("events.velothon-bikerental.meta-description"));

            api.get('/rides?category=20&location=Berlin&priority=velothon').then(
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
