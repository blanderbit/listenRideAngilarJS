'use strict';

angular.module('listings').component('listView', {
  templateUrl: 'app/modules/listings/views/list-view.template.html',
  controllerAs: 'listView',
  bindings: {
    bikes: '<'
  },
  controller: ['$mdSidenav', '$localStorage', 'api',
    function ListViewController($mdSidenav, $localStorage, api) {
      var listView = this;

      listView.toggleSidenav = function() {
        console.log($localStorage.userId);
        $mdSidenav('edit').toggle();
      };

    }
  ]
});
