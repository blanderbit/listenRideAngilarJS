'use strict';

angular.module('invest',[]).component('invest', {
  templateUrl: 'app/modules/invest/invest.template.html',
  controllerAs: 'invest',
  controller: [ '$translate', 'api', 'ngMeta',
    function InvestController($translate, api, ngMeta) {

      ngMeta.setTitle($translate.instant("brand-integration.muli.meta-title"));
      ngMeta.setTag("description", $translate.instant("brand-integration.muli.meta-description"));

      var invest = this;

      invest.values = [
        "10 - 250€",
        "250 - 500€",
        "500 - 1.000€",
        "1.000 - 5.000€",
        "10.000 - 20.000€",
        "20.000 - 50.000€"
      ];

      invest.user = {
        firstName: "",
        lastName: "",
        email: "",
        value: invest.values[0]
      };

    }
  ]
});
