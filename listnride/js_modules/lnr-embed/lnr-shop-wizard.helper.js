/** 
 * These are the methods specific for the adoption of the 
 * angular calendar code to plain javascript calendar code
 */
var helper = {
    /**
     * jquery date range picker config object
     */
    calenderConfigObject: {
        alwaysOpen: true,
        container: '#bike-calendar',
        beforeShowDay: classifyDate,
        inline: true,
        selectForward: true,
        showShortcuts: false,
        showTopbar: false,
        singleMonth: true,
        startOfWeek: 'monday'
    },
    /**
     * translation for en, de and nl
     */
    translationsConfigObject: translationsConfigObject,
    /**
     * returns the nested property value
     * @param {object} obj
     * @returns {string} path to the property as a string
     */
    accessProperty: function (obj, path) {
        path = path.split('.');
        for (var loop = 0, length = path.length; loop < length; loop += 1) obj = obj[path[loop]];
        return obj;
    },
    /**
     * returns the translations for the user browser language
     * @param {string} lang
     * @returns {void}
     */
    getTranslations: function (lang) {
        switch (lang) {
            case 'en-US':
                return this.translationsConfigObject.en;
            case 'en-UK':
                return this.translationsConfigObject.en;
            case 'de-DE':
                return this.translationsConfigObject.de;
        }
    },
    /**
     * returns the required paramater from the url
     * @param {void}
     * @returns {this} chaining
     */
    applyTranslations: function () {
        // apply translations (en, de, nl)
        // get elements with 'translate' attribute
        // and get attribute value
        // apply text from translation object 
        translations = helper.getTranslations(navigator.language);
        $("[translate]").each(function () {
            var element = $(this),
                path = element.attr("translate");
            element.text(helper.accessProperty(translations, path));
        });
        return this;
    },
    /**
     * returns the required paramater from the url
     * @param {string} sParam
     * @returns {string} param
     */
    getUrlParameter: function (sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    },

    /**
     * used to change the tabs in the wizard
     * @param {Element} element
     * @returns {void}
     */
    changeTab: function (element) {
        document.getElementById(element.id).click(); // Click on the checkbox
    },

    /**
     * used to open the date (from/to) dropdowns for calendar 
     * @param {Number} id
     * @param {string} type
     * @returns {void}
     */
    openCalendarDropDown: function (id, type) {

        var startId = 'lnr-date-from-dropdown';
        var endId = 'lnr-date-to-dropdown';

        var element = $('#' + id);
        element.html('');
        for (var index = 0; index < 17; index += 1) {
            element.append(
                '<div class="lnr-date-selector" onclick="helper.onTimeValueSelect(' +
                parseInt(index + 6) + ', ' + type + ')" + id="lnr-date-from-select-"' +
                index + '>' + (index + 6) + ":00" +
                calendar.availabilityMessage(index, calendar.endDate) + '</div>'
            );
        }

        // at a time only 1 dropdown should be shown
        if (id === startId) {
            $('#' + endId).removeClass("show");
            element.toggleClass("show");
        } else if (id === endId) {
            $('#' + startId).removeClass("show");
            element.toggleClass("show");
        }
    },

    /**
     * used to open the date (from/to) dropdowns for expiration in payment 
     * @param {Number} id
     * @param {string} type
     * @returns {void}
     */
    openExpirationDropdown: function (id, type) {
        var dateId = 'lnr-payment-date-dropdown';
        var yearId = 'lnr-payment-year-dropdown';
        var element = $('#' + id);
        element.html('');
        if ('\'date\'' == type) {
            for (var index = 1; index <= 12; index += 1) {
                element.append(
                    '<div class="lnr-date-selector" onclick="helper.onExpirationValueSelect(' + index + ',' + type + ')">' +
                    parseInt(index) + '</div>'
                );
            }
        } else if ('\'year\'' == type) {
            var currentYear = (new Date()).getFullYear();
            for (var index = currentYear; index <= (currentYear + 10); index += 1) {
                element.append(
                    '<div class="lnr-date-selector" onclick="helper.onExpirationValueSelect(' + index + ',' + type + ')">' +
                    parseInt(index) + '</div>'
                );
            }
        }

        // at a time only 1 dropdown should be shown
        if (id === dateId) {
            $('#' + yearId).removeClass("show");
            element.toggleClass("show");
        } else if (id === yearId) {
            $('#' + dateId).removeClass("show");
            element.toggleClass("show");
        }
    },

    /**
     * called when user selects time from time range dropdown (from/to)
     * @param {Number} index
     * @param {string} slot
     * @returns {void}
     */
    onTimeValueSelect: function (index, slot) {
        var slotTime = slot + "Time";
        calendar[slotTime] = index;
        calendar.onTimeChange(slot);
        updateTimeRangeText();
    },

    onExpirationValueSelect: function (value, slot) {
        payment[slot] = parseInt(value);
        updatePaymentExpirationText();
    },

    /**
     * show credit card form
     * @param {Number} id
     * @param {string} type
     * @returns {void}
     */
    showCreditCardForm: function () {
        // hide the payment credit card form
        $('#sp-payment-form').show();
    },

    renderRentalInfo: function () {
        var rentalInfo = $('rental-info');

        var rentalInfoHTML =
            '<div class="mdl-cell mdl-cell--5-col mdl-cell--3-col-tablet mdl-cell--4-col-phone">' +
            '<div class="lnr-tab-content">' +
            '<p class="md-subhead-sm">Rent details</p>' +
            '<ul class="lnr-list-sm mdl-list">' +
            '<li class="mdl-list__item">' +
            '<span style="flex: 50;" class="mdl-list__item-primary-content md-list-compact md-subhead-sm" translate="rental.duration"></span>' +
            '<span align="right" class="mdl-list__item-primary-content md-list-compact md-subhead-sm" id="lnr-calendar-duration">0 day, 0 hours</span>' +
            '</li>' +
            '<lnr-vertical-divider></lnr-vertical-divider>' +
            '<li class="mdl-list__item">' +
            '<span style="flex: 50;" class="mdl-list__item-primary-content md-subhead-sm" translate="rental.subtotal"></span>' +
            '<span align="right" class="mdl-list__item-primary-content md-subhead-sm" id="lnr-calendar-subtotal">0 &euro;</span>' +
            '</li>' +
            '<li class="mdl-list__item">' +
            '<span style="flex: 50;" class="mdl-list__item-primary-content md-subhead-sm" translate="rental.fee"></span>' +
            '<span align="right" class="mdl-list__item-primary-content md-subhead-sm" id="lnr-calendar-fee">0 &euro;</span>' +
            '</li>' +
            '<li class="mdl-list__item">' +
            '<span style="flex: 50;" class="mdl-list__item-primary-content md-subhead-sm" translate="rental.total"></span>' +
            '<span align="right" class="mdl-list__item-primary-content md-subhead-sm" id="lnr-calendar-total">0 &euro;</span>' +
            ' </li>' +
            '  </ul>' +
            '</div>' +
            '</div>'

        rentalInfo.replaceWith(rentalInfoHTML);
        return this;
    },

    renderNavButtons: function () {
        var navButtons = $('nav-buttons');

        // iterate each button for different tabs
        navButtons.each(function () {
            var element = $(this);
            var back = element.attr('back'),
                next = element.attr('next'),
                backText = element.attr('back-text'),
                nextText = element.attr('next-text');

            // open the grid
            var navButtonHTML =
                '<div class="mdl-grid">' +
                '<div class="mdl-cell mdl-cell--6-col mdl-cell--4-col-tablet mdl-cell--2-col-phone wizard-nav-button">';

            // back button
            if (back) {
                navButtonHTML = navButtonHTML
                    .concat('<button id="lnr-back-button" onclick="helper.changeTab({id: ' + back + '})"')
                    .concat('class="md-accent md-raised md-button md-ink-ripple"><span translate="' + backText + '"></span></button></div>');
            } else {
                navButtonHTML = navButtonHTML.concat('</div>');
            }

            navButtonHTML = navButtonHTML
                .concat('<div align="right" class="mdl-cell mdl-cell--6-col mdl-cell--4-col-tablet mdl-cell--2-col-phone wizard-nav-button">');

            // next button
            if (next) {
                navButtonHTML = navButtonHTML
                    .concat('<button onclick="helper.changeTab({id: ' + next + '})" class="md-accent md-raised md-button md-ink-ripple"><span translate="')
                    .concat(nextText + '"></span></button></div>');
            } else {
                navButtonHTML = navButtonHTML.concat('</div>');
            }

            // close the grid
            navButtonHTML = navButtonHTML.concat('</div>');

            // render html for each navigation
            element.replaceWith(navButtonHTML);
        });
        return this;
    },

    preInit: function () {
        // close the drop down for the date time selector in calendar
        window.onclick = closeDropDown;
        // disable initially the time selector
        $('.dropdown-calendar *').attr("disabled", "disabled").off('click');
        // hide the payment credit card form
        $('#sp-payment-form').hide();
        // render rentals, navigation and apply translation
        helper
            .renderRentalInfo()
            .renderNavButtons()
            .applyTranslations();
    },

    /**
     * initialize calendar, payment, date range
     * @returns {void}
     */
    postInit: function () {
        initOverview();
        $('#bike-calendar-loader').remove();
        initCalendarPicker();
        updateTimeRangeText();
        updatePaymentExpirationText();
    }
};