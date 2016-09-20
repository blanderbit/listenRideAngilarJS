'use strict';

angular.
  module('listnride').
  factory('authentication', [
    'Base64', '$http', '$localStorage', '$mdDialog', '$mdToast', 'ezfb', 'api',
    function(Base64, $http, $localStorage, $mdDialog, $mdToast, ezfb, api){
      
      // First all inner functions

      // Signals the user that login was successful, e.g. hiding dialog and showing a toast
      var showSuccess = function() {
        $mdDialog.hide();
        $mdToast.show(
          $mdToast.simple()
          .textContent('Successfully logged in.')
          .hideDelay(3000)
          .position('bottom right')
        );
      }

      // Signals user that login was unsuccessful, e.g. showing the error
      var showError = function() {
        //
      }

      // After successful login/loginFb, authorization header gets created and saved in localstorage
      var setCredentials = function (email, password) {
        var encoded = Base64.encode(email + ':' + password);
        $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
        $localStorage.auth = encoded;
      }

      // Retrieves the user's facebook details and uses them to log him in
      var loginFb = function() {
        ezfb.api('/me?fields=id,email,first_name,last_name,picture.width(600).height(600)', function(response) {
          var user = {
            'user': {
              'email': response.email,
              'facebook_id': response.id
            }
          };
          api.post('/users/login', user).then(function success(response) {
            setCredentials(response.data.email, response.data.password_hashed);
            showSuccess();
          }, function error(response) {
            showError();
          })
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

        login: function(email, password) {
          var user = {
            'user': {
              'email': email,
              'password_hashed': password
            }
          };
          api.post('/users/login', user).then(function success(response) {
            setCredentials(response.data.email, response.data.password_hashed);
            showSuccess();
          }, function error(response) {
            showError();
          })
        },

        // Checks if user is logged in via fb already, otherwise prompts him to do so
        // then actually logs in the user through our backend
        connectFb: function() {
          ezfb.getLoginStatus(function(response) {
            if (response.status === 'connected') {
              loginFb();
            } else {
              ezfb.login(function(response) {
                loginFb();
              }, {scope: 'email'});
            }
          });
        },

        // Logs out the user by deleting the auth header from localStorage
        logout: function() {
          document.execCommand("ClearAuthenticationCache");
          delete $localStorage.auth;
          $http.defaults.headers.common.Authorization = 'Basic ';

          $mdToast.show(
            $mdToast.simple()
            .textContent('You are logged out.')
            .hideDelay(3000)
            .position('bottom right')
          );
        }

      };
    }
  ]);