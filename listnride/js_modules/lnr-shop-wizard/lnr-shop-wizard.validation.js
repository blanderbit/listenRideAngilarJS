var userFormOverview = {
    'form_first_name': false,
    'form_last_name': false,
    'form_email': false,
    'form_email_repeat': false,
    'valid': false
};

var paymentFormOverview = {
    'sp-payment-cardholder': false,
    'sp-payment-cardnumber': false,
    'sp-payment-cvv': false,
    'valid': false
};

//User info form validation
$(function () {
    $('#lnr-next-button-tab-basic-info').prop('disabled', true);
    $('#user-info').on('keyup click change keydown keypress', function () {
        // debugger
        if ($('#user-info md-input-container.is-invalid').length == 0) {
            userButtonValidator('valid', true);
            $('#user-info-validation').addClass('hidden')
        } else {
            userButtonValidator('valid', false);
            $('#user-info-validation').removeClass('hidden')
        }
    });
    $('#form_first_name').blur(function () {
        userButtonValidator(this.id, true);
        validateField(this.id, '#user');
    });
    $('#form_last_name').blur(function () {
        userButtonValidator(this.id, true);
        validateField(this.id, '#user');
    });
    $('#form_email').blur(function () {
        userButtonValidator(this.id, true);
        validateField(this.id, '#user');
        compareEmail();
    });
    $('#form_email_repeat').blur(function () {
        userButtonValidator(this.id, true);
        validateField(this.id, '#user');
        compareEmail()
    });
});

//Payment info form validation
$(function () {
    $('#lnr-next-button-tab-payment-details').prop('disabled', true);
    $('#sp-payment-form').on('keyup', function () {
        if ($('#sp-payment-form md-input-container.is-invalid').length == 0) {
            paymentButtonValidator('valid', true);
            $('#payment-info-validation').addClass('hidden')
        } else {
            paymentButtonValidator('valid', false);
            $('#payment-info-validation').removeClass('hidden')
        }
    });

    $('#sp-payment-cardholder').blur(function () {
        paymentButtonValidator(this.id, true);
        validateField(this.id, '#payment')
    });
    $('#sp-payment-cardnumber').blur(function () {
        paymentButtonValidator(this.id, true);
        validateField(this.id, '#payment')
    });
    $('#sp-payment-cvv').blur(function () {
        paymentButtonValidator(this.id, true);
        validateField(this.id, '#payment')
    });
    $('#sp-payment-cvv').on('keyup', function () {
        if (this.value.length > 4) {
            this.value = this.value.slice(0, 4);
        }
    });
});

function compareEmail() {
    if ($('#form_email_repeat').val().length > 0 && $('#form_email').val().length > 0) {
        if ($('#form_email').val() == $('#form_email_repeat').val()) {
            $('#form_email').parent().removeClass('is-invalid');
            $('#form_email_repeat').parent().removeClass('is-invalid');
        } else {
            $('#form_email').parent().addClass('is-invalid');
            $('#form_email_repeat').parent().addClass('is-invalid');
        }
    }
}

function userButtonValidator(field, value) {
    userFormOverview[field] = value;

    if (allTrue(userFormOverview)) {
        $('#lnr-next-button-tab-basic-info').prop('disabled', false);
    } else {
        $('#lnr-next-button-tab-basic-info').prop('disabled', true);
    }
}

function paymentButtonValidator(field, value) {
    paymentFormOverview[field] = value;

    if (allTrue(paymentFormOverview)) {
        $('#lnr-next-button-tab-payment-details').prop('disabled', false);
    } else {
        $('#lnr-next-button-tab-payment-details').prop('disabled', true);
    }
}

function validateField(input_id, text_id) {
    input_id = '#' + input_id;
    if ($(input_id).parent().hasClass('is-invalid') || $(input_id).val().length == 0) {
        $(input_id).parent().addClass('is-invalid');
        $(input_id).closest("div").find("label").addClass('text-invalid');
        $(text_id + '-info-validation').removeClass('hidden');
    } else {
        $(input_id).closest("div").find("label").removeClass('text-invalid');
        $(text_id + '-info-validation').addClass('hidden');
    }
}

function allTrue(obj)
{
    for(var o in obj)
        if(!obj[o]) return false;
    return true;
}

//Dirty hack for require working properly
MaterialTextfield.prototype.checkValidity = function () {
    if (this.input_.validity.valid) {
        this.element_.classList.remove(this.CssClasses_.IS_INVALID);
    } else {
        if (this.element_.getElementsByTagName('input')[0].value.length > 0) {
            this.element_.classList.add(this.CssClasses_.IS_INVALID);
        }
    }
};
