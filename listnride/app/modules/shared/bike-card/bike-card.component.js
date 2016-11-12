(function(){
'use strict';
angular.module('bikeCard',[]).component('bikeCard', {
  templateUrl: 'app/modules/shared/bike-card/bike-card.template.html',
  controllerAs: 'bikeCard',
  bindings: {
    bike: '<'
  },
  controller: [
    function BikeCardController() {
      var bikeCard = this;
    }
  ]
});
})();