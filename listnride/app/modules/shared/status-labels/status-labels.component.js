'use strict';

angular.module('statusLabels', []).component('statusLabels', {
  templateUrl: 'app/modules/shared/status-labels/status-labels.template.html',
  controllerAs: 'statusLabels',
  bindings: {
    labels: '<',
  },
  controller: [function StatusLabelsController() {
      var statusLabels = this;
    }
  ]
});
