//User info form validation
$(function () {
    $('#user-info-validation').addClass('hidden');
    $('#user-info').on('keyup', function () {
        if ($('#user-info md-input-container.is-invalid').length == 0) {
            $('#user-info-validation').addClass('hidden')
        } else {
            $('#user-info-validation').removeClass('hidden')
        }
    });
    $('#form_first_name').blur(function(){ validateField('#form_first_name', '#user')});
    $('#form_last_name').blur(function(){ validateField('#form_last_name', '#user')});
    $('#form_email').blur(function(){ validateField('#form_email', '#user')});
    $('#form_email_repeat').blur(function(){
        if ($('#form_email_repeat').val() != $('#form_email_repeat').val()) $('#form_email_repeat').parent().addClass('is-invalid');
        validateField('#form_email_repeat', '#user')
    });
});

//Payment info form validation
$(function () {
    $('#payment-info-validation').addClass('hidden');
    $('#sp-payment-form').on('keyup', function () {
        $('#payment-info-validation').toggleClass('hidden', $('#sp-payment-form md-input-container.is-invalid').length == 0);
    });

    $('#sp-payment-cardholder').blur(function(){ validateField('#sp-payment-cardholder', '#payment')});
    $('#sp-payment-cardnumber').blur(function(){ validateField('#sp-payment-cardnumber', '#payment')});
    $('#sp-payment-cvv').blur(function(){ validateField('#sp-payment-cvv', '#payment')});
    $('#sp-payment-cvv').on('keyup', function () {
        if (this.value.length > 4) {
            this.value = this.value.slice(0,4);
        }
    });
});

$(function () {
    // $('#lnr-next-button-tab-basic-info').prop('disabled', true);

});

function validateField(input_id, text_id) {
    if ($(input_id).parent().hasClass('is-invalid') || $(input_id).val().length == 0) {
        $(input_id).parent().addClass('is-invalid');
        $(input_id).closest("div").find("label").addClass('text-invalid');
        $(text_id + '-info-validation').removeClass('hidden');
    } else {
        $(input_id).closest("div").find("label").removeClass('text-invalid');
        $(text_id + '-info-validation').addClass('hidden');
    }
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
