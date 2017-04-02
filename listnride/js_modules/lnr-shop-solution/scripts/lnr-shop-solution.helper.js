/* global 
        calendar 
        translationsConfigObject 
        translations 
        api 
        payment 
        $
*/
/*eslint no-undef: "error"*/
/*eslint no-native-reassign: "error"*/

/** 
 * methods which binds the whole shop solution together
 * contains main logic of the shop solution
 * also utilizes : [calendar, translates, date, validation, api] services
 */
var helper = {
    /**
     * jquery date range picker config object
     */
    calenderConfigObject: {
        alwaysOpen: true,
        container: '#bike-calendar',
        beforeShowDay: calendar.classifyDate,
        inline: true,
        selectForward: true,
        showShortcuts: false,
        showTopbar: false,
        singleMonth: true,
        startOfWeek: 'monday'
    },

    lang: navigator.language.split('-')[0].toLowerCase(),
    /**
     * translation for en, de and nl
     */
    translationsConfigObject: translationsConfigObject,
    /**
     * removes calendar busy loader once calendar is loaded
     * @returns {this} allow chaining
     */
    removeCalendarBusyLoader: function () {
        $('#bike-calendar-loader').remove();
        return this;
    },
    /**
     * returns the nested property value
     * @param {object} obj of which property to be accessed
     * @param {string} path to the property as a string
     * @returns {object} returns property of the object
     */
    accessProperty: function (obj, path) {
        path = path.split('.');
        for (var loop = 0, length = path.length; loop < length; loop += 1) obj = obj[path[loop]];
        return obj;
    },
    /* ---------- USER LOGIN ----------- */
    triggerLoginForm: function () {
        $('#user-info').hide()
        $('#user-login').show();
        $('.info-description').hide();
        $('.info-login').show();
        $('#lnr-next-button-tab-basic-info').prop('disabled', false);
        loginFlow = true;
    },
    triggerSignupForm: function() {
        $('#user-info').show();
        $('#user-login').hide();
        $('.info-error').hide();
        $('.info-login').hide();
        $('.info-description').show();
        $('#lnr-next-button-tab-basic-info').prop('disabled', true);
        loginFlow = false;
    },
    /* --------------------------------- */

    /* --------- TOKEN LOGIN ----------- */
    // stores login data including a timestamp in localstorage
    storeLogin: function (email, token) {
        localStorage.setItem("lnrEmail", email);
        localStorage.setItem("lnrToken", token);
        localStorage.setItem("lnrTimestamp", Date.now());
    },
    // checks if login exists and is not expired
    hasStoredLogin: function () {
        // if login doesn't exist or exists and is older than 2 days: remove it and return false
        if (((Date.now() - localStorage.getItem("lnrTimestamp")) / (1000*60*60)) > 48 ) {
            helper.clearStoredLogin();
            return false;
        } 
        // otherwise check if all data exists and return true/false
        else {
            return (localStorage.getItem("lnrEmail") && localStorage.getItem("lnrToken")) ? true : false;
        }
    },
    // returns login data from localstorage, to be used in conjunction with hasStoredLogin()
    getStoredLogin: function () {
        return {lnrEmail: localStorage.getItem("lnrEmail"), lnrToken: localStorage.getItem("lnrToken")};
    },
    // removes login data from localstorage
    clearStoredLogin: function () {
        localStorage.removeItem("lnrEmail");
        localStorage.removeItem("lnrToken");
        localStorage.removeItem("lnrTimestamp");
    },
    /* --------------------------------- */
    /**
     * returns the currency format for user language 
     * @returns {object} config object
     */
    getCurrencyFormat: function () {
        switch (helper.lang) {
            case 'en': return {
                regions: 'en',
                colorize: false,
                decimalSymbol: '.',
                digitGroupSymbol: ','
            }
            case 'de': return {
                regions: 'de',
                colorize: false,
                decimalSymbol: ',',
                digitGroupSymbol: '.'
            }
            case 'nl': return {
                colorize: false,
                decimalSymbol: ',',
                digitGroupSymbol: '.'
            }
        }
    },
    /**
     * returns the translations for the user browser language
     * @param {void} requires nothings
     * @returns {void}
     */
    getTranslations: function () {
        switch (helper.lang) {
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
     * @param {string} sParam is param taken from url
     * @returns {string} param
     */
    getUrlParameter: function (sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&');

        for (var loop = 0; loop < sURLVariables.length; loop+=1) {
            var sParameterName = sURLVariables[loop].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    },
    /**
     * runs whenever date-picker change event is fired
     * @param {Date} startDate start date from calendar
     * @param {Date} endDate end date from calendar
     * @param {object} calendar it is an object 
     * @returns {string} param
     */
    onDateChange: function (startDate, endDate, calendar) {

        // calendar duration
        $('*[id*=lnr-calendar-duration]').each(function (index, element) {
            $(element).html(calendar.duration);
        });

        // calendar subtotal
        $('*[id*=lnr-calendar-subtotal]').each(function (index, element) {
            var elem = $(element);
            elem.html(calendar.subtotal).formatCurrency(helper.getCurrencyFormat());
            elem.append(' &euro;');
        });

        // calendar lnr fee
        $('*[id*=lnr-calendar-fee]').each(function (index, element) {
            var elem = $(element);
            elem.html(calendar.lnrFee).formatCurrency(helper.getCurrencyFormat());
            elem.append(' &euro;');
        });

        // calendar total
        $('*[id*=lnr-calendar-total]').each(function (index, element) {
            var elem = $(element);
            elem.html(calendar.total).formatCurrency(helper.getCurrencyFormat());
            elem.append(' &euro;');
        });

        // calendar start date
        $('[id=lnr-date-start]').each(function (index, element) {
            $(element).html('from ' + startDate.getDate() +
                '.' + startDate.getMonth() +
                '.' + startDate.getFullYear());
        });

        $('.rental-info-from').text(startDate.getDate() + '.' +
            startDate.getMonth() + '.' +
            startDate.getFullYear() + ', ' +
            calendar.startTime + ':00'
        );

        $('.rental-info-to').text(endDate.getDate() + '.' +
            endDate.getMonth() + '.' +
            endDate.getFullYear() + ', ' +
            calendar.endTime + ':00'
        );

        $('#lnr-date-start-button').attr("title", "");
        $('#lnr-date-end-button').attr("title", "");

        // calendar end date
        $('[id=lnr-date-end]').each(function (index, element) {
            $(element).html('to ' + endDate.getDate() +
                '.' + endDate.getMonth() +
                '.' + endDate.getFullYear());
        });
    },
    /**
     * used to go to the next tab
     * @param {Element} element DOM element
     * @returns {void}
     */
    nextTab: function (element) {
        switch (element.id) {
            case 'tab-basic-info': helper.changeTab(element); break;
            case 'tab-payment-details': loginFlow ? api.login(function() {helper.changeTab(element)}) : api.signup(function() {helper.changeTab(element)}); break;
            case 'tab-booking-overview': break;
            case 'tab-duration': api.createRequest(); break;
        }
    },
    // Virtually click on the actual tab, used to change to a certain tab
    changeTab: function (element) {
        document.getElementById(element.id).click();
    },
    signupOrLogin: function (changeTabCallback) {
        // TODO: 
    },
    /**
     * used to open the date (from/to) dropdowns for calendar 
     * @param {string} id id of the dropdown button for calendar
     * @param {string} type start or end
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
     * @param {Number} id id of the dropdown button for payment
     * @param {string} type from or to
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
            for (var loop = currentYear; loop <= (currentYear + 10); loop += 1) {
                element.append(
                    '<div class="lnr-date-selector" onclick="helper.onExpirationValueSelect(' + loop + ',' + type + ')">' +
                    parseInt(loop) + '</div>'
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
     * called when user selects time 
     * from time range dropdown (from/to)
     * @param {Number} index index of value selected from dropdown
     * @param {string} slot start or end
     * @returns {void}
     */
    onTimeValueSelect: function (index, slot) {
        var slotTime = slot + "Time";
        calendar[slotTime] = index;
        calendar.onTimeChange(slot);
        helper.updateTimeRangeText();
    },

    onExpirationValueSelect: function (value, slot) {
        payment[slot] = parseInt(value);
        helper.updatePaymentExpirationText();
    },
    /**
     * show credit card form
     * @returns {void}
     */
    showCreditCardForm: function () {
        // hide the payment credit card form
        $('#sp-payment-form').show();
    },
    /**
     * directive
     * renders rental info of bike
     * @returns {this} chaining
     */
    renderRentalInfo: function () {
        var rentalInfo = $('rental-info');

        var rentalInfoHTML =
            '<ul class="lnr-list-sm mdl-list">' +
            '<li class="mdl-list__item">' +
            '<span style="flex: 50;" class="mdl-list__item-primary-content md-title-sm" translate="durationPanel.from"></span>' +
            '<span align="right" class="rental-info-from mdl-list__item-primary-content md-subhead-sm" id="lnr-calendar-subtotal">-</span>' +
            '</li>' +
            '<li class="mdl-list__item">' +
            '<span style="flex: 50;" class="mdl-list__item-primary-content md-title-sm" translate="durationPanel.to"></span>' +
            '<span align="right" class="rental-info-to mdl-list__item-primary-content md-subhead-sm" id="lnr-calendar-subtotal">-</span>' +
            '</li>' +
            '<li class="mdl-list__item">' +
            '<span style="flex: 50;" class="mdl-list__item-primary-content md-list-compact md-title-sm" translate="rental.duration"></span>' +
            '<span align="right" class="mdl-list__item-primary-content md-list-compact md-subhead-sm" id="lnr-calendar-duration">-</span>' +
            '</li>' +
            '<lnr-vertical-divider></lnr-vertical-divider>' +
            '<li class="mdl-list__item">' +
            '<span style="flex: 50;" class="mdl-list__item-primary-content md-title-sm" translate="rental.fee"></span>' +
            '<span align="right" class="mdl-list__item-primary-content md-subhead-sm" id="lnr-calendar-fee">0 &euro;</span>' +
            '</li>' +
            '<li class="mdl-list__item">' +
            '<span style="flex: 50;" class="mdl-list__item-primary-content md-title-sm" translate="rental.total"></span>' +
            '<span align="right" class="mdl-list__item-primary-content md-subhead-sm" id="lnr-calendar-total">0 &euro;</span>' +
            '</li>' +
            '</ul>'

        rentalInfo.replaceWith(rentalInfoHTML);
        return this;
    },
    /**
     * directive
     * renders navigation buttons
     * navigation buttons for each step ...
     * ... has different ids
     * @returns {this} chaining
     */
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
                .concat('<div class="mdl-layout-spacer"></div><div align="right" class="lnr-button-cell mdl-cell mdl-cell--6-col mdl-cell--4-col-tablet mdl-cell--2-col-phone wizard-nav-button">') 
                .concat('<button onclick="window.print()" class="lnr-print-button lnr-back-button md-raised md-button md-ink-ripple"><span translate="shared.print"></span></button>');

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
    /**
     * returns category of the bikes
     * using the bike id
     * @param {string} categoryId id of the category
     * @returns {void}
     */
    categoryName: function (categoryId) {

        switch(categoryId) {
            case 10: return 'dutch-bike';
            case 11: return 'touring-bike';
            case 12: return 'fixie';
            case 13: return 'single-speed';   
            case 20: return 'road-bike';
            case 21: return 'triathlon';
            case 22: return 'indoor'; 
            case 30: return 'trecking';
            case 31: return 'enduro';
            case 32: return 'freeride';
            case 33: return 'cross-country';
            case 34: return 'downhill';
            case 35: return 'cyclocross'; 
            case 40: return 'city';
            case 41: return 'all-terrain';
            case 42: return 'road';   
            case 50: return 'pedelec';
            case 51: return 'e-bike'; 
            case 60: return 'folding-bike';
            case 61: return 'tandem';
            case 62: return 'cruiser';
            case 63: return 'cargo-bike';
            case 64: return 'recumbent';
            case 65: return 'mono-bike';  
            default: return "";
        }
    },
    /**
     * after DOM is rendered first time
     * runs once before calling user and bike api
     * @returns {void}
     */
    preInit: function () {
        // close the drop down for the date time selector in calendar
        window.onclick = helper.closeDropDown;
        // render rentals, navigation and apply translation
        helper
            .getTranslations()
            .renderRentalInfo()
            .renderNavButtons()
            .applyTranslations();
        // disable initially the time selector
        $('.dropdown-calendar *').attr("disabled", "disabled").off('click');
        // hide the payment credit card form
        $('#sp-payment-form').hide();
        $('.info-title').hide();
        $('.info-login').hide();
        $('.info-error').hide();
        $('.overview-error').hide();
        $('.payment-error').hide();
        $('.user-info-validation').hide();
        $('.payment-info-validation').hide();
        $('.overview-success').hide();
        $('.lnr-print-button').hide();
        $('#user-login').hide();
        $('#form_email_repeat').on('paste', function (e) {
            e.preventDefault();
        });
        $('#lnr-date-start-button').attr("title", translations.durationPanel.selectDaysFirst);
        $('#lnr-date-end-button').attr("title", translations.durationPanel.selectDaysFirst);
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
        // disable the navigation next button until
        // user correctly fills the form 
        $('#lnr-next-button-tab-duration').prop('disabled', true);
    },

    /**
     * initialize calendar, payment, date range
     * runs once after calling user and bike api
     * @returns {void}
     */
    postInit: function () {
        calendar.initOverview();
        helper.removeCalendarBusyLoader();
        calendar.initCalendarPicker();
        helper.updateTimeRangeText();
        helper.updatePaymentExpirationText();
    },
    /**
     * update the value selected by user using
     * calendar drop-down.
     * updates start and end time of calendar form
     * @returns {void}
     */
    updateTimeRangeText: function () {
        // initialize the button texts for time range selection
        var startButton = $('#lnr-date-start-button');
        var endButton = $('#lnr-date-end-button');
        startButton.html(calendar.startTime + ':00 <div class="dropdown-caret" style="float: right"></div>');
        endButton.html(calendar.endTime + ':00 <div class="dropdown-caret" style="float: right"></div>');
    },
    /**
     * update the value selected by user using
     * payment drop-down.
     * updates date and year of payment form
     * @returns {void}
     */
    updatePaymentExpirationText: function () {
        // initialize the button texts for expiration 
        var dateButton = $('#lnr-payment-date-button');
        var yearButton = $('#lnr-payment-year-button');
        dateButton.html(payment.date + '<div class="dropdown-caret" style="float: right"></div>');
        yearButton.html(payment.year + '<div class="dropdown-caret" style="float: right"></div>');
    },
    /**
     * close the drop-downs for calendar
     * as well as payment
     * @params {event} event fired by browser
     * @returns {void}
     */
    closeDropDown: function (event) {
        if (!event.target.matches('.lnr-dropdown-button')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            for (var loop = 0; loop < dropdowns.length; loop += 1) {
                var openDropdown = dropdowns[loop];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
};