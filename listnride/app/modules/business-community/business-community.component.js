'use strict';

angular.module('businessCommunity',[]).component('businessCommunity', {
  templateUrl: 'app/modules/business-community/business-community.template.html',
  controllerAs: 'businessCommunity',
  controller: ['$translate', 'authentication', '$translatePartialLoader',
    function BusinessCommunityController($translate, authentication, $tpl) {

      var businessCommunity = this;
      $tpl.addPart('static');
      businessCommunity.authentication = authentication;

    }
  ]
});
