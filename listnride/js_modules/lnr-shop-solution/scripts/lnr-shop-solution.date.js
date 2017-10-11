/* global translations */
/**
 * date service
 * returns date for lnr format
 * @returns {object} duration and subtotal
 */
function DateService() {
    var calculateDays = function(startDate, endDate) {
        var hours = Math.abs(endDate - startDate) / (1000*60*60);
        return Math.max(1, Math.ceil(hours / 24));
    };
    return {
        durationDaysPretty: function(startDate, endDate) {
            var days = calculateDays(startDate, endDate);
            var weeks = (days / 7) | 0;
            var output = "";
            days -= weeks * 7;
            var weeksLabel = (weeks == 1) ? translations.rental.week : translations.rental.weeks;
            var daysLabel = (days == 1) ? translations.rental.day : translations.rental.days;
            if (weeks > 0)
                output += weeks + " " + weeksLabel;
            if (days > 0)
                output += (weeks > 0) ? (", " + days + " " + daysLabel) : (days + " " + daysLabel);
            return output;
        },
        durationDays: function(startDate, endDate) {
            return calculateDays(startDate, endDate);
        },
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
                    displayDuration += (weeks > 0) ? (", " + days + " " + daysLabel) : (days + " " + daysLabel);

                if (hours > 0)
                    displayDuration += (days > 0 || weeks > 0) ? (", " + hours + " " + hoursLabel) : (hours + " " + hoursLabel);


                return displayDuration;
            }
        }
    }
}