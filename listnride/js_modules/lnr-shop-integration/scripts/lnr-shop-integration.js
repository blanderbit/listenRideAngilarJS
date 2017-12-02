/* global
        lnrHelper: '/listnride/js_modules/lnr-shop-integration/scripts/lnr-shop-integration.js'
*/
(function () {
  /*
  lnrHelper.preInit();
  lnrHelper.fetchBikes(function ($) {
    $(function () {
      lnrHelper.postInit();
    });
  });
  */
  lnrHelper.preInit();
  window.onload = lnrHelper.fetchBikes;
})();
