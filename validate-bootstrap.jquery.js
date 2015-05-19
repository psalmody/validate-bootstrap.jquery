/**
validate-bootstrap.jquery.js v 0.8.2
https://github.com/psalmody/validate-bootstrap.jquery
**/
;(function ( $ ) {

    $.fn.validator = function( options, value ) {
        var self = this;
        var validator = $.fn.validator;
        var options_obj = typeof (options) == 'string' ? {} : options;

        this.attr('novalidate','novalidate');

        validator.settings = $.extend({},{
            validateSelecters:'input[type="text"],input[type="email"],select,textarea',
            radio: true,
            checkbox: true,
            formGroupErrorClass:'has-error',
            helpBlockClass:'help-block with-errors',
            dataLength:'min-length',
            dataErrorMsg:'error-msg',
            defaultMsg:'Required.',
            validHandlers: {},
            validOnBlur: true,
            validOnKeyUp: false,
            validRadioCheckOnClick: true,
            alert: 'The form has some invalid fields. Please review.'
        },validator.settings,options_obj);

        var settings = validator.settings;

        var validate = function() {

            var errors = 0;
            var validobjs = $();
            var names = [];

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

            $.each(names,function(i) {
                validobjs = validobjs.add(self.find('input[name="'+names[i]+'"]').eq(0));
            })

            validobjs = validobjs.add(self.find(settings.validateSelecters));

            $.each(validobjs,function() {
                if ($(this).valid() != true) {
                    errors++;
                }
            })

            if (errors > 0 && settings.alert) {
                alert(settings.alert);
            }

            validator.lastcheckerrors = errors;
            return errors;

        }

        if ( typeof(options) == 'string') {
            switch (options) {
                case 'check':
                    return validate();
                    break;
                case 'errors':
                    return validator.lastcheckerrors;
                case 'options':
                    return validator.settings;
                default:
                    if (validator.settings.hasOwnProperty(options)) {
                        validator.settings[options] = value
                        return true;
                    } else {
                        return 'option not found';
                    }
            }
        }


        $.extend($.fn,{
            valid: function() {
                var settings = validator.settings;
                var id = $(this).prop('id');
                var required = $(this).prop('required') ? true : false;
                var min = typeof($(this).data(settings.dataLength)) != 'undefined' ? $(this).data(settings.dataLength) : 1;
                var msg = typeof($(this).data(settings.dataErrorMsg)) != 'undefined' ? $(this).data(settings.dataErrorMsg) : settings.defaultMsg;
                var formGroup = $(this).closest('.form-group');
                var type = $(this).prop('type');
                var helpBlockSelecter = '.'+settings.helpBlockClass.replace(' ','.');
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
                if (settings.validHandlers.hasOwnProperty(id)) {
                    if (!settings.validHandlers[id]($(this))) {
                        makeErrors();
                        return false;
                    };
                }
                switch (type) {
                    case "radio":
                    case "checkbox":
                        var name = $(this).prop('name');
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
                    case "email":
                        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        if(re.test($(this).val())) {
                            removeErrors();
                            return true;
                        } else {
                            makeErrors(msg);
                            return false;
                        }
                        break;
                }

                var length = $(this).val() == null ? 0 : $(this).val().length;
                if (required && length < min) {
                    makeErrors();
                    return false;
                }

                removeErrors();
                return true;
            },
        });

        if (validator.settings.validOnBlur) {
            self.on('blur',validator.settings.validateSelecters,function() {
                $(this).valid();
            })
        }

        if (validator.settings.validOnKeyUp) {
            self.on('keyup',validator.settings.validateSelecters,function() {
                $(this).valid();
            })
        }

        if (validator.settings.validRadioCheckOnClick) {
            $(self).on('click','input[type="checkbox"],input[type="radio"]',function() {
                $(this).valid();
            });
        }

        return this;
    }

}( jQuery ));
