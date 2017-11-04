/* global
        lnrHelper
*/
(function () {
  lnrHelper.preInit();
  lnrHelper.fetchBikes(function ($) {
    $(function () {
      lnrHelper.postInit();
    });
  });
})();
