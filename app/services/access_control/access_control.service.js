'use strict';

angular
.module('listnride')
.factory('access_control', ['$localStorage', '$state',
  function($localStorage, $state) {

    return {
      // TODO: redirect to login/signup page then pop the router stack upon authentication
      requireLogin: function() {
        if ($localStorage.userId == undefined) {
          $state.go('home');
          return true;
        } else {
          return false;
        }
      }
    };

  }
]);