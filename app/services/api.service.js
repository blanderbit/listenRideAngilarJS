'use strict';

angular.
  module('listnride').
  factory('api', ['$http',
    function($http) {
      var apiUrl = "https://listnride-staging.herokuapp.com/v2";
      return {
        get: function(url) {
          return $http({
            method: 'GET',
            url: apiUrl + url,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        },
        post: function(url, data, success, error) {
          return $http({
            method: 'POST',
            url: apiUrl + url,
            data: data,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
      }
    }
  ]);