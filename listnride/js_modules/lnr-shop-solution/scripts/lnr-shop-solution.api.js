/* global 
        calendar
        $
        apiUrl
        user
*/
var api = {
    /*--------------- API ACTIONS ---------------*/
    signup: function (nextTab) {

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
                success: function (response) {
                    $('.info-description').show();
                    $('.info-error').hide();
                    var encoded = api.base64Encode(response.email + ":" + response.password_hashed);
                    user.auth = 'Basic ' + encoded;
                    user.id = response.id;
                    // store the login data in local storage
                    helper.storeLogin(response.email, response.password_hashed);
                    nextTab();
                },
                error: function () {
                    $('.info-description').hide();
                    $('.info-login').show();
                    $('#form_login_email').val($('#form_email').val());
                    helper.triggerLoginForm();
                }
            });
        } else {
            nextTab();
        }
    },
    login: function(nextTab) {
        var data = {
            "user": {
                "email": $('#form_login_email').val(),
                "password_hashed": $('#form_login_password').val()
            }
        };

        $.post({
            url: apiUrl + "/users/login",
            data: data,
            success: function (response) {
                console.log("Login Successful");
                console.log(response);
            },
            error: function () {
                $('.info-login').hide();
                $('.info-error').show();
                return false;
            }
        });
    },
    createRequest: function () {
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
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", user.auth);
            },
            success: function () {
                $('#lnr-next-button-tab-booking-overview').hide();
                $('.lnr-print-button').show();
                $('#lnr-back-button-tab-booking-overview').hide();
                $('.overview-description').hide();
                $('.overview-error').hide();
                $('.overview-success').show();
            },
            error: function (response) {
                if (response.responseJSON) {
                    $('.overview-error-description').text(response.responseJSON.errors[0].detail);
                } else if (response.statusText) {
                    $('.overview-error-description').text(response.statusText);
                }
                $('.overview-description').hide();
                $('.overview-error').show();
            }
        });
    },
    /*------------------- Encrypting -------------------------*/
    base64Encode: function (input) {
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
};