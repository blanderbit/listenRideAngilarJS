(function () {

  var scr_lnr = document.createElement("SCRIPT");
  scr_lnr.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js';
  scr_lnr.type = 'text/javascript';

  var css_lnr = document.createElement("LINK");
  css_lnr.href = "https://listnride-frontend-staging.herokuapp.com/lnr-embed.min.css";
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
      var categoryFilter = function (categoryId) {
        switch (categoryId) {
          case 10: return "Holland";
          case 11: return "Touring";
          case 13: return "Single Speed";
          case 20: return "Roadbike";
          case 21: return "Triathlon";
          case 22: return "Indoor";
          case 30: return "Trecking";
          case 31: return "Enduro";
          case 32: return "Freeride";
          case 33: return "Cross Country";
          case 34: return "Downhill";
          case 35: return "Cyclocross";
          case 40: return "Children City";
          case 41: return "Children Allterrain";
          case 42: return "Children Road";
          case 50: return "Pedelec";
          case 51: return "E-Bike";
          case 60: return "Folding";
          case 61: return "Tandem";
          case 62: return "Cruiser";
          case 63: return "Cargo";
          case 64: return "Recumbent";
          case 65: return "Mono";
          default: return "";
        }
      };
      var id_lnr = $("#listnride");
      var user_id = document.getElementById('listnride').dataset.user;
      var rootUrl = 'http://www.listnride.com';
      
      id_lnr.append('<div class="mdl-grid" id="lnr-grid"></div>');
      
      var grid = $("#lnr-grid");
      
      $.get("https://listnride-staging.herokuapp.com/v2/users/" + user_id, function (response) {
        response.rides.forEach(function (ride) {

          var rideId = ride.id,
            brand = ride.brand,
            name = ride.name,
            category = ride.category,
            categoryDesc = categoryFilter(category),
            price = ride.price_daily,
            imageUrl = ride.image_file_1.image_file_1.small.url,
            svgUrl = rootUrl + '/app/assets/ui_icons/biketype_' + (category + '').slice(0, 1) + '.svg';

          grid.append(
            '<div class="mdl-cell mdl-cell--4-col mdl-cell--middle">' +
            '<bike-card class="flex-gt-xs-50 flex-gt-sm-33 flex-100">' +
            '<md-card class="lnr-bike-card _md">' +
            '<a target="_blank" href="http://www.listnride.com/bikes/' + rideId + '"><img src="' + imageUrl + '"></img></a>' +
            '<md-card-title layout="row" class="layout-row">' +
            '<md-icon class="lnr-icn-lrg md-color-foreground" aria-hidden="true"><img src="' + svgUrl + '" height="48" width="48"></img></md-icon>' +
            '<md-card-title-text class="lnr-margin-left layout-align-space-around-start layout-column">' +
            '<span class="md-subhead">' + brand + ', ' + categoryDesc + '</span>' +
            '<span>' + name + '</span>' +
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