'use strict';

angular.module('search').component('search', {
  templateUrl: 'modules/search/search.template.html',
  controllerAs: 'search',
  controller: ['$http',
    function SearchController($http) {
      var search = this;
    }
  ]
});