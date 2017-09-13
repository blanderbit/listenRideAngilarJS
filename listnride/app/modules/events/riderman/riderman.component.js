'use strict';

angular.module('riderman',[]).component('riderman', {
    templateUrl: 'app/modules/events/riderman/riderman.template.html',
    controllerAs: 'riderman',
    controller: ['NgMap', 'api', '$translate', 'ngMeta',
    function Riderman(NgMap, api, $translate, ngMeta) {
        var riderman = this;
        ngMeta.setTitle($translate.instant("events.riderman.meta-title"));
        ngMeta.setTag("description", $translate.instant("events.riderman.meta-description"));

        riderman.sizeOptions = [
            {value: "", label: "-"},
            {value: 155, label: "155 - 165 cm"},
            {value: 165, label: "165 - 175 cm"},
            {value: 175, label: "175 - 185 cm"},
            {value: 185, label: "185 - 195 cm"},
            {value: 195, label: "195 - 205 cm"}
          ];

        riderman.isAvailable = function (bike) {

        };

        $translate('search.all-sizes').then(function (translation) {
            riderman.sizeOptions[0].label = translation;
        });

        api.get('/rides?category=20&location=Bad Dürrheim').then(
            function(response) {
                riderman.bikes = response.data;
            },
            function(error) {
            }
        );

    }
    ]
});
