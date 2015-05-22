/**
validate-bootstrap.jquery.js v 0.9
https://github.com/psalmody/validate-bootstrap.jquery
**/
;(function ( $ ) {

    $.fn.validator = function( options, value ) {
        var self = this;
        var validator = $.fn.validator;
        var options_obj = typeof (options) == 'string' ? {} : options;

        this.attr('novalidate','novalidate');

        // extend defaults, existing settings (to save state)
        //   and passed options. validateSelecters
        validator.settings = $.extend({},{
            alert: 'The form has some invalid fields. Please review.',
            checkbox: true,
            dataErrorMsg:'error-msg',
            defaultMsg:'Required.',
            formGroupErrorClass:'has-error',
            helpBlockClass:'help-block with-errors',
            radio: true,
            validateSelecters:'input[type="text"],input[type="email"],input[type="number"],select,textarea',
            validHandlers: {},
            validOnBlur: true,
            validOnKeyUp: false,
            validRadioCheckOnClick: true
        },validator.settings,options_obj);

        var settings = validator.settings;

        //  define function to validate entire form
        //  creates a collection of jQuery objects to run .valid() on
        var validate = function() {

            var errors = 0;
            var validobjs = $();
            var names = [];

            // if checking checkbox and radio, only select first object in
            // name group (only validate each group once)
            if (settings.checkbox) {
                $('input:checkbox').each(function() {
                    if (names.indexOf($(this).prop('name'))) {
                        names.push($(this).prop('name'));
                    }
                })
            }
            if (settings.radio) {
                $('input:radio').each(function() {
                    if (names.indexOf($(this).prop('name'))) {
                        names.push($(this).prop('name'));
                    }
                })
            }
            // add radio / checkbox items to collection
            $.each(names,function(i) {
                validobjs = validobjs.add(self.find('input[name="'+names[i]+'"]').eq(0));
            })
            // add everything else
            validobjs = validobjs.add(self.find(settings.validateSelecters));
            // validate each obj, count errors
            $.each(validobjs,function() {
                if ($(this).valid() != true) {
                    errors++;
                }
            })

            // alert if errors
            if (errors > 0 && settings.alert) {
                alert(settings.alert);
            }

            // return error count
            validator.lastcheckerrors = errors;
            return errors;

        }

        // handling for running .validator() with string options
        if ( typeof(options) == 'string') {
            switch (options) {
                // check = validate entire form
                case 'check':
                    return validate();
                    break;
                // errors = return last error check
                case 'errors':
                    return validator.lastcheckerrors;
                // options = return current settings
                case 'options':
                    return validator.settings;
                // otherwise, set an option with .validator('option-name','value')
                default:
                    if (validator.settings.hasOwnProperty(options)) {
                        validator.settings[options] = value
                        return true;
                    } else {
                        return 'option not found';
                    }
            }
        }

        // define .valid() with existing settings
        $.extend($.fn,{
            valid: function() {
                var settings = validator.settings;
                var id = this.prop('id');
                var required = this.prop('required') ? true : false;
                var min = isNaN(parseInt(this.prop('min'))) ? 1 : parseInt(this.prop('min'));
                var msg = typeof(this.data(settings.dataErrorMsg)) != 'undefined' ? this.data(settings.dataErrorMsg) : settings.defaultMsg;
                var formGroup = this.closest('.form-group');
                var type = this.prop('type');
                var helpBlockSelecter = '.'+settings.helpBlockClass.replace(' ','.');
                // functions for error display
                var makeErrors = function(message) {
                    message = typeof(message) == 'undefined' ? msg : message;
                    if (formGroup.find(helpBlockSelecter).length) formGroup.find(helpBlockSelecter).remove();
                    var helpBlock = $('<div class="'+settings.helpBlockClass+'"></div>').text(message);
                    formGroup.append(helpBlock);
                    formGroup.addClass('has-error');
                }
                var removeErrors = function(obj) {
                    obj = typeof(obj) == 'undefined' ? formGroup : obj;
                    obj.removeClass('has-error').find(helpBlockSelecter).remove();
                }
                // check for custom valid handler
                if (settings.validHandlers.hasOwnProperty(id)) {
                    if (!settings.validHandlers[id](this)) {
                        makeErrors();
                        return false;
                    };
                }
                // validate by type
                switch (type) {
                    // radio / checkbox is valid if at least one is checked
                    case "radio":
                    case "checkbox":
                        var name = this.prop('name');
                        var group = self.find('input[name="'+name+'"]');
                        var first = self.find('input[name="'+name+'"]').eq(0);
                        if (first.prop('required')) {
                            if (group.is(':checked')) {
                                removeErrors(first.closest('.form-group'));
                                return true;
                            } else {
                                msg = typeof(first.data(settings.dataErrorMsg)) != 'undefined' ? first.data(settings.dataErrorMsg) : settings.defaultMsg;
                                makeErrors(msg);
                                return false;
                            }
                        } else {
                            removeErrors();
                            return true;
                        }
                        break;
                    // check for valid e-mail formatting
                    case "email":
                        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        if(re.test(this.val())) {
                            removeErrors();
                            return true;
                        } else {
                            makeErrors(msg);
                            return false;
                        }
                        break;
                    // check if is a number - no commas allowed
                    case "number":
                        var v = this.val();
                        if (!isNaN(v) && isFinite(v) && v != '') {
                            removeErrors();
                            return true;
                        } else {
                            makeErrors(msg);
                            return false;
                        }
                        break;
                    // default - check if long enough
                    default:
                        var length = this.val() == null ? 0 : this.val().length;
                        if (required && length < min) {
                            makeErrors();
                            return false;
                        }
                }

                // remove errors if no error created above
                removeErrors();
                return true;
            },
        });

        // bind .valid() to blur event on form-control
        if (validator.settings.validOnBlur) {
            self.on('blur',validator.settings.validateSelecters,function() {
                $(this).valid();
            })
        }

        // bind .valid() on keyup on form-control
        if (validator.settings.validOnKeyUp) {
            self.on('keyup',validator.settings.validateSelecters,function() {
                $(this).valid();
            })
        }

        // bind .valid() on click for radio / checkboxes
        if (validator.settings.validRadioCheckOnClick) {
            $(self).on('click','input[type="checkbox"],input[type="radio"]',function() {
                $(this).valid();
            });
        }

        return this;
    }

}( jQuery ));
