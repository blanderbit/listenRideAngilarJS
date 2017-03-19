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
     * returns the currency format for user language  
     * @param {void}
     * @returns {object} config object
     */
    getCurrencyFormat: function () {
        var lang = navigator.language.split('-')[0].toLowerCase();
        switch (lang) {
            case 'en': return {
                colorize: false,
                decimalSymbol: '.',
                digitGroupSymbol: ','
            }
            case 'de': return {
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
     * runs whenever date-picker change event is fired
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

        // // calendar end date
        $('[id=lnr-date-end]').each(function (index, element) {
            $(element).html('to ' + endDate.getDate() +
                '.' + endDate.getMonth() +
                '.' + endDate.getFullYear());
        });
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
            case 'tab-duration': createRequest(); break;
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

    categoryName: function (categoryId) {

        switch(categoryId) {
            case 10: return 'dutch-bike'; break;
            case 11: return 'touring-bike'; break;
            case 12: return 'fixie'; break;
            case 13: return 'single-speed'; break;   
            case 20: return 'road-bike'; break;
            case 21: return 'triathlon'; break;
            case 22: return 'indoor'; break; 
            case 30: return 'trecking'; break;
            case 31: return 'enduro'; break;
            case 32: return 'freeride'; break;
            case 33: return 'cross-country'; break;
            case 34: return 'downhill'; break;
            case 35: return 'cyclocross'; break; 
            case 40: return 'city'; break;
            case 41: return 'all-terrain'; break;
            case 42: return 'road'; break;   
            case 50: return 'pedelec'; break;
            case 51: return 'e-bike'; break; 
            case 60: return 'folding-bike'; break;
            case 61: return 'tandem'; break;
            case 62: return 'cruiser'; break;
            case 63: return 'cargo-bike'; break;
            case 64: return 'recumbent'; break;
            case 65: return 'mono-bike'; break;  
            default: return ""; break;
        }
    },

    preInit: function () {
        // close the drop down for the date time selector in calendar
        window.onclick = closeDropDown;
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
        $('.info-error').hide();
        $('.overview-error').hide();
        $('.payment-error').hide();
        $('.user-info-validation').hide();
        $('.payment-info-validation').hide();
        $('.overview-success').hide();
        $('.lnr-print-button').hide();
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

        $.post({
            url: apiUrl + "/users",
            data: data,
            success: function(response) {
                $('.info-description').show();
                $('.info-error').hide();
                var encoded = base64Encode(response.email + ":" + response.password_hashed);
                user.auth = 'Basic ' + encoded;
                user.id = response.id;
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

function createRequest() {
    var data = {
        'request': {
            'user_id': user.id,
            'ride_id': calendar.bikeId,
            'start_date': calendar.startDate,
            'end_date': calendar.endDate,
            'instant': true
        }
    };

    $.post({
        url: apiUrl + "/requests",
        data: data,
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", user.auth);
        },
        success: function(response) {
            $('#lnr-next-button-tab-booking-overview').hide();
            $('.lnr-print-button').show();
            $('#lnr-back-button-tab-booking-overview').hide();
            $('.overview-description').hide();
            $('.overview-error').hide();
            $('.overview-success').show();
        },
        error: function(response) {
            if(response.responseJSON) {
                $('.overview-error-description').text(response.responseJSON.errors[0].detail);
            } else if (response.statusText) {
                $('.overview-error-description').text(response.statusText);
            }
            $('.overview-description').hide();
            $('.overview-error').show();
        }
    });
}


/*------------------- Encrypting -------------------------*/

function base64Encode(input) {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
        'QRSTUVWXYZabcdef' +
        'ghijklmnopqrstuv' +
        'wxyz0123456789+/' +
        '=';
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
            keyStr.charAt(enc1) +
            keyStr.charAt(enc2) +
            keyStr.charAt(enc3) +
            keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);

    return output;
}
