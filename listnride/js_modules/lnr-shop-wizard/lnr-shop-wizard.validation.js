$(function () {
    $('#lnr-next-button-tab-duration').prop('disabled', true);
});

/*------------ User info form validation ------------*/

var userFormOverview = {
    'form_first_name': false,
    'form_last_name': false,
    'form_email': false,
    'form_email_repeat': false,
    'valid': false
};

$(function () {
    $('#lnr-next-button-tab-basic-info').prop('disabled', true);
    $('#user-info').on('keyup', function () {
        userInputErrorAny()
    });
    $('#form_first_name').on('keyup blur', function () {
        userButtonValidator(this.id, true);
        validateField(this.id, '#user');
        userInputErrorAny();
    });
    $('#form_last_name').on('keyup blur', function () {
        userButtonValidator(this.id, true);
        validateField(this.id, '#user');
        userInputErrorAny();
    });
    $('#form_email').on('keyup blur', function () {
        userButtonValidator(this.id, true);
        validateField(this.id, '#user');
        compareEmail();
        userInputErrorAny();
    });
    $('#form_email_repeat').on('keyup blur', function () {
        userButtonValidator(this.id, true);
        validateField(this.id, '#user');
        compareEmail();
    });
});

function compareEmail() {
    var $email = $('#form_email');
    var $repeat = $('#form_email_repeat');
    if ($repeat.val().length > 0 && $('#form_email').val().length > 0) {
        if ($email.val() == $repeat.val()) {
            $email.parent().removeClass('is-invalid');
            $email.closest("div").find("label").removeClass('text-invalid');
            $repeat.parent().removeClass('is-invalid');
            $repeat.closest("div").find("label").removeClass('text-invalid');
        } else {
            $email.closest("div").find("label").addClass('text-invalid');
            $email.parent().addClass('is-invalid');
            $repeat.parent().addClass('is-invalid');
            $repeat.closest("div").find("label").addClass('text-invalid');
        }
    }
    userInputErrorAny();
}

function userButtonValidator(field, value) {
    userFormOverview[field] = value;

    if (allTrue(userFormOverview)) {
        $('#lnr-next-button-tab-basic-info').prop('disabled', false);
    } else {
        $('#lnr-next-button-tab-basic-info').prop('disabled', true);
    }
}

function userInputErrorAny(){
    if ($('#user-info md-input-container.is-invalid').length == 0) {
        userButtonValidator('valid', true);
        $('#user-info-validation').addClass('hidden')
    } else {
        userButtonValidator('valid', false);
        $('#user-info-validation').removeClass('hidden')
    }
}

/*------------ Payment info form validation ------------*/

var paymentFormOverview = {
    'sp-payment-cardholder': false,
    'sp-payment-cardnumber': false,
    'sp-payment-cvv': false,
    'valid': false
};

$(function () {
    $('#lnr-next-button-tab-payment-details').prop('disabled', true);
    $('#sp-payment-form').on('keyup', function () {
        paymentInputErrorAny();
    });
    $('#sp-payment-cardholder').on('keyup blur', function () {
        paymentButtonValidator(this.id, true);
        validateField(this.id, '#payment');
        paymentInputErrorAny();
    });
    $('#sp-payment-cardnumber').on('keyup blur', function () {
        paymentButtonValidator(this.id, true);
        validateField(this.id, '#payment');
        paymentInputErrorAny();
    });
    $('#sp-payment-cvv').on('keyup blur', function () {
        paymentButtonValidator(this.id, true);
        validateField(this.id, '#payment');
        paymentInputErrorAny();
        if (this.value.length > 4) {
            this.value = this.value.slice(0, 4);
        }
    });
});

function paymentInputErrorAny(){
    if ($('#sp-payment-form md-input-container.is-invalid').length == 0) {
        paymentButtonValidator('valid', true);
        $('#payment-info-validation').addClass('hidden')
    } else {
        paymentButtonValidator('valid', false);
        $('#payment-info-validation').removeClass('hidden')
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

/*------------ Shared stuff ------------*/

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
