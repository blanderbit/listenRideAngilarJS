// DOM MANIPULATION CODE
var $;
// now we need to fetch the details of the bikes and bind it to calendar object
var calendar = {};
var userInfo = {};
var payment = {
    date: "Month",
    year: "Year"
};

$(document).ready(function () {
    // perform common tasks on initialization
    helper.preInit();
    // fetch user info
    var userId = helper.getUrlParameter('userId') || 1005;
    $.get("https://api.listnride.com/v2/users/" + userId, function (response) {
        calendar.bikeOwner = response;
        // fetch bike info
        var bikeId = helper.getUrlParameter('bikeId') || 165;
        $.get("https://listnride-staging.herokuapp.com/v2/rides/" + bikeId, function (bike) {
            // populate calendar object
            calendar.bikeId = bikeId;
            calendar.priceHalfDay = bike.price_half_daily;
            calendar.priceDay = bike.price_daily;
            calendar.priceWeek = bike.price_weekly;
            calendar.bikeFamily = bike.family;
            calendar.requests = bike.requests;
            calendar.userId = bike.user.id;

            helper.postInit();
        });
    });
});

/**
 * date service
 * returns date for lnr format
 */
function DateService() {
    return {
        duration: function (startDate, endDate, invalidDays) {
            if (startDate === undefined || endDate === undefined) {
                return "0 " + "days" + " , 0 " + "hours"
            } else {
                var startDate = new Date(startDate);
                var endDate = new Date(endDate);
                var diff = Math.abs(startDate - endDate);

                var seconds = (diff / 1000) | 0;
                diff -= seconds * 1000;
                var minutes = (seconds / 60) | 0;
                seconds -= minutes * 60;
                var hours = (minutes / 60) | 0;
                minutes -= hours * 60;
                var days = (hours / 24) | 0;
                hours -= days * 24;
                days = days - invalidDays;
                var weeks = (days / 7) | 0;
                days -= weeks * 7;

                var weeksLabel = (weeks == 1) ? "week" : "weeks";
                var daysLabel = (days == 1) ? "day" : "days";
                var hoursLabel = (hours == 1) ? "hour" : "hours";

                var displayDuration = "";

                if (weeks > 0)
                    displayDuration += weeks + " " + weeksLabel;

                if (days > 0)
                    displayDuration += (weeks > 0) ?
                    (", " + days + " " + daysLabel) :
                    (days + " " + daysLabel);

                if (hours > 0)
                    displayDuration += (days > 0 || weeks > 0) ?
                    (", " + hours + " " + hoursLabel) :
                    (hours + " " + hoursLabel);


                return displayDuration;
            }
        },

        subtotal: function (startDate, endDate, priceHalfDay, priceDay, priceWeek, minHoursDay, invalidDays) {
            minHoursDay = minHoursDay || 6;

            if (startDate === undefined || endDate === undefined) {
                return 0;
            } else {
                var diff = Math.abs(startDate - endDate);

                var seconds = (diff / 1000) | 0;
                diff -= seconds * 1000;
                var minutes = (seconds / 60) | 0;
                seconds -= minutes * 60;
                var hours = (minutes / 60) | 0;
                minutes -= hours * 60;
                var days = (hours / 24) | 0;
                hours -= days * 24;
                days = days - invalidDays;
                var weeks = (days / 7) | 0;
                days -= weeks * 7;

                var value = priceWeek * weeks;
                value += priceDay * days;

                if (weeks == 0 && days == 0) {
                    value += (hours <= minHoursDay) ? priceHalfDay * 1 : priceDay * 1;
                } else {
                    if (0 < hours && hours < minHoursDay) {
                        value += (priceHalfDay * 1);
                    } else if (hours >= minHoursDay) {
                        value += (priceDay * 1);
                    }
                }

                if (weeks == 0 && value > priceWeek) {
                    value = priceWeek * 1;
                }

                return value;
            }
        }
    }
}
var date = new DateService();

/** 
 * These are the methods specific for the adoption of the 
 * angular calendar code to plain javascript calendar code
 */
var helper = {

    // jquery date range picker config object
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
            '<span style="flex: 50;" class="mdl-list__item-primary-content md-list-compact md-subhead-sm">duration</span>' +
            '<span align="right" class="mdl-list__item-primary-content md-list-compact md-subhead-sm" id="lnr-calendar-duration">0 day, 0 hours</span>' +
            '</li>' +
            '<md-divider class="lnr-no-padding lnr-margin-lrg"></md-divider>' +
            '<li class="mdl-list__item">' +
            '<span style="flex: 50;" class="mdl-list__item-primary-content md-subhead-sm">subtotal</span>' +
            '<span align="right" class="mdl-list__item-primary-content md-subhead-sm" id="lnr-calendar-subtotal">0 &euro;</span>' +
            '</li>' +
            '<li class="mdl-list__item">' +
            '<span style="flex: 50;" class="mdl-list__item-primary-content md-subhead-sm">listnride fee (incl. tax)</span>' +
            '<span align="right" class="mdl-list__item-primary-content md-subhead-sm" id="lnr-calendar-fee">0 &euro;</span>' +
            '</li>' +
            '<li class="mdl-list__item">' +
            '<span style="flex: 50;" class="mdl-list__item-primary-content md-subhead-sm">total</span>' +
            '<span align="right" class="mdl-list__item-primary-content md-subhead-sm" id="lnr-calendar-total">0 &euro;</span>' +
            ' </li>' +
            '  </ul>' +
            '</div>' +
            '</div>'

        rentalInfo.replaceWith(rentalInfoHTML);
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
                    .concat('class="md-accent md-raised md-button md-ink-ripple"><span>' + backText + '</span></button></div>');
            } else {
                navButtonHTML = navButtonHTML.concat('</div>');
            }

            navButtonHTML = navButtonHTML
                .concat('<div align="right" class="mdl-cell mdl-cell--6-col mdl-cell--4-col-tablet mdl-cell--2-col-phone wizard-nav-button">');

            // next button
            if (next) {
                navButtonHTML = navButtonHTML
                    .concat('<button onclick="helper.changeTab({id: ' + next + '})" class="md-accent md-raised md-button md-ink-ripple"><span>')
                    .concat(nextText + '</span></button></div>');
            } else {
                navButtonHTML = navButtonHTML.concat('</div>');
            }

            // close the grid
            navButtonHTML = navButtonHTML.concat('</div>');

            // render html for each navigation
            element.replaceWith(navButtonHTML);
        });
    },

    preInit: function () {
        // close the drop down for the date time selector in calendar
        window.onclick = closeDropDown;

        // disable initially the time selector
        $('.dropdown-calendar *').attr("disabled", "disabled").off('click');

        // hide the payment credit card form
        $('#sp-payment-form').hide();

        this.renderRentalInfo();
        this.renderNavButtons();
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

// render the calendar
function initCalendarPicker() {
    if (calendar.requests !== undefined) {
        calendar.owner = calendar.userId;
        if (calendar.bikeFamily == 2 || calendar.bikeFamily == 9) {
            calendar.event.reserved();
        }
        $('#bike-calendar').dateRangePicker(helper.calenderConfigObject)
            .bind('datepicker-change', function (event, obj) {
                var start = obj.date1;
                start.setHours(calendar.startTime, 0, 0, 0);
                var end = obj.date2;
                end.setHours(calendar.endTime, 0, 0, 0);

                calendar.startDate = start;
                calendar.endDate = end;
                dateChange(calendar.startDate, calendar.endDate);
                if (openingHoursAvailable()) {
                    setInitHours();
                }

                // enable the time selector
                $('.dropdown-calendar *').attr("disabled", false);
                $('.dropdown-payment *').attr("disabled", false);
            });
    }
}

function updateTimeRangeText() {
    // initialize the button texts for time range selection
    var startButton = $('#lnr-date-start-button');
    var endButton = $('#lnr-date-end-button');
    startButton.html(calendar.startTime + ':00');
    endButton.html(calendar.endTime + ':00');
}

function updatePaymentExpirationText() {
    // initialize the button texts for expiration 
    var dateButton = $('#lnr-payment-date-button');
    var yearButton = $('#lnr-payment-year-button');
    dateButton.html(payment.date);
    yearButton.html(payment.year);
}

function closeDropDown(event) {
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

function getWeekDay(date) {
    var dayOfWeek = date.getDay() - 1;
    if (dayOfWeek == -1) {
        dayOfWeek = 6;
    }
    return dayOfWeek
}

function openHours(weekDay) {
    var workingHours = [];
    $.each(weekDay, function (key, value) {
        var from = value.start_at / 3600;
        var until = (value.duration / 3600) + from + 1;
        $.merge(workingHours, _.range(from, until))
    });
    return workingHours
}

function setInitHours() {
    var firstDay = calendar.bikeOwner.opening_hours.hours[getWeekDay(calendar.startDate)];
    var lastDay = calendar.bikeOwner.opening_hours.hours[getWeekDay(calendar.endDate)];
    firstDay = openHours(firstDay);
    lastDay = openHours(lastDay);
    calendar.startTime = firstDay[0];
    calendar.endTime = lastDay[lastDay.length - 1]
}

function classifyDate(date) {
    date.setHours(0, 0, 0, 0);
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    if (date.getTime() < now.getTime()) {
        return [false, "date-past", ""];
    } else if (isReserved(date)) {
        return [false, "date-reserved", ""];
    } else if (dateClosed(date)) {
        return [false, "date-closed", ""];
    } else {
        return [true, "date-available", ""];
    }
}

function dateClosed(date) {
    if (openingHoursAvailable()) {
        return calendar.bikeOwner.opening_hours.hours[getWeekDay(date)] == null;
    }
    return false
}

function openingHoursAvailable() {
    var returnBool = calendar.bikeOwner &&
        calendar.bikeOwner.opening_hours &&
        calendar.bikeOwner.opening_hours.enabled &&
        _.some(calendar.bikeOwner.opening_hours.hours, Array);
    return returnBool;
}

function isReserved(date) {
    for (var i = 0; i < calendar.requests.length; ++i) {
        var start = new Date(calendar.requests[i].start_date);
        start.setHours(0, 0, 0, 0);
        var end = new Date(calendar.requests[i].end_date);
        end.setHours(0, 0, 0, 0);

        if (start.getTime() <= date.getTime() &&
            date.getTime() <= end.getTime()) {
            return true;
        }
    }
    return false;
}

function initOverview() {
    calendar.startTime = 10;
    calendar.endTime = 18;

    calendar.duration = date.duration(undefined, undefined);
    calendar.subtotal = 0;
    calendar.lnrFee = 0;
    calendar.total = 0;

    calendar.formValid = false;
    calendar.datesValid = false;
}

function dateChange(startDate, endDate) {
    if (calendar.isDateInvalid()) {
        calendar.duration = date.duration(undefined, undefined, 0);
        calendar.subtotal = 0;
        calendar.lnrFee = 0;
        calendar.total = 0;
    } else {
        var invalidDays = countInvalidDays(startDate, endDate);
        calendar.duration = date.duration(startDate, endDate, invalidDays);
        // Price calculation differs slightly between event rentals (bikeFamily 2 or 9) and standard rentals
        if (calendar.bikeFamily == 2 || calendar.bikeFamily == 9) {
            var subtotal = date.subtotal(startDate, endDate, calendar.priceHalfDay, calendar.priceDay, calendar.priceWeek, 4, invalidDays);
        } else {
            var subtotal = date.subtotal(startDate, endDate, calendar.priceHalfDay, calendar.priceDay, calendar.priceWeek, null, invalidDays);
        }
        var fee = subtotal * 0.125;
        var tax = fee * 0.19;
        calendar.subtotal = subtotal;
        calendar.lnrFee = fee + tax;
        calendar.total = subtotal + fee + tax;
    }

    // calendar duration
    $('*[id*=lnr-calendar-duration]').each(function (index, element) {
        $(element).html(calendar.duration);
    });

    // calendar subtotal
    $('*[id*=lnr-calendar-subtotal]').each(function (index, element) {
        $(element).html(calendar.subtotal + ' &euro;');
    });

    // calendar lnr fee
    $('*[id*=lnr-calendar-fee]').each(function (index, element) {
        $(element).html(calendar.lnrFee + ' &euro;');
    });

    // calendar total
    $('*[id*=lnr-calendar-total]').each(function (index, element) {
        $(element).html(calendar.total + ' &euro;');
    });

    // // calendar start date
    $('[id=lnr-date-start]').each(function (index, element) {
        $(element).text('from ' + startDate.getDate() +
            '.' + startDate.getMonth() +
            '.' + startDate.getFullYear());
    });

    // // calendar end date
    $('[id=lnr-date-end]').each(function (index, element) {
        $(element).text('to ' + endDate.getDate() +
            '.' + endDate.getMonth() +
            '.' + endDate.getFullYear());
    });
}

function countInvalidDays(startDate, endDate) {
    var totalDays = Math.abs(startDate.getDate() - endDate.getDate()) + 1;
    var currentDay = new Date(endDate);
    currentDay.setHours(0, 0, 0, 0);
    var i = 0;
    var invalidDays = 0;
    while (i < totalDays) {
        i++;
        if (isReserved(currentDay)) invalidDays++;
        currentDay.setDate(currentDay.getDate() - 1);
        currentDay.setHours(0, 0, 0, 0);
    }
    return invalidDays;
}

calendar.availabilityMessage = function ($index, date) {
    if (!calendar.isOptionEnabled($index, date)) {
        return ' (closed)';
    }
    return '';
};

calendar.isOptionEnabled = function ($index, date) {
    if (date == undefined || !openingHoursAvailable()) {
        return true
    }
    var weekDay = calendar.bikeOwner.opening_hours.hours[getWeekDay(date)];
    if (weekDay !== null) {
        var workingHours = openHours(weekDay);
        return workingHours.includes($index + 6);
    }
    return false
};

calendar.isDateInvalid = function () {
    return calendar.startDate !== undefined &&
        calendar.startDate.getTime() >= calendar.endDate.getTime();
};

calendar.isFormInvalid = function () {
    return calendar.bikeId === undefined || calendar.startDate ===
        undefined ||
        (calendar.startDate !== undefined && calendar.startDate.getTime() >= calendar.endDate.getTime());
};

calendar.onTimeChange = function (slot) {
    var slotDate = slot + "Date";
    var slotTime = slot + "Time";
    var date = new Date(calendar[slotDate]);
    date.setHours(calendar[slotTime], 0, 0, 0);
    calendar[slotDate] = date;
    dateChange(calendar.startDate, calendar.endDate);
};

calendar.isFormInvalid = function () {
    return calendar.bikeId === undefined || calendar.startDate ===
        undefined ||
        (calendar.startDate !== undefined && calendar.startDate.getTime() >=
            calendar.endDate.getTime());
};