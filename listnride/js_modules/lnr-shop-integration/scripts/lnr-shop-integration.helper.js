/* global lnrConstants: '/listnride/js_modules/lnr-shop-integration/scripts/lnr-shop-integration.constants.js'
*/
"use strict";

var lnrHelper = {
  /**
   * after DOM is rendered the first time
   * runs once before calling user and bike api
   * injects lnr styles
   * @returns {void}
   */
  preInit: function () {
    var cssLnr = document.createElement("LINK");
    // href: local, staging, production
    cssLnr.href = lnrConstants.lnrStyles.production + lnrConstants.version;
    cssLnr.rel = "stylesheet";
    var header = document.getElementsByTagName("head")[0];
    header.appendChild(cssLnr);
  },
  /**
   * runs once the document is loaded
   * single user mode
   * multi user mode
   * @returns {void}
   */
  postInit: function () {
    // get user id and language
    lnrConstants.parentElement = document.getElementById('listnride');
    // initialize for single and multi user mode
    if (lnrConstants.parentElement.dataset.user) {
      lnrHelper.postInitSingleUser();
    } else {
      lnrHelper.postInitMultiUser();
    }
  },
  /**
   * single user mode
   * sets translations
   * renders bikes
   * @returns {void}
   */
  postInitSingleUser: function () {
    var userId = lnrConstants.parentElement.dataset.user;
    var userLang = lnrConstants.parentElement.dataset.lang;
    // remove unicode special chars and tabs
    userLang = lnrHelper.removeUnicode(userLang);
    var selectedLocation = '';
    var selectedSize = '';

    lnrConstants.sizes[userId] = {
      // maintain default version of sizes for each user separately
      default: lnrConstants.defaultRideSizes,
      // maintain availabel sizes for each user separately
      available: {},
      // unshift count, used to add "All" option
      unshifts: 0
    };

    if ("de" === userLang) {
      selectedLocation = lnrConstants.translate.allLocations.de;
      selectedSize = lnrConstants.translate.allSizes.de;
    } else if ('nl' === userLang) {
      selectedLocation = lnrConstants.translate.allLocations.nl;
      selectedSize = lnrConstants.translate.allSizes.nl;
    } else {
      selectedLocation = lnrConstants.translate.allLocations.en;
      selectedSize = lnrConstants.translate.allSizes.en;
    }

    // update location and size for each user
    lnrConstants.translate.allLocations.selected[userId] = selectedLocation;
    lnrConstants.translate.allSizes.selected[userId] = selectedSize;
    // render the bikes for the user
    lnrConstants.isSingleUserMode = true;
    lnrHelper.renderBikes(userId, userLang, false);
  },
  /**
   * multi user mode
   * sets translations
   * renders bikes
   * @returns {void}
   */
  postInitMultiUser: function () {
    var children = lnrConstants.parentElement.getElementsByTagName('div');
    for (var loop = 0; loop < children.length; loop += 1) {
      // if user has a defined user id field
      if (children[loop].dataset.user) {
        var userId = children[loop].dataset.user;
        var userLang = children[loop].dataset.lang;
        // remove unicode special chars and tabs
        userLang = lnrHelper.removeUnicode(userLang);
        var selectedLocation = '';
        var selectedSize = '';

        lnrConstants.sizes[userId] = {
          // maintain default version of sizes for each user separately
          default: lnrConstants.defaultRideSizes,
          // maintain availabel sizes for each user separately
          available: {},
          // unshift count, used to add "All" option
          unshifts: 0
        };

        if ("de" === userLang) {
          selectedLocation = lnrConstants.translate.allLocations.de;
          selectedSize = lnrConstants.translate.allSizes.de;
        } else if ('nl' === userLang) {
          selectedLocation = lnrConstants.translate.allLocations.nl;
          selectedSize = lnrConstants.translate.allSizes.nl;
        } else {
          selectedLocation = lnrConstants.translate.allLocations.en;
          selectedSize = lnrConstants.translate.allSizes.en;
        }

        // update location and size for each user
        lnrConstants.translate.allLocations.selected[userId] = selectedLocation;
        lnrConstants.translate.allSizes.selected[userId] = selectedSize;
        // render the bikes for the user
        lnrConstants.isSingleUserMode = false;
        lnrHelper.renderBikes(userId, userLang, false);
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
   * @param {String} userId user id
   * @returns {String} category name
   */
  openLocationSelector: function (userId) {

    // element id
    var id = userId + '-lnr-location-dropdown';

    // get location dropdown element
    var element = document.getElementById(id);

    // clear element
    element.innerHTML = '';

    // list cities in the dropdown menu
    lnrConstants.cities.forEach(function (city, index) {
      // HTML of the element
      var elementHTML = [
        '<div class="lnr-date-selector" ',
        'onclick="lnrHelper.onLocationSelect(' + index + ', ' + userId + ')"',
        '<span>' + city + '</span></div>'
      ].join('');

      // render element
      element.innerHTML += elementHTML;
    });

    // show the location drop down menu
    element.classList.toggle("show");
  },
  /**
   * open the size dropdown
   * @param {String} userId user id
   * @returns {void}
   */
  openSizeSelector: function (userId) {
    // element id
    var id = userId + '-lnr-size-dropdown';

    // get size dropdown element
    var element = document.getElementById(id);

    // clear element
    element.innerHTML = '';
    // list sizes in the dropdown menu
    lnrConstants.sizes[userId].default.forEach(function (size, index) {
      // either show size or show "All Sizes"
      var condition = index === 0 && lnrConstants.sizes[userId].available.length > 0;
      // id for each of the size options
      var selectorId = id + '-select-' + index;
      // set readable string
      if (size > 0) {
        var readableSize = size + ' cm - ' + parseInt(size + 10) + ' cm';
      } else {
        var readableSize = 'All sizes';
      }

      // HTML of the element
      var elementHTML = [
        '<div class="lnr-date-selector" ',
        'onclick="lnrHelper.onSizeSelect(' + index + ', ' + userId + ')" ',
        'id="' + selectorId + '" ',
        '<span>' + readableSize + '</span></div>'
      ].join('');

      // render element
      element.innerHTML += elementHTML;

      // disable it when size is not available
      if (lnrConstants.sizes[userId].available.includes(size) === false) {
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
   * based on userId and userLang
   * @param {String} userId user id
   * @param {Number} categoryId id of the category
   * @returns {String} category name
   */
  categoryFilter: function (userId, categoryId) {
    // select category based on the user language
    var selectedCategory = "";
    var userLang = lnrConstants.userLang[userId];
    // select sub category based on the user language
    return lnrConstants.subCategory[userLang][categoryId]
  },
  /**
   * show the bikes for the specific city
   * @param {Number} index to be called
   * @param {String} userId user id
   * @returns {void}
   */
  onLocationSelect: function (index, userId) {

    // location button
    var locationButton = document.getElementById(userId + '-lnr-location-button');

    // default user rides for all locations
    var rides = lnrConstants.rides[userId];

    // if there is only single city
    // there is no need for selection
    if (lnrConstants.cities.length === 1) { return; }

    // if there are several language
    // and 'All' is selected
    else if (index === 0) {
      locationButton.innerHTML = lnrConstants.translate.allLocations.selected[userId] + '<div class="dropdown-caret" style="float: right"></div>';
      lnrHelper.renderBikesHTML(userId, rides, null);
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
      lnrHelper.renderBikesHTML(userId, selectedRides, null);
    } else {
      lnrHelper.renderBikesHTML(userId, selectedRides, null);
    }
  },
  /**
   * show the bikes for the specific city
   * @param {Number} index to be called
   * @param {String} userId user id
   * @returns {void}
   */
  onSizeSelect: function (index, userId) {

    // size button
    var sizeButtonId = userId + '-lnr-size-button';
    var sizeButton = document.getElementById(sizeButtonId);

    // default user rides for all sizes
    var rides = lnrConstants.rides[userId];

    // if there is only single available size
    // there is no need for selection
    if (lnrConstants.sizes[userId].available.length === 1) { return; }

    // if there are several language
    // and 'All' is selected
    else if (index === 0) {
      sizeButton.innerHTML = lnrConstants.translate.allSizes.selected[userId] + '<div class="dropdown-caret" style="float: right"></div>';
      lnrHelper.renderBikesHTML(userId, rides, null);
      return;
    }

    // size selected by user from dropdown
    var selectedSize = lnrConstants.sizes[userId].default[index];

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
      lnrHelper.renderBikesHTML(userId, selectedRides, null);
    }
  },
  /*
    only used for demo
    user id and lang can be provided manually
    is_demo_mode flag is provided from template
    not for end user
   */
  setIdAndLanguage: function (userId, userLang, is_demo_mode) {
    if (is_demo_mode === true) {
      lnrConstants.userId[userId] = document.getElementById('user_demo_id').value;
      lnrConstants.userLang[userId] = document.getElementById('user_demo_lang').value;
    } else {
      lnrConstants.userId[userId] = userId;
      if (userLang !== 'de' && userLang !== 'nl') {
        lnrConstants.userLang[userId] = 'en';
      } else {
        lnrConstants.userLang[userId] = userLang;
      }
    }
  },
  initUserElement: function (userId) {
    // grid for the bikes cards
    var element;
    // compatibility mode
    if (lnrConstants.isSingleUserMode === true) {
      element = lnrConstants.parentElement;
      element.innerHTML = '';
    }
    // multi user support
    else {
      element = document.querySelector('[data-user="' + userId + '"]');
      element.innerHTML = '';
      element.id = userId;
    }
  },
  /**
   * renders the bikes
   * based on userId and userLang
   * @param {Number} userId id: of the user for which bikes are to be fetched
   * @param {String} userLang: language of the user. [english, german, dutch]
   * @param {bool} is_demo_mode: user id and language provided from debugging fields
   * @param {bool} isSingleUserMode: support mode for old customer
   * @returns {void}
   */
  renderBikes: function (userId, userLang, is_demo_mode) {

    lnrHelper.setIdAndLanguage(userId, userLang, is_demo_mode);
    // set the environment: staging or production
    var url = (lnrConstants.env === 'staging') ? lnrConstants.users.staging : lnrConstants.users.production;
    // create new instance of xhr
    var request = new XMLHttpRequest();
    var apiUrl = url + lnrConstants.userId[userId];
    request.open('GET', apiUrl, true);
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        // initialize grid for the bikes cards of the user
        lnrHelper.initUserElement(userId);
        // json response from server
        var response = JSON.parse(request.responseText);
        // get cities information from the bikes
        lnrConstants.cities = lnrHelper.getBikeCities(userId, response.rides);
        // get sizes information from the bikes
        lnrConstants.sizes[userId].available = lnrHelper.getBikeSizes(userId, response.rides);
        // save rides in lnrConstants
        lnrConstants.rides[userId] = response.rides;
        // render the locations selector
        // only when user has at least 2  bikes
        if (lnrConstants.rides[userId] && lnrConstants.rides[userId].length > 1) {
          var shouldRenderLocationSelector = lnrConstants.cities.length > 1;
          lnrHelper.renderSelectors(userId, shouldRenderLocationSelector);
        }
        // render bikes html
        lnrHelper.renderBikesHTML(userId, lnrConstants.rides[userId], userLang);
      } else {
        var errorNoUserFound = '<p style="flex:1; text-align:center" class="lnr-margin-left"><br><br>We can\'t find user with this ID</p>';
        lnrHelper.renderHTML(errorNoUserFound);
      }
    };
    // send request to server
    request.send();
  },
  /**
   * HTML of the bikes
   * @param {String} userId user id
   * @param {Object} rides bikes of the user. either city specific or all
   * @param {String} userLang language of the user. [english, german, dutch]
   * @param {Bool} renderBackLink flag should the backlink be re-rendered
   * @returns {void}
   */
  renderBikesHTML: function (userId, rides, userLang) {

    // add bikes grid
    var lnr = lnrConstants.isSingleUserMode ? lnrConstants.parentElement : document.getElementById(userId);
    var gridId = userId + '-lnr-grid';
    var grid = document.getElementById(gridId);

    // check if grid isn't exist on a page
    if (grid === null) {
      lnr.innerHTML += '<div class="mdl-grid mdl-grid--no-spacing" id="' + gridId + '"></div>';
      // get region specific lnr link
      if (userLang) {
        var lnrLink = lnrHelper.getLnrLink(userLang);
        lnr.innerHTML += '<div class="lnr-brand"><span>powered by&nbsp;</span><a href="' + lnrLink + '" target="_blank">listnride</a></div>';
      }
      grid = document.getElementById(gridId);
    }

    // clear bikes grid
    grid.innerHTML = '';

    if (rides.length) {
      var basicInfo = lnrHelper.getBikesBasicInfo(userId);
      rides.forEach(function (ride) {

        // properties for grid creation
        var brand = ride.brand,
          category = ride.category,
          rideName = ride.name,
          rideId = ride.id,
          categoryDesc = lnrHelper.categoryFilter(userId, category),
          price = Math.ceil(ride.price_from),
          imageUrl = ride.image_file,
          rideDescription = ride.description;

        if (ride.size === 0) {
          var readableSize = lnrConstants.translate.allSizes[userLang];
        } else {
          var readableSize = ' ' + ride.size + '-' + parseInt(ride.size + 10) + ' cm';
        }

        // bikes grid html
        // mdl grid => 12 col (desktop), 8 col (tablet), 4 col (phone)
        var gridHTML = [
          '<div class="mdl-cell mdl-cell--4-col mdl-cell--middle">',
          '<bike-card>',
          '<md-card class="lnr-bike-card _md">',
          '<a style="cursor:default" class="image-container lnr-links">',
          '<img src="' + imageUrl + '" />',
          // default: info button
          '<div class="info-button"><button class="info-icon"></button></div>',
          '<div id="rent-element-default-' + rideId + '" class="rent-element">',
          // on hover: info button
          '<div class="info-button">',
          '<button class="info-icon" onclick="lnrHelper.toggleElements(' + rideId + ')"></button>',
          '</div>',
          // on hover: rent button
          '<span class="lnr-content">',
          '<button onclick="lnrHelper.spawnWizard(' + ride.user_id + ', ' + ride.id + ', \'' + userLang + '\')" class="md-button rent-button">' + basicInfo.buttonText + '</button>',
          '</span>',
          '</div>',
          // bike description
          '<div id="rent-element-description-' + rideId + '" class="rent-description" style="display: none">',
          '<div class="rent-description-content">',
          '<span class="close-icon" onclick="lnrHelper.toggleElements(' + rideId + ')"></span>',
          '<div class="md-subhead ride-name">' + rideName + '</div>',
          '<p>' + rideDescription + '</p>',
          '</div>',
          '</div>',
          '</a>',
          '<md-card-title layout="row" class="layout-row">',
          '<md-card-title-text class="layout-align-space-around-start layout-column">' +
          '<span class="md-subhead">' + brand + ', ' + rideName + '</span>',
          '<span>' + categoryDesc + ', ' + readableSize + '</span>' +
          '</md-card-title-text>',
          '<div layout="column" class="layout-align-space-around-center layout-column">',
          '<span style="text-align: center">' + basicInfo.dayText + '</span>',
          '<span class="md-headline">' + price + '&euro;</span>',
          ' </div>',
          '</md-card-title>',
          '</md-card>',
          '</bike-card>',
          '<div class="lnr-brand">',
        ].join('');

        // render bikes grid
        grid.innerHTML += gridHTML;
      });

      // show rent button by default on mobile
      if ('ontouchstart' in document.documentElement) {
        var rentElements = document.getElementsByClassName('rent-element');
        for (var elem = 0; elem < rentElements.length; elem += 1) {
          rentElements[elem].style.display = 'flex';
          rentElements[elem].style.background = 'rgba(0, 0, 0, .4)';
        }
      }
    } else {
      var errorNoBikesText = '<p style="flex:1; text-align:center" class="lnr-margin-left"><br><br>No bikes available</p>';
      lnrHelper.renderHTML(errorNoBikesText);
    }
  },
  renderHTML: function(html) {
    var lnrSection = document.getElementById('listnride');
    lnrSection.innerHTML = '';
    lnrSection.innerHTML = html;
    lnrSection.innerHTML += '<div class="lnr-brand"><span>powered by&nbsp;</span><a href="' + 'https://www.listnride.com' + '" target="_blank">listnride</a></div>';
  },
  /**
   * renders the location and size selectors
   * @param{String} userId user id
   * @param{Boolean} shouldRenderLocationSelector bool based on # of locations
   * @returns {void}
   */
  renderSelectors: function (userId, shouldRenderLocationSelector) {
    var element = lnrConstants.isSingleUserMode ? document.getElementById('listnride') : document.getElementById(userId);
    // HTML for the selectors
    var selectors = lnrHelper.renderSelectorsHTML(userId, shouldRenderLocationSelector);

    // clear element HTML
    element.innerHTML = '';

    // render selectors HTML
    element.innerHTML += selectors;

    // set default values for selectors
    lnrHelper.setDefaultSelectorValues(userId);

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
    var mdlGridOpen = '<div class="mdl-grid mdl-grid--no-spacing" style="margin-top:32px;margin-bottom:32px">';

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
   * @param {String} userId user id
   * @returns {void}
   */
  setDefaultSelectorValues: function (userId) {

    // location button
    var locationButton = document.getElementById(userId + '-lnr-location-button');
    // size button
    var sizeButton = document.getElementById(userId + '-lnr-size-button');
    // show default location
    if (locationButton) {
      var selectedCity = lnrConstants.cities[0];
      var defaultCity = lnrConstants.translate.allLocations.selected[userId];
      var defaultLocation = lnrConstants.cities.length === 1 ? selectedCity : defaultCity;
      locationButton.innerHTML = defaultLocation + '<div class="dropdown-caret" style="float: right"></div>';
    }
    if (sizeButton) {
      var defaultSize = 0;
      if (lnrConstants.sizes[userId].available.length > 1) {
        // select All bikes
        defaultSize = lnrConstants.sizes[userId].available[0];
      } else {
        // select first available size
        defaultSize = lnrConstants.sizes[userId].available[0];
        // if this first available size is '0' translate it to 'All sizes'
        // else add range and cm
        defaultSize = defaultSize === 0 ? lnrConstants.translate.allSizes[userLang] : defaultSize + '-' + parseInt(defaultSize + 10) + ' cm';
      }
      sizeButton.innerHTML = defaultSize + '<div class="dropdown-caret" style="float: right"></div>';
    }
  },
  /**
   * get the misc language dependent bike info
   * includes day text, size text, button text
   * @param {String} userId user id
   * @returns {void}
   */
  getBikesBasicInfo: function (userId) {
    var basicInfo = {};
    if ('en' === lnrConstants.userLang[userId]) {
      basicInfo.dayText = 'from';
      basicInfo.sizeText = 'For';
      basicInfo.buttonText = 'Rent Now';
    } else if ('nl' === lnrConstants.userLang[userId]) {
      basicInfo.dayText = 'van';
      basicInfo.sizeText = 'Voor';
      basicInfo.buttonText = 'Nu huren';
    } else {
      basicInfo.dayText = 'ab';
      basicInfo.sizeText = 'F&uuml;r';
      basicInfo.buttonText = 'Jetzt mieten';
    }
    return basicInfo;
  },
  getLnrLink: function (userLang) {
    if (userLang === 'de') {return "https://www.listnride.de";}
    else if (userLang === 'nl') {return "https://www.listnride.nl";}
    else if (userLang === 'it') {return "https://www.listnride.it";}
    else if (userLang === 'es') {return "https://www.listnride.es";}
    else {return "https://www.listnride.com";}
  },
  /**
   * spawns the shop wizard in a new popup
   * based on userId and bikeId
   * @param {Number} userId id who owns the bike
   * @param {Number} bikeId id of the bike requested
   * @param {String} userLang user browser language
   * @returns {void}
   */
  spawnWizard: function (userId, bikeId, userLang) {
    // check if we support this lang, by default it would be English version
    if (!lnrConstants.shopUrl.production[userLang]) { userLang = 'en' }
    // select shop solution based on the environment
    var url = lnrConstants.env === 'staging' ? lnrConstants.shopUrl.staging[userLang] : lnrConstants.shopUrl.production[userLang];
    // window dimensions, url, parameter, and open type
    var windowObj = lnrHelper.getWindowParams(url, bikeId);
    // open window for selected environment and dimensions
    window.open(windowObj.url, windowObj.type, windowObj.params);
  },
  toggleElements: function (rideId) {
    // default and description elements
    var defaultElem = document.getElementById("rent-element-default-" + rideId);
    var descriptionElem = document.getElementById("rent-element-description-" + rideId);
    // toggle display
    defaultElem.style.display = defaultElem.style.display === 'none' ? '' : 'none';
    descriptionElem.style.display = defaultElem.style.display === 'none' ? 'block' : 'none';
  },
  /**
   * get window configuration for opening the lnr shop solution
   * window dimensions, url, opening type, and window parameter
   * @param {String} url id who owns the bike
   * @param {String} bikeId id of the bike requested
   * @returns {Object} window objects
   */
  getWindowParams: function (url, bikeId) {
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
      url: url + '?bikeId=' + bikeId + "&shop=1",
      // open type
      type: '_blank',
      // window params
      params: 'location=0,menubar=0,resizable=0,scrollbars=yes,titlebar=no,width=' + width + ',height=' + height + ',top=' + top + ',left=' + left
    };
  },
  /**
   * get the unique cities from the user bikes
   * @param {String} userId user id
   * @param {Object} rides bikes of the users
   * @returns {Object} cities List of the unique cities
   */
  getBikeCities: function (userId, rides) {

    // list of cities for a given user's bikes
    var cities = [];

    // unique cities of the bikes
    rides.forEach(function (ride) {
      // try to take city with english translation
      var city = ride.en_city ? ride.en_city : ride.city;
      city = lnrHelper.toSentenceCase(city);
      if (cities.includes(city) === false) {
        cities.push(city);
      }
    });

    // add option as All in the dropdown menu
    // only when more than 1 cities are present
    if (cities.length > 1) { cities.unshift(lnrConstants.translate.allLocations.selected[userId]); }

    return cities;
  },
  /**
   * get the unique sizes from the user bikes
   * @param {String} userId user id
   * @param {Object} rides bikes of the users
   * @returns {Array} sizes List of the unique sizes
   */
  getBikeSizes: function (userId, rides) {
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
      sizes.unshift(lnrConstants.translate.allSizes.selected[userId]);
      // add All option only once
      if (lnrConstants.sizes[userId].unshifts < 1) {
        lnrConstants.sizes[userId].default = [lnrConstants.translate.allSizes.selected[userId]];
        for (var loop = 0; loop < lnrConstants.defaultRideSizes.length; loop += 1) {
          lnrConstants.sizes[userId].default.push(lnrConstants.defaultRideSizes[loop]);
        }
        lnrConstants.sizes[userId].unshifts += 1;
      }
    }

    return sizes;
  },
  /**
   * get the unique cities from the user bikes
   * @param {String} str string with ** any case **
   * @returns {String} str string as ** Sentence case **
   */
  toSentenceCase: function (str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  },
  /**
   * remove unicode symbols and zero width space
   * @param {String} str any string
   * @returns {String} string without unicode and spaces
   */
  removeUnicode: function(str) {
    return str.replace(/&[#\d\w]{3,20};/gm, '') // remove all unicode
      .replace(/\u200B/g, '') // remove zero width space
      .trim(); // remove spaces
  }
};
