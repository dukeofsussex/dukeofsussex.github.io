(function () {
    'use strict';

    var contactError = $('#contactError');
    var submitButton = $('#submitButton');
    var submittingButton = $('#submittingButton');
    var submittedButton = $('#submittedButton');

    $('a[href*="#"]')
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function (event) {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {

                // Figure out element to scroll to
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

                // Does a scroll target exist?
                if (target.length) {

                    // Only prevent default if animation is actually gonna happen
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 1000, function () {

                        // Callback after animation
                        // Must change focus!
                        var $target = $(target);
                        $target.focus();
                        if ($target.is(":focus")) { // Checking if the target was focused
                            return false;
                        }

                        $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                        $target.focus(); // Set focus again
                    });
                }
            }
        });

    $(window).on('activate.bs.scrollspy', function (e, obj) {
        if (obj.relatedTarget === '#home' || obj.relatedTarget === '#skills' || obj.relatedTarget === '#contact') {
            $('#navbar').css('background-color', '#323232');
        } else if (obj.relatedTarget === '#about' || obj.relatedTarget === '#projects') {
            $('#navbar').css('background-color', '#464646');
        }
    });

    submitButton.click(function (event) {
        event.preventDefault();
        contactError.hide();
        var form = $('form[name="contact"]');
        var formValues = form.serializeArray();

        for (var i = 0; i < formValues.length; i++) {
            if (formValues[i].value.trim() == '' || !$('#agree').prop('checked')) {
                form[0].classList.add('was-validated');
                return;
            }
        }

        form[0].classList.remove('was-validated');

        submitButton.hide();
        submittingButton.show();

        fetch('https://contact.intruder-db.info', {
            method: 'post',
            body: new FormData(form[0])
        }).then(function (res) {
            if (!res.ok) {
                throw res;
            }

            return res.json();
        }).then(function (res) {
            submittingButton.hide();
            submittedButton.show();
            $('#contactSuccess').text(res.message).show();
        }).catch(function (err) {
            err.json().then(errJson => {
                console.error(errJson.message);
                contactError.text(errJson.message).show();
                submittingButton.hide()
                submitButton.show();
            })
        });
    });
}());