'use strict';

angular.module('breadcrumbs',[]).component('breadcrumbs', {
  templateUrl: 'app/modules/shared/breadcrumbs/breadcrumbs.template.html',
  controllerAs: 'breadcrumbs',
  bindings: {
    breadcrumbsData: '<'
  },
  controller: function BreadcrumbsController() {
    var breadcrumbs = this;
  }
});
