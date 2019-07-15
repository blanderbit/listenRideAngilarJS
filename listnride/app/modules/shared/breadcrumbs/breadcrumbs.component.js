'use strict';

angular.module('breadcrumbs',[]).component('breadcrumbs', {
  templateUrl: 'app/modules/shared/breadcrumbs/breadcrumbs.template.html',
  controllerAs: 'breadcrumbs',
  bindings: {
    breadcrumbsData: '<'
  },
  controller: [function BreadcrumbsController() {
    var breadcrumbs = this;
  }]
});

// TODO to use breadcrumbs just add to component
// SOME_COMPONENT.breadcrumbs = [
// {
//   title:'Home',
//   link: '/'
// },
// {
//   title:'Berlin',
//   link: 'https://localhost:8080/berlin'
// }
