'use strict';

angular.
  module('listnride').
  factory('authentication', [
    'Base64', '$http', '$localStorage', '$q', 'ezfb', 'api',
    function(Base64, $http, $localStorage, $q, ezfb, api){

      // After successful login/loginFb, authorization header gets created and saved in localstorage
      var setCredentials = function (email, password) {
        var encoded = Base64.encode(email + ':' + password);
        $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
        $localStorage.auth = encoded;
      }

      // Retrieves the user's facebook details and uses them to log him in
      var queryFb = function(success, error) {
          ezfb.api('/me?fields=id,email,first_name,last_name,picture.width(600).height(600)', function(response) {
            var user = {
              'user': {
                'email': response.email,
                'facebook_id': response.id
              }
            };
            api.post('/users/login', user).then(function(response) {
              setCredentials(response.data.email, response.data.password_hashed);
              success();
            }, function(response) {
              error();
            });
          });
      }
  
      // Further all functions to be exposed in the service

      return {
        loggedIn: function() {
          if ($localStorage.auth != null) {
            return true;
          } else {
            return false;
          }
        },

        signup: function(email, password, firstName, lastName) {
          return $q(function(resolve, reject) {
            var user = {
              'user': {
                'email': email,
                'password_hashed': password,
                'first_name': firstName,
                'last_name': lastName
              }
            };
            api.post('/users', user).then(function(success) {
              setCredentials(success.data.email, success.data.password_hashed);
              resolve();
            }, function(error) {
              reject();
            });

          });
        },

        login: function(email, password) {
          return $q(function(resolve, reject) {
            var user = {
              'user': {
                'email': email,
                'password_hashed': password
              }
            };
            api.post('/users/login', user).then(function(success) {
              console.log(success);
              setCredentials(success.data.email, success.data.password_hashed);
              resolve();
            }, function(error) {
              console.log(error);
              reject();
            });
          });
        },

        // Checks if user is logged in via fb already, otherwise prompts him to do so
        // then actually logs in the user through our backend
        loginFb: function() {
          return $q(function(resolve, reject) {
            ezfb.getLoginStatus(function(response) {
              if (response.status === 'connected') {
                return queryFb(function(success) {
                  resolve();
                }, function(error) {
                  reject();
                });
              } else {
                ezfb.login(function(response) {
                  return queryFb(function(success) {
                    resolve();
                  }, function(reject) {
                    reject();
                  });
                }, {scope: 'email'});
              }
            });
          });
        },

        // Logs out the user by deleting the auth header from localStorage
        logout: function() {
          document.execCommand("ClearAuthenticationCache");
          delete $localStorage.auth;
          $http.defaults.headers.common.Authorization = 'Basic ';
        }

      };
    }
  ]);