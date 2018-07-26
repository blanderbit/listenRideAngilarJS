'use strict';

angular.module('eroicaGaiole',[]).component('eroicaGaiole', {
    templateUrl: 'app/modules/events/eroica-gaiole/eroica-gaiole.template.html',
    controllerAs: 'eroicaGaiole',
    controller: ['NgMap', 'api', '$translate','$translatePartialLoader',
    function EroicaGaioleController(NgMap, api, $translate, $tpl) {
        var eroicaGaiole = this;
        $tpl.addPart('static');

        eroicaGaiole.sizeOptions = [
            {value: "", label: "-"},
            {value: 155, label: "155 - 165 cm"},
            {value: 165, label: "165 - 175 cm"},
            {value: 175, label: "175 - 185 cm"},
            {value: 185, label: "185 - 195 cm"},
            {value: 195, label: "195 - 205 cm"}
          ];

        eroicaGaiole.isAvailable = function (bike) {

        };

        $translate('search.all-sizes').then(function (translation) {
            eroicaGaiole.sizeOptions[0].label = translation;
        });
        // TODO: add booked_at filter
        api.get('/users/6352').then(
            function(response) {
                console.log(response);
                eroicaGaiole.bikes = response.data.rides;
            },
            function(error) {
            }
        );

    }
    ]
});
