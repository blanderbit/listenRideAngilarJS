'use strict';

angular.
  module('listnride').
  factory('authentication', ['', function(){
    return function name(){
      // initialize to whatever is in the cookie, if anything
      $http.defaults.headers.common['Authorization'] = 'Basic ' + $cookieStore.get('authdata');
 
      return {
        setCredentials: function (username, password) {
          var encoded = Base64.encode(username + ':' + password);
          $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
          $cookieStore.put('authdata', encoded);
        },
        clearCredentials: function () {
          document.execCommand("ClearAuthenticationCache");
          $cookieStore.remove('authdata');
          $http.defaults.headers.common.Authorization = 'Basic ';
        }
      };
    };
  }]);