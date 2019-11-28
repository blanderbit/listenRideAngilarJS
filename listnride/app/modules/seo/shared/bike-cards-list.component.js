angular.module('bikeCardsList', []).component('bikeCardsList', {
  templateUrl: 'app/modules/seo/shared/bike-cards-list.template.html',
  controllerAs: 'bikeCardsList',
  bindings: {
    title: '<',
    subtitle: '<',
    btnText: '<',
    bikes: '<',
    city: '<',
    subcategories: '<',
    ref: '<'
  },
  controller: function BikeCardsListController() {
    const bikeCardsList = this;

    bikeCardsList.btnUrl = function() {
      if (bikeCardsList.ref) {
        return 'categoryLanding({city: bikeCardsList.city.toLowerCase(), category: bikeCardsList.ref})'
      } else {
        return 'search({location: bikeCardsList.city, categories: bikeCardsList.subcategories})'
      }
    };
  }
});
