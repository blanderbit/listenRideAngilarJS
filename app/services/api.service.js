'use strict';

angular.
  module('listnride').
  factory('api', ['$http', '$localStorage',
    function($http, $localStorage) {
      var apiUrl = "https://listnride-staging.herokuapp.com/v2";
      return {
        get: function(url) {
          return $http({
            method: 'GET',
            url: apiUrl + url,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + $localStorage.auth
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
              'Authorization': 'Basic ' + $localStorage.auth
            }
          });
        }
      }
    }
  ]);