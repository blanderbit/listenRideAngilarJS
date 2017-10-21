/* global
        lnrConstants
        lnrHelper
        $
*/
(function () {
  var css_lnr = document.createElement("LINK");
  css_lnr.href = lnrConstants.lnrStyles;
  css_lnr.rel = "stylesheet";
  var header = document.getElementsByTagName("head")[0];
  header.appendChild(css_lnr);
  lnrHelper.fetchBikes(function ($) {
    $(function () {
      var user_id = document.getElementById('listnride').dataset.user;
      var user_lang = document.getElementById('listnride').dataset.lang;
      lnrHelper.renderBikes(user_id, user_lang);
    });
  });
})();
