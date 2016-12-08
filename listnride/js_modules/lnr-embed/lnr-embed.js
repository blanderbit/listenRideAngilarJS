(function () {

  var scr_lnr = document.createElement("SCRIPT");
  scr_lnr.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js';
  scr_lnr.type = 'text/javascript';

  var css_lnr = document.createElement("LINK");
  css_lnr.href = "/Users/aurangzaib/Documents/Projects/listnride/listnride-frontend/listnride/js_modules/lnr-embed/lnr-embed.css";
  css_lnr.rel = "stylesheet";

  var css_mdl = document.createElement("LINK");
  css_mdl.href = "https://code.getmdl.io/1.2.1/material.blue_grey-blue.min.css";
  css_mdl.rel = "stylesheet";

  var head = document.getElementsByTagName("head")[0];
  head.appendChild(css_mdl);
  head.appendChild(css_lnr);
  head.appendChild(scr_lnr);

  var renderBikes = function (callback) {
    if (window.jQuery) {
      callback(jQuery);
    } else {
      window.setTimeout(function () {
        renderBikes(callback);
      }, 100);
    }
  };

  renderBikes(function ($) {
    $(function () {
      var id_lnr = $("#listnride");
      var user_id = document.getElementById('listnride').dataset.user;
      id_lnr.append('<div class="mdl-grid" id="lnr-grid"></div>');
      var grid = $("#lnr-grid");
      $.get("https://listnride-staging.herokuapp.com/v2/users/" + user_id, function (response) {
        response.rides.forEach(function (ride) {
          
          var imageUrl = ride.image_file_1.image_file_1.small.url;
          var rideId = ride.id;
          var brand = ride.brand;
          var category = ride.category;
          var price = ride.price_daily;
          
          grid.append(
            '<div class="mdl-cell mdl-cell--4-col mdl-cell--middle">' +
            '<bike-card class="flex-gt-xs-50 flex-gt-sm-33 flex-100">' +
            '<md-card class="lnr-bike-card _md">' +
            '<a target="_blank" href="http://www.listnride.com/bikes/' + rideId  + '"><img src="' + imageUrl + '"></img></a>' +
            '<md-card-title layout="row" class="layout-row">' +
            '<md-card-title-text class="lnr-margin-left layout-align-space-around-start layout-column">' +
            '<span class="md-subhead">' + brand + '</span>' +
            '<span>' + category + '</span>' +
            '</md-card-title-text>' +
            '<div layout="column" class="layout-align-space-around-center layout-column">' +
            '<span class="md-headline">' + price + ' &euro;</span>' +
            '<span>per day</span>' +
            ' </div>' +
            '</md-card-title>' +
            '</md-card>' +
            '</bike-card>' +
            '</div>'
          );
        });
      });
    });
  });
})();