'use strict';

angular.module('velothonBikerental',[]).component('velothonBikerental', {
    templateUrl: 'app/modules/events/velothon-bikerental/velothon-bikerental.template.html',
    controllerAs: 'velothonBikerental',
    controller: ['NgMap', 'api', '$translate', '$translatePartialLoader', 'ENV',
        function VelothonBikerental(NgMap, api, $translate, $tpl, ENV) {
            var velothonBikerental = this;
            $tpl.addPart(ENV.staticTranslation);

            velothonBikerental.sizeOptions = [
                {value: "", label: "-"},
                {value: 155, label: "155 - 165 cm"},
                {value: 165, label: "165 - 175 cm"},
                {value: 175, label: "175 - 185 cm"},
                {value: 185, label: "185 - 195 cm"},
                {value: 195, label: "195 - 205 cm"}
            ];

            velothonBikerental.isAvailable = function (bike) {
            };

            $translate('search.all-sizes').then(function (translation) {
                velothonBikerental.sizeOptions[0].label = translation;
            });
            api.get('/rides?category=30&location=Berlin&priority=velothon&booked_at=2018-05-13').then(
                function(response) {
                    velothonBikerental.bikes = response.data.bikes;
                },
                function(error) {
                }
            );

        }
    ]
});
