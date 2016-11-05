'use strict';

angular.module('rating').component('rating', {
  templateUrl: 'app/modules/shared/rating/rating.template.html',
  controllerAs: 'rating',
  bindings: {
    data: '<'
  },
  controller: [ 'api',
    function RatingController(api) {
      var rating = this;
    }
  ]
});