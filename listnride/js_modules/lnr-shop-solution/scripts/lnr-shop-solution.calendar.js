// render the calendar
calendar.initCalendarPicker = function() {
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
               calendar.dateChange(calendar.startDate, calendar.endDate);
                if (calendar.openingHoursAvailable()) {
                    calendar.setInitHours();
                }

                // enable the time selector
                $('.dropdown-calendar *').attr("disabled", false);
                $('.dropdown-payment *').attr("disabled", false);
            });
    }
};

calendar.getWeekDay = function(date) {
    var dayOfWeek = date.getDay() - 1;
    if (dayOfWeek == -1) {
        dayOfWeek = 6;
    }
    return dayOfWeek
};

calendar.openHours = function(weekDay) {
    var workingHours = [];
    $.each(weekDay, function (key, value) {
        var from = value.start_at / 3600;
        var until = (value.duration / 3600) + from + 1;
        $.merge(workingHours, _.range(from, until))
    });
    return workingHours
};

calendar.setInitHours = function() {
    var firstDay = calendar.bikeOwner.opening_hours.hours[calendar.getWeekDay(calendar.startDate)];
    var lastDay = calendar.bikeOwner.opening_hours.hours[calendar.getWeekDay(calendar.endDate)];
    firstDay = calendar.openHours(firstDay);
    lastDay = calendar.openHours(lastDay);
    calendar.startTime = firstDay[0];
    calendar.endTime = lastDay[lastDay.length - 1]
};

calendar.classifyDate = function(date) {
    date.setHours(0, 0, 0, 0);
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    if (date.getTime() < now.getTime()) {
        return [false, "date-past", ""];
    } else if (calendar.isReserved(date)) {
        return [false, "date-reserved", ""];
    } else if (calendar.dateClosed(date)) {
        return [false, "date-closed", ""];
    } else {
        return [true, "date-available", ""];
    }
};

calendar.dateClosed = function(date) {
    if (calendar.openingHoursAvailable()) {
        return calendar.bikeOwner.opening_hours.hours[calendar.getWeekDay(date)] == null;
    }
    return false
};

calendar.openingHoursAvailable = function() {
    var returnBool = calendar.bikeOwner &&
        calendar.bikeOwner.opening_hours &&
        calendar.bikeOwner.opening_hours.enabled &&
        _.some(calendar.bikeOwner.opening_hours.hours, Array);
    return returnBool;
};

calendar.isReserved = function(date) {
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
};

calendar.initOverview = function() {
    calendar.startTime = 10;
    calendar.endTime = 18;

    calendar.duration = date.duration(undefined, undefined);
    calendar.subtotal = 0;
    calendar.lnrFee = 0;
    calendar.total = 0;

    calendar.formValid = false;
    calendar.datesValid = false;
};

calendar.dateChange = function(startDate, endDate) {
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
    helper.onDateChange(startDate, endDate, calendar);
};
    
function countInvalidDays(startDate, endDate) {
    var totalDays = Math.abs(startDate.getDate() - endDate.getDate()) + 1;
    var currentDay = new Date(endDate);
    currentDay.setHours(0, 0, 0, 0);
    var i = 0;
    var invalidDays = 0;
    while (i < totalDays) {
        i++;
        if (calendar.isReserved(currentDay)) invalidDays++;
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
    if (date == undefined || !calendar.openingHoursAvailable()) {
        return true
    }
    var weekDay = calendar.bikeOwner.opening_hours.hours[calendar.getWeekDay(date)];
    if (weekDay !== null) {
        var workingHours = calendar.openHours(weekDay);
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
   calendar.dateChange(calendar.startDate, calendar.endDate);
};