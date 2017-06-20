'use strict';

angular.module('invest',[]).component('invest', {
  templateUrl: 'app/modules/invest/invest.template.html',
  controllerAs: 'invest',
  controller: [ '$translate', 'api', 'ngMeta',
    function InvestController($translate, api, ngMeta) {

      ngMeta.setTitle($translate.instant("invest.meta-title"));
      ngMeta.setTag("description", $translate.instant("invest.meta-description"));

      var invest = this;

      invest.submitted = false;
      invest.submitting = false;
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

      invest.submit = function() {
        var data = {};
        invest.submitting = true
        data.preregistration = invest.user;
        api.post('/preregistrations', data).then(
          function (success) {
            invest.submitted = true;
          },
          function (error) {

          }
        );
      }

    }
  ]
});
