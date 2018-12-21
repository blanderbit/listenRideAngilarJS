'use strict';

angular.
  module('listnride').
  factory('api', ['$http', '$localStorage', 'ENV',
    function($http, $localStorage, ENV) {
      var apiUrl = ENV.apiEndpoint;
      var webappUrl = ENV.webappUrl;
      console.log("default translation: ", ENV.defaultTranslation);
      console.log("static translation: ", ENV.staticTranslation);
      return {
        get: function(url, type) {
          if (typeof type === 'undefined') { type = 'json'; }
          return $http({
            method: 'GET',
            url: apiUrl + url,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + $localStorage.accessToken
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
              'Authorization': 'Bearer ' + $localStorage.accessToken
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
              'Authorization': 'Bearer ' + $localStorage.accessToken
            }
          });
        },
        delete: function(url) {
          return $http({
            method: 'DELETE',
            url: apiUrl + url,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + $localStorage.accessToken
            }
          });
        },
        getApiUrl: function() {
          return apiUrl;
        },
        getWebappUrl: function() {
          return webappUrl;
        }
      }
    }
  ]);
