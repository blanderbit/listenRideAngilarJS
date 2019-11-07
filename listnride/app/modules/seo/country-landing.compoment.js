angular.module('countryLanding', []).component('countryLanding', {
  templateUrl: 'app/modules/seo/country-landing.template.html',
  controllerAs: 'countryLanding',
  controller: function CountryLandingController(
    $localStorage,
    $state,
    $scope,
    $stateParams,
    authentication,
    api
  ){
    const countryLanding = this;

    countryLanding.$onInit = function() {
      // variables
      countryLanding.countryData = [];
      countryLanding.languageCode = authentication.retrieveLocale();
      countryLanding.citiesNames = [];
      countryLanding.breadcrumbs = [
        {
          title:'Home',
          route: 'home'
        },
        {
          title:`Countries`
        }];


      countryLanding.countryName = $stateParams.country;
      countryLanding.currentCountry = null;
      // invocations
      getCountryData();
    };

    function getCountryData() {
      api.get('/seo_countries').then(function(response) {
        countryLanding.countryData = response.data;
        countryLanding.currentCountry = _.find(response.data, (country) => {
          const countryName = country.name.en.toLowerCase();
          return countryName == $stateParams.country;
        });

        if (countryLanding.currentCountry) {
          countryLanding.breadcrumbsCountry = [
            {
              title:'Home',
              route: 'home'
            },
            {
              title: `Countries`,
              route: 'countries'
            },
            {
              title: countryLanding.currentCountry.name[countryLanding.languageCode]
            }];
        }
      }).catch(function(error) {
        $state.go('404');
      });
    }
  }
});