'use strict';

angular.module('addressInput',[]).component('addressInput', {
  templateUrl: 'app/modules/shared/address-input/address-input.template.html',
  controllerAs: 'addressInput',
  bindings: {
    bike: '<',
    booked: '<',
    home: '<',
    seo: '<'
  },
  controller: ['$mdMedia',
    function AddressInputController($mdMedia) {
      var addressInput = this;
      
      addressInput.updateAddress = function(place) {
        var components = place.address_components;
        if (components) {
          var desiredComponents = {
            "street_number": "",
            "route": "",
            "locality": "",
            "country": "",
            "postal_code": ""
          };

          for (var i = 0; i < components.length; i++) {
            var type = components[i].types[0];
            if (type in desiredComponents) {
              desiredComponents[type] = components[i].long_name;
            }
          }

          addressInput.street = desiredComponents.route;
          addressInput.streetNumber = desiredComponents.street_number;
          addressInput.zip = desiredComponents.postal_code;
          addressInput.city = desiredComponents.locality;
          addressInput.country = desiredComponents.country;

          console.log(addressInput.addressForm);
          console.log(addressInput.addressForm.zip);
          addressInput.addressForm.$setTouched();
          addressInput.addressForm.$validate();

          // addressInput.addressForm.$setSubmitted();
        }
      }
    }
  ]
});
