'use strict';

angular.module('home',[]).component('home', {
  templateUrl: 'app/modules/home/home.template.html',
  controllerAs: 'home',
  controller: [ '$state', '$stateParams', '$translate', '$analytics', '$localStorage',
    '$mdDialog', 'verification', 'authentication', 'api', 'ngMeta', 'loadingDialog',
    function HomeController($state, $stateParams, $translate, $analytics, $localStorage, $mdDialog,
                            verification, authentication, api, ngMeta) {
      var home = this;

      if ($state.current.name === "verify" && authentication.loggedIn()) {
        verification.openDialog(false, false, window.event);
      } else if ($state.current.name === "confirm") {
        $mdDialog.show({
          templateUrl: 'app/modules/shared/dialogs/spinner.template.html',
          parent: angular.element(document.body),
          targetEvent: window.event,
          openFrom: angular.element(document.body),
          closeTo: angular.element(document.body),
          clickOutsideToClose: false,
          escapeToClose: false
        });
        api.get('/users/' + $stateParams.userId + '/confirm/' + $stateParams.confirmationCode).then(
          function (success) {
            $mdDialog.show(
              $mdDialog.show()
                .clickOutsideToClose(true)
                .title('Confirmation successful')
                .textContent('Great, you\'ve successfully confirmed your email address!')
                .ok('Ok')
                // .targetEvent(ev)
            );
          },
          function (error) {
            $mdDialog.show(
              $mdDialog.show()
                .clickOutsideToClose(true)
                .title('Confirmation was not successful')
                .textContent('The confirmation code seems to be wrong, please reach out to our customer support.')
                .ok('Ok')
                // .targetEvent(ev)
            );
          }
        );
      }

      ngMeta.setTitle($translate.instant("home.meta-title"));
      ngMeta.setTag("description", $translate.instant("home.meta-description"));

      api.get("/featured").then(function(response) {
        home.featuredBikes = response.data.slice(0,6);
      });

      home.slickConfig = {
        enabled: true,
        autoplay: true,
        draggable: true,
        autoplaySpeed: 12000,
        ease: 'ease-in-out',
        speed: '500',
        prevArrow: "<img class='testimonials-prev-arrow slick-prev' src='app/assets/ui_images/back.png'>",
        nextArrow: "<img class='testimonials-prev-arrow slick-next' src='app/assets/ui_images/next.png'>"
      };

      $translate('shared.from-place').then(function(translation) {
        home.testimonials = [
          {
            userId: 1090,
            userName: "- Jetske " + translation + " Amsterdam",
            userImagePath: "app/assets/ui_images/testmonials/jetske_amsterdam.jpg",
            text: "On listnride I rent out my bikes providing families a simple solution to discover my home town. Besides meeting nice people I make some extra pocket money ☺"
          },
          {
            userId: 1203,
            userName: "- John " + translation + " Potsdam",
            userImagePath: "app/assets/ui_images/testmonials/john_potsdam.jpg",
            text: "Ich habe einige Räder rumstehen und finde es toll diese zu vermieten und Besuchern meiner Stadt ein cooles Rad anzubieten. Immer sehr tolle Mieter gehabt!"
          },
          {
            userId: 1739,
            userName: "- Cornelia " + translation + " Basel",
            userImagePath: "app/assets/ui_images/testmonials/cornelia_basel.jpg",
            text: "Wir waren zu Besuch in Berlin und wollten diesmal ein schönes E-Bike testfahren. Auf listnride haben wir E-Bikes der Marke Ampler gefunden und zwei davon gemietet. Klappte einwandfrei und auch noch zu einem guten Preis!"
          }
        ];
      });

      home.placeChanged = function(place) {
        var location = place.formatted_address || place.name;
        $analytics.eventTrack('search', {  category: 'form', label: location, value: 8 });
        $state.go('search', {location: location});
      };

      home.onSearchClick = function() {
        $state.go('search', {location: home.location});
      };

      home.cityAnalytics = function(city) {
        $analytics.eventTrack('ViewContent', {  category: 'City Page', label: city});
      };
    }
  ]
});
