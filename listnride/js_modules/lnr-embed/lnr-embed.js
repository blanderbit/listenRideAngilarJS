(function () {

  var scr_lnr = document.createElement("SCRIPT");
  scr_lnr.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js';
  scr_lnr.type = 'text/javascript';

  var css_lnr = document.createElement("LINK");
  css_lnr.href = "https://s3.eu-central-1.amazonaws.com/listnride-cdn/lnr-embed.min.css";
  css_lnr.rel = "stylesheet";

  var css_mdl = document.createElement("LINK");
  css_mdl.href = "https://code.getmdl.io/1.2.1/material.blue_grey-blue.min.css";
  css_mdl.rel = "stylesheet";

  var header = document.getElementsByTagName("head")[0];
  header.appendChild(css_mdl);
  header.appendChild(css_lnr);
  header.appendChild(scr_lnr);

  /**
   * renders the bikes
   * based on user_id and user_lang
   * @param {any} $ jQuery
   * @param {Number} user_id id of the user for which bikes are to be fetched
   * @param {Number} user_lang language of the user. [english, german, dutch]
   * @param {String} introText
   * @param {any} categoryFilter function which returns the category desc based on category id.
   */
  function renderBikes ($, user_id, user_lang, introText, categoryFilter) {
    $.get("https://api.listnride.com/v2/users/" + user_id, function (response) {

      var selectedLangText, dayText, sizeText;
      if ('en' === user_lang) {
        selectedLangText = introText.en;
        dayText = 'per day';
        sizeText = 'For';
      } else if ('nl' === user_lang) {
        selectedLangText = introText.nl;
        dayText = 'per dag';
        sizeText = 'Voor';
      } else {
        selectedLangText = introText.de;
        dayText = 'pro Tag';
        sizeText = 'F&uuml;r';
      }

      $("#listnride")
        // intro text
        .append('<div class="mdl-grid"><div mdl-cell mdl-cell--4-col><div class="lnr-introtext">' + selectedLangText + '</div></div>')
        // bikes rendering
        .append('<div class="mdl-grid mdl-grid--no-spacing" id="lnr-grid"></div>');

      var rootUrl = 'http://www.listnride.com';
      var grid = $("#lnr-grid");

      response.rides.forEach(function (ride) {
        var rideId = ride.id,
          brand = ride.brand,
          name = ride.name,
          category = ride.category,
          categoryDesc = categoryFilter(category),
          price = parseInt(ride.price_daily),
          imageUrl = ride.image_file_1.image_file_1.small.url,
          svgUrl = rootUrl + '/app/assets/ui_icons/biketype_' + (category + '').slice(0, 1) + '.svg';

        grid.append(
          '<div class="mdl-cell mdl-cell--4-col mdl-cell--middle">' +
          '<bike-card>' +
          '<md-card class="lnr-bike-card _md">' +
          '<a target="_blank" class="lnr-links" href="http://www.listnride.com/bikes/' + rideId + '"><img src="' + imageUrl + '"></img></a>' +
          '<md-card-title layout="row" class="layout-row">' +
          '<md-icon class="lnr-icn-lrg md-color-foreground" aria-hidden="true">'+
          '<img src="' + svgUrl + '" height="48" width="48"></img></md-icon>' +
          '<md-card-title-text class="lnr-margin-left layout-align-space-around-start layout-column">' +
          '<span class="md-subhead">' + brand + ', ' + categoryDesc + '</span>' +
          '<span>' + sizeText + ' ' + ride.size + ' - ' + parseInt(ride.size+10) + ' cm</span>' + 
          '</md-card-title-text>' +
          '<div layout="column" class="layout-align-space-around-center layout-column">' +
          '<span class="md-headline">' + price + '&euro;</span>' +
          '<span>' + dayText + '</span>' +
          ' </div>' +
          '</md-card-title>' +
          '</md-card>' +
          '</bike-card>' +
          '</div>'
        );
      });
    });
  }
  var fetchBikesData = function (callback) {
    if (window.jQuery) {
      callback(jQuery);
    } else {
      window.setTimeout(function () {
        fetchBikesData(callback);
      }, 100);
    }
  };

  fetchBikesData(function ($) {
    $(function () {
      var user_id = document.getElementById('listnride').dataset.user;
      var user_lang = document.getElementById('listnride').dataset.lang;
      var introText = {
        en: 'The bikes below are currently available for you to rent. ' +
        'Simply click on the bike you&rsquo;d like to rent and you will be forwarded to ' +
        '<a target="_blank" href="http://www.listnride.com">www.listnride.com</a>, ' +
        'where you can make the booking online.',
        de: 'Diese Fahrr&auml;der stehen aktuell f&uuml;r den Verleih an Sie zur Verf&uuml;gung. ' +
        'Durch klicken auf das gew&uuml;nschte Fahrrad, werden Sie auf ' +
        '<a target="_blank" href="http://www.listnride.com">www.listnride.com</a> ' +
        'weitergeleitet und k&ouml;nnen dort die Online-Buchung abschlie&szlig;en.',
        nl: 'De onderstaande fietsen bieden wij uw momenteel te huur aan. ' +
        'Indien je de fiets naar wens aanklikt, kom je op de site ' +
        '<a target="_blank" href="http://www.listnride.com">www.listnride.com</a> ' +
        'terecht alwaar je de boeking online kan afronden. '
      };
      function categoryFilter(categoryId) {
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
      }
      renderBikes($, user_id, user_lang, introText, categoryFilter);
    });
  });
})();