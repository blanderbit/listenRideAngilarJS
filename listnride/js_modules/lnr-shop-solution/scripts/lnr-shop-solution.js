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
    price = new PriceService(),
    loginFlow = false,
    apiUrl = "";

$(document).ready(function () {
    // --- THIS SETUP CODE IS SOLELY FOR TESTING ---
        // var userId = helper.getUrlParameter('userId');
        // var bikeId = helper.getUrlParameter('bikeId');
        // var env = "staging";
        // var env = "production";
    // ---------------------------------------------

    if (userId !== undefined && bikeId !== undefined) {
        $("#lnr-container").show();
    } else {
        alert("No valid user and bike data provided. Please contact listnride support under contact@listnride.com");
        window.close();
    }

    if (env === "production") {
        apiUrl = "https://api.listnride.com/v2";
    } else {
        apiUrl = "https://listnride-staging-pr-130.herokuapp.com/v2";
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
            calendar.prices = bike.prices;
            calendar.priceHalfDay = bike.price_half_daily;
            calendar.priceDay = bike.price_daily;
            calendar.priceWeek = bike.price_weekly;
            calendar.bikeFamily = bike.family;
            calendar.requests = bike.requests;
            calendar.userId = bike.user.id;

            // remove extra spaces, only in single word brand names
            var brandSplitted = bike.brand.split(" ");
            var brandName = bike.brand;
            if (brandSplitted.length > 1 && brandSplitted.length < 3 && brandSplitted[1].length === 0) {
                brandName = brandName.split(" ").length > 3 ? brandName : brandName.replace(/\s/g, '');
            }

            $('#bike_picture').attr("src", bike.image_file.url);
            $('.overview_bike').append(brandName + ", " + helper.categoryName(bike.category));
            $('#overview_name').text(bike.name);
            $('#overview_lister').text(bike.user.first_name + " " + bike.user.last_name);
            $('#overview_location').text(bike.user.city);

            helper.postInit();
        });
    });
});
