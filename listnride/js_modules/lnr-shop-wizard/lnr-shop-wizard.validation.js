$(function () {
    $('#user-info-validation').addClass('hidden');
    $('#user-info').on('click', function () {
        $('#user-info-validation').toggleClass('hidden', $('#user-info md-input-container.is-invalid').length == 0)
    })
});

$(function () {
    $('#payment-info-validation').addClass('hidden');
    $('#sp-payment-form .mdl-grid').on('click', function () {
        $('#payment-info-validation').toggleClass('hidden', $('#sp-payment-form md-input-container.is-invalid').length == 0);
        $('#payment-info-validation').toggleClass('hidden', $('#sp-payment-form md-input-container.is-invalid').length == 0);
    });

    // $('#lnr-payment-date-button').on('change', function () {
    //     $('#payment-info-validation').toggleClass('hidden', $('#lnr-payment-date-button').text() != "Month" );
    // });
    // $('#lnr-payment-year-button').on('change', function () {
    //     $('#payment-info-validation').toggleClass('hidden', $('#lnr-payment-year-button').text() != "Year" );
    // });
});

MaterialTextfield.prototype.checkValidity = function () {
    if (this.input_.validity.valid) {
        this.element_.classList.remove(this.CssClasses_.IS_INVALID);
    } else {
        if (this.element_.getElementsByTagName('input')[0].value.length > 0) {
            this.element_.classList.add(this.CssClasses_.IS_INVALID);
        }
    }
};
