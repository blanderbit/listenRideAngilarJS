/* global
        lnrConstants
        lnrJquery
        $
*/
var lnrHelper = {
  /**
   * wrapper for fetching bikes after 100ms
   * @param {callback} callback to be called
   * @returns {void}
   */
  fetchBikes: function (callback) {
    if (window.lnrJquery) {
      return callback(lnrJquery);
    } else {
      window.setTimeout(function () {
        lnrHelper.fetchBikes(callback);
      }, 100);
    }
  },
  /**
   * select the category name based on the category id received from server side
   * based on user_id and user_lang
   * @param {Number} categoryId id of the category
   * @param {String} user_lang language of the user. [english, german, dutch]
   * @returns {String} category name
   */
  categoryFilter: function (categoryId, user_lang) {
    // select category based on the user language
    var selectedCategory = "";
    if ('en' === user_lang) selectedCategory = lnrConstants.subCategory.en;
    else if ('nl' === user_lang) selectedCategory = lnrConstants.subCategory.nl;
    else selectedCategory = lnrConstants.subCategory.de;
    // select sub category based on the user language
    switch (categoryId) {
      case 10: return selectedCategory["1"]["dutch-bike"];
      case 11: return selectedCategory["1"]["touring-bike"];
      case 12: return selectedCategory["1"]["fixie"];
      case 13: return selectedCategory["1"]["single-speed"];

      case 20: return selectedCategory["2"]["road-bike"];
      case 21: return selectedCategory["2"]["triathlon"];
      case 22: return selectedCategory["2"]["indoor"];

      case 30: return selectedCategory["3"]["tracking"];
      case 31: return selectedCategory["3"]["enduro"];
      case 32: return selectedCategory["3"]["freeride"];
      case 33: return selectedCategory["3"]["cross-country"];
      case 34: return selectedCategory["3"]["downhill"];
      case 35: return selectedCategory["3"]["cyclocross"];

      case 40: return selectedCategory["4"]["city"];
      case 41: return selectedCategory["4"]["all-terrain"];
      case 42: return selectedCategory["4"]["road"];

      case 50: return selectedCategory["5"]["pedelec"];
      case 51: return selectedCategory["5"]["e-bike"];

      case 60: return selectedCategory["6"]["folding-bike"];
      case 61: return selectedCategory["6"]["tandem"];
      case 62: return selectedCategory["6"]["cruiser"];
      case 63: return selectedCategory["6"]["cargo-bike"];
      case 64: return selectedCategory["6"]["recumbent"];
      case 65: return selectedCategory["6"]["mono-bike"];

      default: return "";
    }
  },
  /**
   * renders the bikes
   * based on user_id and user_lang
   * @param {Number} user_id id of the user for which bikes are to be fetched
   * @param {Number} user_lang language of the user. [english, german, dutch]
   * @param {Bool} is_demo_mode are user id and language provided from debugging fields
   * @returns {void}
   */
  renderBikes: function (user_id, user_lang, is_demo_mode) {
    var $ = lnrJquery;
    var url = "";
    // only used for demo
    // user id and lang can be provided manually
    // is_demo_mode flag is provided from template
    // not for end user
    if (is_demo_mode === true) {
      user_id = $('#user_demo_id').val();
      user_lang = $('#user_demo_lang').val();
    }
    lnrConstants.env == "staging" ? url = lnrConstants.staging_users : url = lnrConstants.production_users;
    $.get(url + user_id, function (response) {

      var dayText, sizeText, buttonText;
      if ('en' === user_lang) {
        dayText = 'from';
        sizeText = 'For';
        buttonText = 'Rent this Bike';
      } else if ('nl' === user_lang) {
        dayText = 'van';
        sizeText = 'Voor';
        buttonText = 'Huur deze fiets';
      } else {
        dayText = 'ab';
        sizeText = 'F&uuml;r';
        buttonText = 'Dieses Rad Mieten';
      }
      // grid for the bikes cards
      $('#listnride').html('');
      $("#listnride").append('<div class="mdl-grid mdl-grid--no-spacing" id="lnr-grid"></div>');

      // grid selector
      var grid = $("#lnr-grid");
      // populate grid with the bikes data
      response.rides.forEach(function (ride) {
        var brand = ride.brand,
          category = ride.category,
          rideName = ride.name,
          categoryDesc = lnrHelper.categoryFilter(category, user_lang),
          price = parseInt(ride.price_from),
          imageUrl = ride.image_file_1.image_file_1.small.url,
          svgUrl = lnrConstants.svgUrlRoot + (category + '').slice(0, 1) + '.svg',
          rideDescription = ride.description.slice(0, 150).concat(' ...');
        grid.append(
          '<div class="mdl-cell mdl-cell--4-col mdl-cell--middle">' +
          '<bike-card>' +
          '<md-card class="lnr-bike-card _md">' +
          '<a target="_blank" class="image-container lnr-links" title="' + ride.description + '" onclick="lnrHelper.spawnWizard(' + ride.user_id + ', ' + ride.id + ')">' +
          '<img src="' + imageUrl + '"></img>' +
          '<div class="after">' +
          '<span class="content"><span class="biketitle">' + rideName + '</span><br><br>' + rideDescription + '<br><br>' +
          '<button class="md-button">' + buttonText + '</button></span>' +
          '</div></a>' +
          '<md-card-title layout="row" class="layout-row">' +
          '<md-icon class="lnr-icn-lrg md-color-foreground" aria-hidden="true">' +
          '<img src="' + svgUrl + '" height="48" width="48"></img></md-icon>' +
          '<md-card-title-text class="lnr-margin-left layout-align-space-around-start layout-column">' +
          '<span class="md-subhead">' + brand + ', ' + categoryDesc + '</span>' +
          '<span>' + sizeText + ' ' + ride.size + ' - ' + parseInt(ride.size + 10) + ' cm</span>' +
          '</md-card-title-text>' +
          '<div layout="column" class="layout-align-space-around-center layout-column">' +
          '<span style="text-align: center">' + dayText + '</span>' +
          '<span class="md-headline">' + price + '&euro;</span>' +
          ' </div>' +
          '</md-card-title>' +
          '</md-card>' +
          '</bike-card>' +
          '</div>'
        );
      });
    });
  },
  /**
   * spawns the shop wizard in a new popup
   * based on userId and bikeId
   * @param {Number} userId id who owns the bike
   * @param {Number} bikeId id of the bike requested
   * @returns {void}
   */
  spawnWizard: function (userId, bikeId) {
    var url = "";
    // select shop solution based on the environment
    (lnrConstants.env == "staging") ? (url = lnrConstants.staging_shop_solution) : (url = lnrConstants.production_shop_solution);
    // window dimensions, url, parameter, and open type
    var windowObj = lnrHelper.getWindowParams(url, userId, bikeId);
    // open window for selected environment and dimensions
    window.open(windowObj.url, windowObj.type, windowObj.params);
  },
  /**
   * get window configuration for opening the lnr shop solution
   * window dimensions, url, opening type, and window parameter
   * @param {String} url id who owns the bike
   * @param {String} userId id of the bike requested
   * @param {String} bikeId id of the bike requested
   * @returns {Object} window objects
   */
  getWindowParams: function (url, userId, bikeId) {
    // dimensions
    var width = 650,
      height = 700,
      left = (screen.width / 2) - (width / 2),
      top = (screen.height / 2) - (height / 2);

      return {
          // dimensions
          width: width,
          height: height,
          left: left,
          top: top,
          //window url
          url: url + '?user_id=' + userId + '&ride_id=' + bikeId,
          // open type
          type: '_blank',
          // window params
          params: 'location=0,menubar=0,resizable=0,scrollbars=yes,titlebar=no,width=' + width + ',height=' + height + ',top=' + top + ',left=' + left
    };
  }
};
