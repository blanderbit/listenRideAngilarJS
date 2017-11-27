'use strict';

angular.module('listings').component('tileView', {
  templateUrl: 'app/modules/listings/views/tile-view.template.html',
  controllerAs: 'tileView',
  bindings: {
    bikes: '<',
    status: '=',
    duplicating: '='
  },
  controller: ['$localStorage', 'api',
    function TileViewController($localStorage, api) {
      var tileView = this;
    }
  ]
});
