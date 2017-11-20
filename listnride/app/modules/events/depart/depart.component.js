'use strict';

angular.module('depart',[]).component('depart', {
  templateUrl: 'app/modules/events/depart/depart.template.html',
  controllerAs: 'depart',
  controller: ['api', '$translatePartialLoader',
    function DepartController(api, $tpl) {
      var depart = this;
        $tpl.addPart('static');
        depart.bikes = [];

        api.get('/rides?family=18').then(
          function(response) {
            depart.bikes = response.data;
          },
          function(error) {
            console.log("Error retrieving User", error);
          }
        );
    }
  ]
});

