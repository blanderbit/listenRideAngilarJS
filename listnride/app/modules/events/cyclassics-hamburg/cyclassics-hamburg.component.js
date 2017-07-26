'use strict';

angular.module('cyclassicsHamburg',[]).component('cyclassicsHamburg', {
    templateUrl: 'app/modules/events/cyclassics-hamburg/cyclassics-hamburg.template.html',
    controllerAs: 'cyclassicsHamburg',
    controller: ['NgMap', 'api', '$translate', '$analytics', 'ngMeta',
    function CyclassicsHamburg(NgMap, api, $translate, $analytics, ngMeta) {
        var cyclassicsHamburg = this;
        $analytics.eventTrack('View Content', {  category: 'Event Page', label: 'Cyclassics Hamburg'});

        ngMeta.setTitle($translate.instant("events.cyclassics-hamburg.meta-title"));
        ngMeta.setTag("description", $translate.instant("events.cyclassics-hamburg.meta-description"));

        cyclassicsHamburg.sizeOptions = [
            {value: "", label: "-"},
            {value: 155, label: "155 - 165 cm"},
            {value: 165, label: "165 - 175 cm"},
            {value: 175, label: "175 - 185 cm"},
            {value: 185, label: "185 - 195 cm"},
            {value: 195, label: "195 - 205 cm"}
          ];

        cyclassicsHamburg.isAvailable = function (bike) {

        };

        $translate('search.all-sizes').then(function (translation) {
            cyclassicsHamburg.sizeOptions[0].label = translation;
        });

        api.get('/rides?category=20&location=Hamburg').then(
            function(response) {
                cyclassicsHamburg.bikes = response.data;
            },
            function(error) {
            }
        );

    }
    ]
});
