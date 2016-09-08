'use strict';

angular.
module('footer').
component('footer', {
  templateUrl: 'footer/footer.template.html',
  controllerAs: 'footer',
  controller: function FooterController($translate) {
    var footer = this;
    footer.language = 'en';

    footer.switchLanguage = function switchLanguage() {
      $translate.use(footer.language);
    }
  }
});