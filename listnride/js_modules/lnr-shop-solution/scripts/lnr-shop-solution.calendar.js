/* global _ $ helper date */
// render the calendar
var calendar = {};
calendar.event = {};
calendar.event.pickupSlotId;
calendar.event.returnSlotId;

calendar.event.familyId = 12;

var slotDuration = 1;
var eventYear = 2017;
var eventMonth = 2;   // Months start at 0, so February = 1

calendar.initCalendarPicker = function () {
    if (calendar.requests !== undefined) {
        calendar.owner = calendar.userId;
        if (calendar.bikeFamily == calendar.event.familyId) {
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
                calendar.dateChange();
                if (calendar.openingHoursAvailable()) {
                    calendar.setInitHours();
                }

                // enable the time selector
                $('.dropdown-calendar *').attr("disabled", false);
                $('.dropdown-payment *').attr("disabled", false);
            });
    }
};

calendar.getWeekDay = function (date) {
    var dayOfWeek = date.getDay() - 1;
    if (dayOfWeek == -1) {
        dayOfWeek = 6;
    }
    return dayOfWeek
};

calendar.openHours = function (weekDay) {
    var workingHours = [];
    $.each(weekDay, function (key, value) {
        var from = value.start_at / 3600;
        var until = (value.duration / 3600) + from + 1;
        $.merge(workingHours, _.range(from, until))
    });
    return workingHours
};

calendar.setInitHours = function () {
    var firstDay = calendar.bikeOwner.opening_hours.hours[calendar.getWeekDay(calendar.startDate)];
    var lastDay = calendar.bikeOwner.opening_hours.hours[calendar.getWeekDay(calendar.endDate)];
    firstDay = calendar.openHours(firstDay);
    lastDay = calendar.openHours(lastDay);
    calendar.startTime = firstDay[0];
    calendar.endTime = lastDay[lastDay.length - 1];
    helper.updateTimeRangeText();    
    helper.onDateChange();
};

calendar.classifyDate = function (date) {
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

calendar.dateClosed = function (date) {
    if (calendar.openingHoursAvailable()) {
        return _.isEmpty(calendar.bikeOwner.opening_hours.hours[calendar.getWeekDay(date)]);
    }
    return false
};

calendar.openingHoursAvailable = function () {
    var returnBool = calendar.bikeOwner &&
        calendar.bikeOwner.opening_hours &&
        calendar.bikeOwner.opening_hours.enabled &&
        _.some(calendar.bikeOwner.opening_hours.hours, Array);
    return returnBool;
};

calendar.isReserved = function (date) {
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

calendar.initOverview = function () {
    calendar.startTime = 10;
    calendar.endTime = 18;

    calendar.duration = date.duration(undefined, undefined);
    calendar.subtotal = 0;
    calendar.lnrFee = 0;
    calendar.total = 0;

    calendar.formValid = false;
    calendar.datesValid = false;
};

calendar.dateChange = function () {
    if (calendar.isDateInvalid()) {
        calendar.duration = date.duration(undefined, undefined, 0);
        calendar.subtotal = 0;
        calendar.lnrFee = 0;
        calendar.total = 0;
    } else {
        var invalidDays = countInvalidDays(calendar.startDate, calendar.endDate);
        calendar.duration = date.duration(calendar.startDate, calendar.endDate, invalidDays);
        // Price calculation differs slightly between event rentals (bikeFamily 2 or 9) and standard rentals
        if (calendar.bikeFamily == 2 || calendar.bikeFamily == 9 || calendar.bikeFamily == 11) {
            invalidDays = 0;
            var subtotal = date.subtotal(calendar.startDate, calendar.endDate, calendar.priceHalfDay, calendar.priceDay, calendar.priceWeek, 4, invalidDays);
        } else {
            var subtotal = date.subtotal(calendar.startDate, calendar.endDate, calendar.priceHalfDay, calendar.priceDay, calendar.priceWeek, null, invalidDays);
        }
        var fee = subtotal * 0.125;
        var tax = fee * 0.19;
        calendar.subtotal = subtotal;
        calendar.lnrFee = fee + tax;
        calendar.total = subtotal + fee + tax;
    }
    helper.onDateChange();
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
    calendar.dateChange();
};

calendar.event.changePickupSlot = function () {
    // Define picked slot as pickupSlot
    calendar.event.slots[calendar.event.pickupSlotId].pickup = true;
    // Enable all following slots as returnSlots if no booking is inbetween
    var bookingInBetween = false;
    _.each(calendar.event.slots, function (value, index) {
        if (index > calendar.event.pickupSlotId) {
            if (value.reserved && calendar.event.slots[index - 1].reserved) {
                bookingInBetween = true;
            }
            if (bookingInBetween) {
                value.returnDisabled = true;
            } else {
                value.returnDisabled = false;
            }
        } else {
            value.returnDisabled = true;
        }
    });

    var slot = calendar.event.slots[calendar.event.pickupSlotId];
    calendar.startDate = new Date(eventYear, eventMonth, slot.day, slot.hour, 0, 0, 0);

    // Presets returnSlot to be (slotDuration) after pickupSlot 
    calendar.event.returnSlotId = parseInt(calendar.event.pickupSlotId) + slotDuration;
    calendar.event.changeReturnSlot();
    calendar.dateChange();
};

calendar.event.changeReturnSlot = function () {
    var slot = calendar.event.slots[calendar.event.returnSlotId];

    if (slot.overnight) {
        calendar.endDate = new Date(eventYear, eventMonth, slot.day + 1, slot.hour, 0, 0, 0);
    } else {
        calendar.endDate = new Date(eventYear, eventMonth, slot.day, slot.hour, 0, 0, 0);
    }

    calendar.dateChange();
};

calendar.event.reserved = function () {
    for (var i = 0; i < calendar.requests.length; i++) {
        var startDate = new Date(calendar.requests[i].start_date);
        var endDate = new Date(calendar.requests[i].end_date);
        var startDay = startDate.getDate();
        var startTime = startDate.getHours();
        var endTime = endDate.getHours();
        var startYear = startDate.getFullYear();
        var startMonth = startDate.getMonth();

        for (var j = 0; j < calendar.event.slots.length; j++) {
            if (startYear == eventYear && startMonth == eventMonth && calendar.event.slots[j].day == startDay && calendar.event.slots[j].hour >= startTime && (calendar.event.slots[j].overnight || calendar.event.slots[j].hour + slotDuration <= endTime)) {
                calendar.event.slots[j].reserved = true;
                calendar.event.slots[j].text = calendar.event.slots[j].text.split(" ", 1) + " (booked)";
            }
        }
    }
};