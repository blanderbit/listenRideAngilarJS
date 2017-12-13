/* global lnrConstants: '/listnride/js_modules/lnr-shop-integration/scripts/lnr-shop-integration.constants.js'
*/
var lnrHelper = {
  /**
   * after DOM is rendered the first time
   * runs once before calling user and bike api
   * injects lnr styles
   * @returns {void}
   */
  preInit: function () {
    var css_lnr = document.createElement("LINK");
    css_lnr.href = lnrConstants.lnrStyles;
    css_lnr.rel = "stylesheet";
    var header = document.getElementsByTagName("head")[0];
    header.appendChild(css_lnr);
  },
  /**
   * runs once the document is loaded
   * sets translations
   * renders bikes
   * @returns {void}
   */
  postInit: function () {
    // get user id and language
    var parent = document.getElementById('listnride');
    var children = parent.getElementsByTagName('div');
    for (var loop = 0; loop < children.length; loop += 1) {
      // if user has a defined user id field
      if (children[loop].dataset.user) {
        var user_id = children[loop].dataset.user;
        var user_lang = children[loop].dataset.lang;
        var selected_location = '', selected_size = '';

        // maintain default version of sizes for each user separately
        lnrConstants.sizes[user_id] = lnrConstants.sizes.default;

        if ("de" === user_lang) {
          selected_location = lnrConstants.translate.allLocations.de;
          selected_size = lnrConstants.translate.allSizes.de;
        } else if ('nl' === user_lang) {
          selected_location = lnrConstants.translate.allLocations.nl;
          selected_size = lnrConstants.translate.allSizes.nl;
        } else {
          selected_location = lnrConstants.translate.allLocations.en;
          selected_size = lnrConstants.translate.allSizes.en;
        }

        // update location and size for each user
        lnrConstants.translate.allLocations.selected[user_id] = selected_location;
        lnrConstants.translate.allSizes.selected[user_id] = selected_size;
        // render the bikes for the user
        lnrHelper.renderBikes(user_id, user_lang, false);
      }
    }
  },
  /**
   * close the drop-downs for locations
   * @param {String} event fired by browser
   * @returns {void}
   */
  closeDropDown: function (event) {
    if (!event.target.matches('.lnr-dropdown-button')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      for (var loop = 0; loop < dropdowns.length; loop += 1) {
        var selectors = dropdowns[loop];
        if (selectors.classList.contains('show')) {
          selectors.classList.remove('show');
        }
      }
    }
  },
  /**
   * open the location dropdown
   * @param {String} user_id user id
   * @returns {String} category name
   */
  openLocationSelector: function (user_id) {

    // element id
    var id = user_id + '-lnr-location-dropdown';

    // get location dropdown element
    var element = document.getElementById(id);

    // clear element
    element.innerHTML = '';

    // list cities in the dropdown menu
    lnrConstants.cities.forEach(function (city, index) {
      // HTML of the element
      var elementHTML = [
        '<div class="lnr-date-selector" ',
        'onclick="lnrHelper.onLocationSelect(' + index + ', ' + user_id + ')"',
        '<span>' + city + '</span></div>'
      ].join('');

      // render element
      element.innerHTML += elementHTML;
    });

    // show the location drop down menu
    element.classList.toggle("show");
  },
  openSizeSelector: function (user_id) {
    // element id
    var id = user_id + '-lnr-size-dropdown';

    // get size dropdown element
    var element = document.getElementById(id);

    // clear element
    element.innerHTML = '';
    // list cities in the dropdown menu
    lnrConstants.sizes[user_id].forEach(function (size, index) {
      // HTML of the element
      var condition = index === 0 && lnrConstants.sizes.available[user_id].length > 1;
      var selectorId = id + '-select-' + index;
      var elementHTML = [
        '<div class="lnr-date-selector" ',
        'onclick="lnrHelper.onSizeSelect(' + index + ', ' + user_id + ')" ',
        'id="' + selectorId + '" ',
        condition ? '<span>' + size + '</span></div>' : '<span>' + size + ' cm - ' + parseInt(size + 10) + ' cm </span></div>'
      ].join('');

      // render element
      element.innerHTML += elementHTML;

      // disable it when size is not available
      if (lnrConstants.sizes.available[user_id].includes(size) === false) {
        var currentSelector = document.getElementById(id + '-select-' + index);
        for (var key in lnrConstants.disabledButtonCss) {
          if (lnrConstants.disabledButtonCss.hasOwnProperty(key)) {
            currentSelector.style[key] = lnrConstants.disabledButtonCss[key];
          }
        }
      }
    });

    // show the size drop down menu
    element.classList.toggle("show");
  },
  /**
   * select the category name based on the category id received from server side
   * based on user_id and user_lang
   * @param {String} user_id user id
   * @param {Number} categoryId id of the category
   * @returns {String} category name
   */
  categoryFilter: function (user_id, categoryId) {
    // select category based on the user language
    var selectedCategory = "";
    if ('en' === lnrConstants.user_lang[user_id]) selectedCategory = lnrConstants.subCategory.en;
    else if ('nl' === lnrConstants.user_lang[user_id]) selectedCategory = lnrConstants.subCategory.nl;
    else selectedCategory = lnrConstants.subCategory.de;
    // select sub category based on the user language
    switch (categoryId) {
      case 10: return selectedCategory["1"]["dutch-bike"];
      case 11: return selectedCategory["1"]["touring-bike"];
      case 12: return selectedCategory["1"].fixie;
      case 13: return selectedCategory["1"]["single-speed"];

      case 20: return selectedCategory["2"]["road-bike"];
      case 21: return selectedCategory["2"].triathlon;
      case 22: return selectedCategory["2"].indoor;

      case 30: return selectedCategory["3"].tracking;
      case 31: return selectedCategory["3"].enduro;
      case 32: return selectedCategory["3"].freeride;
      case 33: return selectedCategory["3"]["cross-country"];
      case 34: return selectedCategory["3"].downhill;
      case 35: return selectedCategory["3"].cyclocross;

      case 40: return selectedCategory["4"].city;
      case 41: return selectedCategory["4"]["all-terrain"];
      case 42: return selectedCategory["4"].road;

      case 50: return selectedCategory["5"].pedelec;
      case 51: return selectedCategory["5"]["e-bike"];

      case 60: return selectedCategory["6"]["folding-bike"];
      case 61: return selectedCategory["6"].tandem;
      case 62: return selectedCategory["6"].cruiser;
      case 63: return selectedCategory["6"]["cargo-bike"];
      case 64: return selectedCategory["6"].recumbent;
      case 65: return selectedCategory["6"]["mono-bike"];

      default: return "";
    }
  },
  /**
   * show the bikes for the specific city
   * @param {String} user_id user id
   * @param {Number} index to be called
   * @returns {void}
   */
  onLocationSelect: function (index, user_id) {

    // location button
    var locationButton = document.getElementById(user_id + '-lnr-location-button');

    // default user rides for all locations
    var rides = lnrConstants.rides[user_id];

    // if there is only single city
    // there is no need for selection
    if (lnrConstants.cities.length === 1) return;

    // if there are several language
    // and 'All' is selected
    else if (index === 0) {
      lnrHelper.renderBikesHTML(user_id, rides);
      locationButton.innerHTML = lnrConstants.translate.allLocations.selected[user_id] + '<div class="dropdown-caret" style="float: right"></div>';
      return;
    }

    // city selected by user from dropdown
    var selectedCity = lnrConstants.cities[index];

    // bikes for selected city
    var selectedRides = [];

    if (rides.length) {
      // filter bikes for selected city
      for (var loop = 0; loop < rides.length; loop += 1) {
        if (rides[loop] && lnrHelper.toSentenceCase(rides[loop].city) === selectedCity) {
          selectedRides.push(rides[loop]);
        }
      }

      // update the button text
      locationButton.innerHTML = selectedCity + '<div class="dropdown-caret" style="float: right"></div>';

      // render filtered bikes
      lnrHelper.renderBikesHTML(user_id, selectedRides);
    }
  },
  /**
   * show the bikes for the specific city
   * @param {Number} index to be called
   * @param {String} user_id user id
   * @returns {void}
   */
  onSizeSelect: function (index, user_id) {

    // size button
    var sizeButtonId = user_id + '-lnr-size-button';
    var sizeButton = document.getElementById(sizeButtonId);

    // default user rides for all sizes
    var rides = lnrConstants.rides[user_id];

    // if there is only single available size
    // there is no need for selection
    if (lnrConstants.sizes.available[user_id].length === 1) return;

    // if there are several language
    // and 'All' is selected
    else if (index === 0) {
      lnrHelper.renderBikesHTML(user_id, rides);
      sizeButton.innerHTML = lnrConstants.translate.allSizes.selected[user_id] + '<div class="dropdown-caret" style="float: right"></div>';
      return;
    }

    // size selected by user from dropdown
    var selectedSize = lnrConstants.sizes[user_id][index];

    // bikes for selected size
    var selectedRides = [];

    if (rides.length) {
      // filter bikes for selected size
      for (var loop = 0; loop < rides.length; loop += 1) {
        if (rides[loop] && rides[loop].size === selectedSize) {
          selectedRides.push(rides[loop]);
        }
      }

      // update the button text
      var element = [
        index > 0 ? (selectedSize + ' cm - ' + parseInt(selectedSize + 10) + ' cm') : selectedSize,
        '<div class="dropdown-caret" style="float: right"></div>'
      ].join('');
      sizeButton.innerHTML = element;

      // render filtered bikes
      lnrHelper.renderBikesHTML(user_id, selectedRides);
    }
  },
  /*
    only used for demo
    user id and lang can be provided manually
    is_demo_mode flag is provided from template
    not for end user
   */
  getIdAndLanguage: function (user_id, user_lang, is_demo_mode) {
    if (is_demo_mode === true) {
      lnrConstants.user_id[user_id] = document.getElementById('user_demo_id').value;
      lnrConstants.user_lang[user_id] = document.getElementById('user_demo_lang').value;
    } else {
      lnrConstants.user_id[user_id] = user_id;
      if (user_lang !== 'de' && user_lang !== 'nl') {
        lnrConstants.user_lang[user_id] = 'en';
      } else {
        lnrConstants.user_lang[user_id] = user_lang;
      }
    }
  },
  /**
   * renders the bikes
   * based on user_id and user_lang
   * @param {Number} user_id id: of the user for which bikes are to be fetched
   * @param {String} user_lang: language of the user. [english, german, dutch]
   * @param {bool} is_demo_mode: user id and language provided from debugging fields
   * @returns {void}
   */
  renderBikes: function (user_id, user_lang, is_demo_mode) {
    lnrHelper.getIdAndLanguage(user_id, user_lang, is_demo_mode);
    // set the environment: staging or production
    var url = (lnrConstants.env === 'staging') ? lnrConstants.staging_users : lnrConstants.production_users;
    // create new instance of xhr
    var request = new XMLHttpRequest();
    request.open('GET', url + lnrConstants.user_id[user_id], true);
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        // json response from server 
        var response = JSON.parse(request.responseText);
        // grid for the bikes cards
        var element = document.querySelector('[data-user="' + user_id + '"]');
        element.innerHTML = '';
        element.id = user_id;
        // get cities information from the bikes
        lnrConstants.cities = lnrHelper.getBikeCities(user_id, response.rides);
        // get sizes information from the bikes
        lnrConstants.sizes.available[user_id] = lnrHelper.getBikeSizes(user_id, response.rides);
        // save rides in lnrConstants
        lnrConstants.rides[user_id] = response.rides;
        // render the locations selector
        // only when user has at least 2  bikes
        if (lnrConstants.rides[user_id] && lnrConstants.rides[user_id].length > 1) {
          var shouldRenderLocationSelector = lnrConstants.cities.length > 1;
          lnrHelper.renderSelectors(user_id, shouldRenderLocationSelector);
        }
        // render bikes html
        lnrHelper.renderBikesHTML(user_id, lnrConstants.rides[user_id]);
      }
    };
    // send request to server
    request.send();
  },
  /**
   * HTML of the bikes
   * @param {String} user_id user id
   * @param {Object} rides bikes of the user. either city specific or all
   * @returns {void}
   */
  renderBikesHTML: function (user_id, rides) {

    // create grid for the
    var lnr = document.getElementById(user_id);
    var gridId = user_id + '-lnr-grid';
    lnr.innerHTML += '<div class="mdl-grid mdl-grid--no-spacing" id="' + gridId + '"></div>';

    // grid selector
    var grid = document.getElementById(gridId);

    // clear gird template
    grid.innerHTML = '';

    var basicInfo = lnrHelper.getBikesBasicInfo(user_id);
    rides.forEach(function (ride) {
      var brand = ride.brand,
        category = ride.category,
        rideName = ride.name,
        categoryDesc = lnrHelper.categoryFilter(user_id, category),
        price = parseInt(ride.price_from),
        imageUrl = ride.image_file_1.image_file_1.small.url,
        svgUrl = lnrConstants.svgUrlRoot + (category + '').slice(0, 1) + '.svg',
        rideDescription = ride.description.slice(0, 150).concat(' ...');

      var gridHTML = [
        '<div class="mdl-cell mdl-cell--4-col mdl-cell--middle">',
        '<bike-card>',
        '<md-card class="lnr-bike-card _md">',
        '<a target="_blank" class="image-container lnr-links" title="' + ride.description + '" onclick="lnrHelper.spawnWizard(' + ride.user_id + ', ' + ride.id + ')">',
        '<img src="' + imageUrl + '"></img>',
        '<div class="after">',
        '<span class="content"><span class="biketitle">' + rideName + '</span><br><br>' + rideDescription + '<br><br>' +
        '<button class="md-button">' + basicInfo.buttonText + '</button></span>',
        '</div></a>',
        '<md-card-title layout="row" class="layout-row">',
        '<md-icon class="lnr-icn-lrg md-color-foreground" aria-hidden="true">',
        '<img src="' + svgUrl + '" height="48" width="48"></img></md-icon>',
        '<md-card-title-text class="lnr-margin-left layout-align-space-around-start layout-column">' +
        '<span class="md-subhead">' + brand + ', ' + categoryDesc + '</span>',
        '<span>' + basicInfo.sizeText + ' ' + ride.size + ' - ' + parseInt(ride.size + 10) + ' cm</span>' +
        '</md-card-title-text>',
        '<div layout="column" class="layout-align-space-around-center layout-column">',
        '<span style="text-align: center">' + basicInfo.dayText + '</span>',
        '<span class="md-headline">' + price + '&euro;</span>',
        ' </div>',
        '</md-card-title>',
        '</md-card>',
        '</bike-card>',
        '</div>'
      ].join('');
      grid.innerHTML += gridHTML;
    });
  },
  /**
   * renders the location and size selectors
   * @param{String} user_id user id
   * @param{Boolean} shouldRenderLocationSelector bool based on # of locations
   * @returns {void}
   */
  renderSelectors: function (user_id, shouldRenderLocationSelector) {
    var element = document.getElementById(user_id);

    // HTML for the selectors
    var selectors = lnrHelper.renderSelectorsHTML(user_id, shouldRenderLocationSelector);

    // clear element HTML
    element.innerHTML = '';

    // render selectors HTML
    element.innerHTML += selectors;

    // set default values for selectors
    lnrHelper.setDefaultSelectorValues(user_id);

    // close location dropdown on window click
    window.onclick = lnrHelper.closeDropDown;
  },
  /**
   * the HTML for location and size selector dropdown
   * @param {String} id user id
   * @param {Boolean} shouldRenderLocationSelector bool based on # of locations
   * @returns {void}
   */
  renderSelectorsHTML: function (id, shouldRenderLocationSelector) {
    // open mdl grid
    var mdlGridOpen = '<div class="mdl-grid mdl-grid--no-spacing">';

    // render size selector
    var sizeHTML = [
      '<div class="mdl-cell mdl-cell--2-col-desktop mdl-cell--2-col-tablet mdl-cell--2-col-phone lnr-dropdown-parent">',
      '<div style="margin-left:8px; margin-right:8px;">',
      '<button type="button" style="color: black;" ',
      'id="' + id + '-lnr-size-button" ',
      'onclick="lnrHelper.openSizeSelector(' + id + ')" ',
      'class="md-accent md-raised md-button md-ink-ripple lnr-back-button lnr-dropdown-button"></button>',
      '<div id="' + id + '-lnr-size-dropdown" class="dropdown-content" style="float: right"></div>',
      '</div>',
      '</div>'
    ].join("");

    // render location selector
    var locationHTML = [
      '<div class="mdl-cell mdl-cell--2-col-desktop mdl-cell--2-col-tablet mdl-cell--2-col-phone lnr-dropdown-parent">',
      '<div style="margin-left:8px; margin-right:8px;">',
      '<button type="button" style="color: black;" ',
      'id="' + id + '-lnr-location-button" ',
      'onclick="lnrHelper.openLocationSelector(' + id + ')" ',
      'class="md-accent md-raised md-button md-ink-ripple lnr-back-button lnr-dropdown-button"></button>',
      '<div id="' + id + '-lnr-location-dropdown" class="dropdown-content" style="float: right"></div>',
      '</div>',
      '</div>'
    ].join("");

    // close mdl grid
    var mdlGridClose = '</div>';

    // selectors elements
    // in particular order
    var selectors = '';
    selectors += mdlGridOpen;
    selectors += sizeHTML;
    selectors += shouldRenderLocationSelector ? locationHTML : '';
    selectors += mdlGridClose;

    return selectors;
  },
/**
 * set the default values for location and size selectors
 * @param {String} user_id user id
 * @returns {void}
 */
  setDefaultSelectorValues: function (user_id) {

    // location button
    var locationButton = document.getElementById(user_id + '-lnr-location-button');
    // size button
    var sizeButton = document.getElementById(user_id + '-lnr-size-button');
    // show default location
    if (locationButton) {
      var default_location = lnrConstants.cities.length === 1 ? lnrConstants.cities[0] : lnrConstants.translate.allLocations.selected[user_id];
      // locationButton.html(default_location + '<div class="dropdown-caret" style="float: right"></div>');
      locationButton.innerHTML = default_location + '<div class="dropdown-caret" style="float: right"></div>';
    }
    if (sizeButton) {
      var default_size = 0;
      if (lnrConstants.sizes.available[user_id] > 1) {
        default_size = lnrConstants.sizes.available[user_id].length === 1 ? lnrConstants.sizes.available[user_id][0] : lnrConstants.translate.allSizes.selected[user_id];
        sizeButton.innerHTML = default_size + ' cm - ' + parseInt(default_size + 10) + ' cm <div class="dropdown-caret" style="float: right"></div>';
      } else {
        default_size = lnrConstants.sizes.available[user_id][0];
        sizeButton.innerHTML = default_size + '<div class="dropdown-caret" style="float: right"></div>';
      }
    }
  },
  /**
   * get the misc language dependent bike info
   * includes day text, size text, button text
   * @param {String} user_id user id
   * @returns {void}
   */
  getBikesBasicInfo: function (user_id) {
    var basicInfo = {};
    if ('en' === lnrConstants.user_lang[user_id]) {
      basicInfo.dayText = 'from';
      basicInfo.sizeText = 'For';
      basicInfo.buttonText = 'Rent this Bike';
    } else if ('nl' === lnrConstants.user_lang[user_id]) {
      basicInfo.dayText = 'van';
      basicInfo.sizeText = 'Voor';
      basicInfo.buttonText = 'Huur deze fiets';
    } else {
      basicInfo.dayText = 'ab';
      basicInfo.sizeText = 'F&uuml;r';
      basicInfo.buttonText = 'Dieses Rad Mieten';
    }
    return basicInfo;
  },
  /**
   * spawns the shop wizard in a new popup
   * based on userId and bikeId
   * @param {Number} userId id who owns the bike
   * @param {Number} bikeId id of the bike requested
   * @returns {void}
   */
  spawnWizard: function (userId, bikeId) {
    // select shop solution based on the environment
    var url = (lnrConstants.env === 'staging') ? lnrConstants.staging_shop_url : lnrConstants.production_shop_url;
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
  },
  /**
   * get the unique cities from the user bikes
   * @param {String} user_id user id
   * @param {Object} rides bikes of the users
   * @returns {Object} cities List of the unique cities
   */
  getBikeCities: function (user_id, rides) {

    // list of cities for a given user's bikes
    var cities = [];

    // unique cities of the bikes
    rides.forEach(function (ride) {
      var city = lnrHelper.toSentenceCase(ride.city);
      if (cities.includes(city) === false) {
        cities.push(city);
      }
    });

    // add option as All in the dropdown menu
    // only when more than 1 cities are present
    if (cities.length > 1) cities.unshift(lnrConstants.translate.allLocations.selected[user_id]);

    return cities;
  },
  /**
   * get the unique sizes from the user bikes
   * @param {String} user_id user id
   * @param {Object} rides bikes of the users
   * @returns {Array} sizes List of the unique sizes
   */
  getBikeSizes: function (user_id, rides) {

    // list of sizes for a given user's bikes
    var sizes = [];

    // unique sizes for the bikes
    rides.forEach(function (ride) {
      var size = ride.size;
      if (sizes.includes(size) === false) {
        sizes.push(size);
      }
    });

    // add option as All in the dropdown menu
    // only when more than 1 sizes are present
    if (sizes.length > 1) {
      sizes.unshift(lnrConstants.translate.allSizes.selected[user_id]);
      // add All option only once
      if (lnrConstants.sizes.unshifts < 1) {
        lnrConstants.sizes[user_id].unshift(lnrConstants.translate.allSizes.selected[user_id]);
        lnrConstants.sizes.unshifts+=1;
      }
    }

    return sizes;
  },
  /**
   * get the unique cities from the user bikes
   * @param {String} str string with ** any case **
   * @returns {String} str string as ** Sentence case **
   */
  toSentenceCase: function(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
};
