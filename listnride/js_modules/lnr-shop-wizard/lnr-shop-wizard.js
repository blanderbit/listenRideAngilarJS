// DOM MANIPULATION CODE
var $,
    // now we need to fetch the details of the bikes and bind it to calendar object
    calendar = {},
    payment = {
        date: "Month",
        year: "Year"
    },
    translations,
    apiUrl = "https://listnride-staging.herokuapp.com/v2";

$(document).ready(function () {
    // perform common tasks on initialization
    helper.preInit();
    // fetch user info
    var userId = helper.getUrlParameter('userId') || 1005;
    $.get(apiUrl + "/users/" + userId, function (response) {
        calendar.bikeOwner = response;
        // fetch bike info
        var bikeId = helper.getUrlParameter('bikeId') || 165;
        $.get(apiUrl + "/rides/" + bikeId, function (bike) {
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

// instance of the date service
var date = new DateService();

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
        $(element).html('from ' + startDate.getDate() +
            '.' + startDate.getMonth() +
            '.' + startDate.getFullYear());
    });

    // // calendar end date
    $('[id=lnr-date-end]').each(function (index, element) {
        $(element).html('to ' + endDate.getDate() +
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
