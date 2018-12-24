'use strict';

angular.module('home',[]).component('home', {
  templateUrl: 'app/modules/home/home.template.html',
  controllerAs: 'home',
  controller: [ '$state', '$stateParams', '$translate', '$localStorage', '$mdMedia',
    '$mdDialog', 'verification', 'authentication', 'api', 'ngMeta', 'loadingDialog',
    function HomeController($state, $stateParams, $translate, $localStorage, $mdMedia,
      $mdDialog, verification, authentication, api, ngMeta) {

      var home = this;

      switch ($state.current.name) {
        case 'verify':
          if (authentication.loggedIn()) {
            verification.openDialog(false, false, window.event);
          }
          break;
        case 'businessSignup':
          authentication.showSignupDialog(false, false, window.event, true);
          break;
        case 'confirm':
          $mdDialog.show({
            templateUrl: 'app/modules/shared/dialogs/spinner.template.html',
            parent: angular.element(document.body),
            targetEvent: window.event,
            openFrom: angular.element(document.body),
            closeTo: angular.element(document.body),
            clickOutsideToClose: false,
            escapeToClose: false
          });

          var data = {
            confirmation: {
              user_id: $stateParams.userId,
              email_confirmation_token: $stateParams.confirmationCode
            }
          };

          api.post('/confirm_email', data).then(
            function (success) {
              $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.body))
                .clickOutsideToClose(true)
                .title('Confirmation successful')
                .textContent('Great, you\'ve successfully confirmed your email address!')
                .ariaLabel('Confirmation Successful')
                .ok('Ok')
              );
            },
            function (error) {
              $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.body))
                .clickOutsideToClose(true)
                .title('Confirmation successful')
                .textContent('Great, you\'ve successfully confirmed your email address!')
                .ariaLabel('Confirmation Successful')
                .ok('Ok')
              );
            }
          );
         break;

        case 'reset-password':
          // TODO: check reset token
          // on success ->
          $mdDialog.show({
            templateUrl: 'app/modules/shared/dialogs/spinner.template.html',
            parent: angular.element(document.body),
            targetEvent: window.event,
            openFrom: angular.element(document.body),
            closeTo: angular.element(document.body),
            clickOutsideToClose: false,
            escapeToClose: false
          });

          break;

        default:
          break;
      }


      // Pick a random hero shot and select
      function pickRandomHeroshot() {
        var isMobile = !!($mdMedia('xs') || $mdMedia('sm'))
        var heroShotId = Math.floor(Math.random() * Math.floor(4)) + 1;
        var pictureName = isMobile ? "lnr_hero_small_" : "lnr_hero_";

        home.heroShotUrl = "app/assets/ui_images/hero/" + pictureName + heroShotId + ".jpg";
      }
      pickRandomHeroshot();

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
        $state.go('search', {location: location});
      };

      home.onSearchClick = function() {
        $state.go('search', {location: home.location});
      };

      home.newsletterSubmit = function() {
      }
    }
  ]
});
