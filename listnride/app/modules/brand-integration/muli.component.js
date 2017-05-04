'use strict';

angular.module('muli-integration',[]).component('muli', {
  templateUrl: 'app/modules/brand-integration/muli.template.html',
  controllerAs: 'muli',
  controller: [ '$translate', 'api',
    function MuliController($translate, api) {
      var muli = this;

    }
  ]
});