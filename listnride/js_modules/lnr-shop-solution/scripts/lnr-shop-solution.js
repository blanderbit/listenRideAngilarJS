/*global DateService helper calendar env*/
/*eslint no-undef: "error"*/
var $,
    // Define some global variables
    payment = {
        date: "Month",
        year: "Year"
    },
    translations = {},
    user = {
        id: null,
        hasPaymentMethod: false
    },
    date = new DateService(),
    loginFlow = false,
    apiUrl = "";

$(document).ready(function () {
    // --- THIS SETUP CODE IS SOLELY FOR TESTING ---
        // var userId = helper.getUrlParameter('userId');
        // var bikeId = helper.getUrlParameter('bikeId');
        // var env = "production";
    // ---------------------------------------------

    if (env === "production") {
        apiUrl = "https://api.listnride.com/v2";
    } else {
        apiUrl = "https://listnride-staging.herokuapp.com/v2";
    }
    // perform common tasks on initialization
    helper.preInit();
    // fetch user info
    $.get(apiUrl + "/users/" + userId, function (response) {
        calendar.bikeOwner = response;
        // fetch bike info
        $.get(apiUrl + "/rides/" + bikeId, function (bike) {
            // populate calendar object
            calendar.bikeId = bikeId;
            calendar.priceHalfDay = bike.price_half_daily;
            calendar.priceDay = bike.price_daily;
            calendar.priceWeek = bike.price_weekly;
            calendar.bikeFamily = bike.family;
            calendar.requests = bike.requests;
            calendar.userId = bike.user.id;
            $('#bike_picture').attr("src", bike.image_file_1.image_file_1.small.url);
            $('#overview_bike').text(bike.brand + ", " + helper.categoryName(bike.category));
            $('#overview_name').text(bike.name);
            $('#overview_lister').text(bike.user.first_name + " " + bike.user.last_name);
            $('#overview_location').text(bike.user.city);

            helper.postInit();
        });
    });
});
