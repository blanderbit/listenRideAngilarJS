/**
 * date service
 * returns date for lnr format
 */
function DateService() {
    return {
        duration: function (startDate, endDate, invalidDays) {
            if (startDate === undefined || endDate === undefined) {
                return "0 " + translations.rental.days + " , 0 " + translations.rental.hours;
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
                var weeksLabel = (weeks == 1) ? translations.rental.week : translations.rental.weeks;
                var daysLabel = (days == 1) ? translations.rental.day : translations.rental.days;
                var hoursLabel = (hours == 1) ? translations.rental.hour : translations.rental.hours;
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