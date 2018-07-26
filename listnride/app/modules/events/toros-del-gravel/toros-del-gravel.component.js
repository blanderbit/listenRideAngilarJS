'use strict';

angular.module('torosDelGravel',[]).component('torosDelGravel', {
    templateUrl: 'app/modules/events/toros-del-gravel/toros-del-gravel.template.html',
    controllerAs: 'torosDelGravel',
    controller: ['NgMap', 'api', '$translate','$translatePartialLoader',
    function TorosDelGravelController(NgMap, api, $translate, $tpl) {
        var torosDelGravel = this;
        $tpl.addPart('static');

        torosDelGravel.sizeOptions = [
            {value: "", label: "-"},
            {value: 155, label: "155 - 165 cm"},
            {value: 165, label: "165 - 175 cm"},
            {value: 175, label: "175 - 185 cm"},
            {value: 185, label: "185 - 195 cm"},
            {value: 195, label: "195 - 205 cm"}
          ];

        torosDelGravel.isAvailable = function (bike) {

        };

        $translate('search.all-sizes').then(function (translation) {
            torosDelGravel.sizeOptions[0].label = translation;
        });
        // TODO: Readd &booked_at=2018-07-14 when API is fixed
        api.get('/rides?category=42,43&location=Mallorca&booked_at=2018-10-13').then(
            function(response) {
                torosDelGravel.bikes = response.data.bikes;
            },
            function(error) {
            }
        );

    }
    ]
});
