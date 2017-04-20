'use strict';

angular.
  module('listnride').
  factory('api', ['$http', '$localStorage', 'ENV',
    function($http, $localStorage, ENV, authentication) {
      var apiUrl = ENV.apiEndpoint;
      return {
        get: function(url, type) {
          if (typeof type === 'undefined') { type = 'json'; }
          return $http({
            method: 'GET',
            url: apiUrl + url,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': $localStorage.auth
            },
            responseType: type
          });
        },
        post: function(url, data) {
          return $http({
            method: 'POST',
            url: apiUrl + url,
            data: data,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': $localStorage.auth
            }
          });
        },
        put: function(url, data) {
          return $http({
            method: 'PUT',
            url: apiUrl + url,
            data: data,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': $localStorage.auth
            }
          });
        },
        getApiUrl: function() {
          return apiUrl;
        }
      }
    }
  ]);
