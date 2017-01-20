'use strict';

angular.
  module('listnride').
  factory('userApi', ['$http', '$localStorage', 'api',
    function($http, $localStorage, api) {
      function getUserData() {
        return api.get('/users/' + $localStorage.userId)
      }
      return {
        getUserData: getUserData
      }
    }
  ]);
