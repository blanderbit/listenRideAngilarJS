'use strict';

angular.module('brands', []).component('brands', {
  templateUrl: 'app/modules/brands/brands.template.html',
  controllerAs: 'brands',
  controller: ['$translatePartialLoader', 'ENV', 'notification',
    function BrandsController($tpl, ENV, notification) {

      var brandsController = this;
      $tpl.addPart(ENV.staticTranslation);

      brandsController.$onInit = function() {
        // variables
        // methods
        // invocations
      }


    }
  ]
});
