'use strict';

angular.
  module('listnride').
  factory('api', ['$http', '$localStorage',
    function($http, $localStorage) {
      var apiUrl = "https://listnride-staging.herokuapp.com/v2";
      var authHeader = "";
      $localStorage.auth != null ? authHeader = 'Basic ' + $localStorage.auth : authHeader = "";
      return {
        get: function(url) {
          return $http({
            method: 'GET',
            url: apiUrl + url,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authHeader
            }
          });
        },
        post: function(url, data) {
          return $http({
            method: 'POST',
            url: apiUrl + url,
            data: data,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authHeader
            }
          });
        }
      }
    }
  ]);