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

  var fonts_mdl = document.createElement("LINK");
  fonts_mdl.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
  fonts_mdl.rel = "stylesheet";

  var head = document.getElementsByTagName("head")[0];
  head.appendChild(fonts_mdl);
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
      console.log("user id: ", user_id);
      $.get("https://listnride-staging.herokuapp.com/v2/users/" + user_id, function (response) {
        response.rides.forEach(function (ride) {
          
          var imageUrl = ride.image_file_1.image_file_1.small.url;
          var brand = ride.brand;
          var category = ride.category;
          var price = ride.price_daily;
          
          grid.append(
            '<div class="mdl-cell mdl-cell--4-col mdl-cell--middle">' +
            '<bike-card class="flex-gt-xs-50 flex-gt-sm-33 flex-100">' +
            '<md-card class="lnr-bike-card _md" href="https://www.google.com">' +
            '<img class="md-card-image" src="' + imageUrl + '">' +
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
/*

            '<div class="mdl-cell mdl-cell--4-col mdl-cell--middle"><div class="lnr-card-wide mdl-card mdl-shadow--2dp"><div class="mdl-card__media"><img src="' +
            ride.image_file_1.image_file_1.small.url +
            '" width="100%" height="80%"></div><div class="mdl-card__supporting-text lnr-margin-left"><span class="md-subhead">' + ride.brand + '</span>' + 
            ", " + ride.category + "</div></div></div>");
            */