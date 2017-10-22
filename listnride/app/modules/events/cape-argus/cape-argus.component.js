'use strict';

angular.module('capeArgus',[]).component('capeArgus', {
    templateUrl: 'app/modules/events/cape-argus/cape-argus.template.html',
    controllerAs: 'capeArgus',
    controller: ['NgMap', 'api', '$translate', 'ngMeta',
        function CapeArgusController(NgMap, api, $translate, ngMeta) {
            var capeArgus = this;

            ngMeta.setTitle($translate.instant("events.cape-argus.meta-title"));
            ngMeta.setTag("description", $translate.instant("events.cape-argus.meta-description"));

            capeArgus.sizeOptions = [
                {value: "", label: "-"},
                {value: 155, label: "155 - 165 cm"},
                {value: 165, label: "165 - 175 cm"},
                {value: 175, label: "175 - 185 cm"},
                {value: 185, label: "185 - 195 cm"},
                {value: 195, label: "195 - 205 cm"}
            ];

            capeArgus.isAvailable = function (bike) {
            };

            $translate('search.all-sizes').then(function (translation) {
                capeArgus.sizeOptions[0].label = translation;
            });

            api.get('/rides?category=20&location=Capetown&priority=capeArgus&booked_at=2017-06-18').then(
                function(response) {
                    capeArgus.bikes = response.data;
                },
                function(error) {
                    console.log("Error retrieving User", error);
                }
            );

        }
    ]
});
