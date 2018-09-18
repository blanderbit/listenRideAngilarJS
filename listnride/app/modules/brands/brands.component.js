'use strict';

angular.module('brands', []).component('brands', {
  templateUrl: 'app/modules/brands/brands.template.html',
  controllerAs: 'brands',
  controller: ['notification',
    function BrandsController(notification) {

      var brandsController = this;

      brandsController.$onInit = function() {
        // variables
        // methods
        // invocations
      }


    }
  ]
});
