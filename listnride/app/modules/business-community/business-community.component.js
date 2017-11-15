'use strict';

angular.module('businessCommunity',[]).component('businessCommunity', {
  templateUrl: 'app/modules/business-community/business-community.template.html',
  controllerAs: 'businessCommunity',
  controller: ['$translate', 'authentication',
    function BusinessCommunityController($translate, authentication) {

      var businessCommunity = this;
      businessCommunity.authentication = authentication;

    }
  ]
});
