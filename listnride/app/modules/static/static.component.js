'use strict';

angular
  .module('static', [])
  .controller('StaticController', ['$translate', '$translatePartialLoader', function ($translate, $tpl) {
    $tpl.addPart('static');
  }]);
