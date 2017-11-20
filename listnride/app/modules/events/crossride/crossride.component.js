'use strict';

angular.module('crossride',[]).component('crossride', {
  templateUrl: 'app/modules/events/crossride/crossride.template.html',
  controllerAs: 'crossride',
  controller: ['api', '$translatePartialLoader',
    function CrossrideController(api, $tpl) {
      var crossride = this;
      $tpl.addPart('static');
      api.get('/rides?family=9').then(
        function(response) {
          crossride.bikes = response.data;
        },
        function(error) {
          console.log("Error retrieving User", error);
        }
      );
    }
  ]
});
