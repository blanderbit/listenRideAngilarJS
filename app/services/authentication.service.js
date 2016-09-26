'use strict';

angular.
  module('listnride').
  factory('authentication', [
    'Base64', '$http', '$localStorage', '$q', 'ezfb', 'api',
    function(Base64, $http, $localStorage, $q, ezfb, api){

      // After successful login/loginFb, authorization header gets created and saved in localstorage
      var setCredentials = function (email, password, id) {
        var encoded = Base64.encode(email + ":" + password);
        $localStorage.auth = encoded;
        $localStorage.userId = id;
      }

      var loginFb = function(email, facebookId, success, error) {
        var user = {
          'user': {
            'email': email,
            'facebook_id': facebookId
          }
        };
        api.post('/users/login', user).then(function(response) {
          setCredentials(response.data.email, response.data.password_hashed, response.data.id);
          success();
        }, function(response) {
          error();
        });
      };

      var signupFb = function(email, fbId, fbAccessToken, profilePicture, firstName, lastName, success, error) {
        var user = {
          "user": {
            "email": email,
            "facebook_id": fbId,
            "facebook_access_token": fbAccessToken,
            "profile_picture_url": profilePicture,
            "first_name": firstName,
            "last_name": lastName
          }
        };
        api.post("/users", user)
        .then(function(response) {
          success();
        }, function(response) {
          error();
        });
      };

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
              setCredentials(success.data.email, success.data.password_hashed, success.data.id);
              resolve();
            }, function(error) {
              reject();
            });

          });
        },

        signupFb: function() {
          return $q(function(resolve, reject) {
            ezfb.getLoginStatus(function(response) {
              if (response.status === 'connected') {
                var accessToken = response.authResponse.accessToken;
                ezfb.api('/me?fields=id,email,first_name,last_name,picture.width(600).height(600)', function(response) {
                  signupFb(response.email, response.id, accessToken, response.picture.data.url, response.first_name, response.last_name,
                    function(success) {
                      resolve();
                    }, function(error) {
                      reject();
                    }
                  );
                });
              } else {
                ezfb.login(function(response) {
                  ezfb.api('/me?fields=id,email,first_name,last_name,picture.width(600).height(600)', function(response) {
                  signupFb(response.email, response.id, accessToken, response.picture.data.url, response.first_name, response.last_name,
                      function(success) {
                        resolve();
                      }, function(error) {
                        reject();
                      }
                    );
                  });
                });
              }
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
              setCredentials(success.data.email, success.data.password_hashed, success.data.id);
              console.log(success.data.email + ", " + success.data.password_hashed);
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
                ezfb.api('/me?fields=id,email,first_name,last_name,picture.width(600).height(600)', function(response) {
                  loginFb(response.email, response.id, function() {
                    resolve();
                  }, function() {
                    reject();
                  });
                });
              } else {
                ezfb.login(function(response) {
                  ezfb.api('/me?fields=id,email,first_name,last_name,picture.width(600).height(600)', function(response) {
                    loginFb(response.email, response.id, function() {
                      resolve();
                    }, function() {
                      reject();
                    });
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
          delete $localStorage.userId;
          $http.defaults.headers.common.Authorization = '';
        }

      };
    }
  ]);