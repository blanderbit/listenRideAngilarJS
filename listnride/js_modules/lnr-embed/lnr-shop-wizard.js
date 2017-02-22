// DOM MAIPULATION CODE
var $;
// now we need to fetch the details of the bikes and bind it to calendar object
var calendar = {};
$(document).ready(function () {
    // close the drop down for the date time selector in calendar
    window.onclick = function (event) {
        closeDropDown(event);
    }
    // LOGIC CODE - NEEDS TO BE IN SEPERATE FILE
    // RUNS BEFORE DOM MANIPULAITON
    // fetch user info
    var userId = helper.getUrlParameter('userId') || 1005;
    $.get("https://api.listnride.com/v2/users/" + userId, function (response) {
        calendar.bikeOwner = response;
        // fetch bike info
        var bikeId = helper.getUrlParameter('bikeId') || 165;
        $.get("https://listnride-staging.herokuapp.com/v2/rides/" + bikeId, function (bike) {
            calendar.bikeId = bikeId;
            calendar.priceHalfDay = bike.price_half_daily;
            calendar.priceDay = bike.price_daily;
            calendar.priceWeek = bike.price_weekly;
            calendar.bikeFamily = bike.family;
            calendar.requests = bike.requests;
            calendar.userId = bike.user.id;

            initOverview();
            initCalendarPicker();
            updateTimeRangeText();
            // disable initially the time selector
            $('.dropdown *').attr("disabled", "disabled").off('click');
        });
    });
});

/**
 * date service
 * returns date for lnr format
 * date.service.js in angular app
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
     * used to open the date (from/to) dropdowns 
     * @param {Number} id
     * @param {string} type
     * @returns {void}
     */
    openDropDown: function (id, type) {

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
                $('.dropdown *').attr("disabled", false);
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

function closeDropDown(event) {
    if (!event.target.matches('.lnr-dropdown-button')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
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