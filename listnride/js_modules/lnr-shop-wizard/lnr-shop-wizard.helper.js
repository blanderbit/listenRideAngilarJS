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
     * removes calendar busy loader once calendar is loaded
     * @param {void}
     * @returns {this} allow chaining
     */
    removeCalendarBusyLoader: function () {
        $('#bike-calendar-loader').remove();
        return this;
    },
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
    getTranslations: function () {
        var lang = navigator.language.split('-')[0].toLowerCase();
        switch (lang) {
            case 'en':
                translations = this.translationsConfigObject.en;
                break;
            case 'de':
                translations = this.translationsConfigObject.de;
                break;
        }

        return this;
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
        $("[translate]").each(function () {
            var element = $(this),
                path = element.attr("translate");

            element.html(helper.accessProperty(translations, path));
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
     * used to go to the next tab
     * @param {Element} element
     * @returns {void}
     */
    nextTab: function (element) {
        switch (element.id) {
            case 'tab-basic-info': helper.changeTab(element); break;
            case 'tab-payment-details': signup(function() {helper.changeTab(element)}); break;
            case 'tab-booking-overview': break;
            case 'tab-duration': helper.changeTab(element); break;
        }

        // document.getElementById(element.id).click();
    },

    // Virtually click on the actual tab, used to change to a certain tab
    changeTab: function (element) {
        document.getElementById(element.id).click();
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
                index + '><span>' + (index + 6) + ":00" +
                calendar.availabilityMessage(index, calendar.endDate) + '</span></div>'
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
            '<ul class="lnr-list-sm mdl-list">' +
            '<li class="mdl-list__item">' +
            '<span style="flex: 50;" class="mdl-list__item-primary-content md-list-compact md-subhead-sm" translate="rental.duration"></span>' +
            '<span align="right" class="mdl-list__item-primary-content md-list-compact md-subhead-sm" id="lnr-calendar-duration">0 ' +
            translations.rental.day + ', 0 ' + translations.rental.hour + '</span>' +
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
            '</li>' +
            '</ul>'

        rentalInfo.replaceWith(rentalInfoHTML);
        return this;
    },

    renderNavButtons: function () {
        var navButtons = $('nav-buttons');

        // iterate each button for different tabs
        navButtons.each(function () {
            var element = $(this);
            var currentTab = element.attr('current-tab'),
                backTab = element.attr('back-tab'),
                nextTab = element.attr('next-tab'),
                backText = element.attr('back-text'),
                nextText = element.attr('next-text');

            // open the grid
            var navButtonHTML =
                '<div class="lnr-button-bar mdl-grid">' +
                '<div class="lnr-button-cell mdl-cell mdl-cell--6-col mdl-cell--4-col-tablet mdl-cell--2-col-phone wizard-nav-button">';

            // back button
            if (backTab) {
                navButtonHTML = navButtonHTML
                    .concat('<button id="lnr-back-button-' + currentTab + '" onclick="helper.changeTab({id: ' + backTab + '})"')
                    .concat('class="md-accent md-raised md-button md-ink-ripple lnr-back-button"><span translate="' + backText + '"></span></button></div>');
            } else {
                navButtonHTML = navButtonHTML.concat('</div>');
            }

            navButtonHTML = navButtonHTML
                .concat('<div class="mdl-layout-spacer"></div><div align="right" class="lnr-button-cell mdl-cell mdl-cell--6-col mdl-cell--4-col-tablet mdl-cell--2-col-phone wizard-nav-button">');

            // next button
            if (nextTab) {
                navButtonHTML = navButtonHTML
                    .concat('<button id="lnr-next-button-' + currentTab + '" onclick="helper.nextTab({id: ' + nextTab + '})" class="md-accent md-raised md-button md-ink-ripple"><span translate="')
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
        $('.info-title').hide();
        $('.info-error').hide();
        $('.payment-error').hide();
        $('#form_email_repeat').on('paste', function (e) {
            e.preventDefault();
        });
        // Connect the first_name input with the info description title
        $('#form_first_name').keyup(function () {
            var input = $('#form_first_name').val();
            if (input) {
                $('.info-title-empty').hide();
                $('.info-title').show();
                $('.first-name-text').text(input + ",");
            } else {
                $('.info-title').hide();
                $('.info-title-empty').show();
                $('.first-name-text').text(input);
            }
        });
        // render rentals, navigation and apply translation
        helper
            .getTranslations()
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
        helper.removeCalendarBusyLoader();
        initCalendarPicker();
        updateTimeRangeText();
        updatePaymentExpirationText();
    }
};

/*--------------- API ACTIONS ---------------*/

function signup(nextTab) {

    if (user.id == null) {
        var data = {
            'user': {
                'first_name': $('#form_first_name').val(),
                'last_name': $('#form_last_name').val(),
                'email': $('#form_email').val()
            }
        };
    
        console.log(data);
    
        $.post({
            url: apiUrl + "/users",
            data: data,
            success: function(response) {
                console.log(response);
                $('.info-description').show();
                $('.info-error').hide();
                user.id = response.id;
                console.log(user.id);
                nextTab();
            },
            error: function(response) {
                $('.info-description').hide();
                $('.info-error').show();
            }
        });
    } else {
        nextTab();
    }
}


/*--------------------------------------------*/
