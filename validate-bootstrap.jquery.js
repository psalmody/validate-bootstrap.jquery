/***************
written by Michael A Smith
May 12 2015

Requires: bootstrap, jquery

uses HTML required attribute,
data- tags and custom valid handlers

Initiate with .validator() on a jquery form
***************/

;(function ( $ ) {

    $.fn.validator = function( options ) {
        this.settings = $.extend({},{
            validateSelecters:'input:text,select,textarea',
            radio: true,
            checkbox: true,
            formGroupErrorClass:'has-error',
            helpBlockClass:'help-block with-errors',
            dataLength:'min-length',
            dataErrorMsg:'error-msg',
            defaultMsg:'Required.',
            errorHandlers: {},
            validOnBlur: true,
            validOnKeyUp: false,
            validRadioCheckOnClick: true,
            alert: 'The form has some invalid fields. Please review.'
        },options);

        var self = this;

        $.extend($.fn,{
            validatorsettings: function() {
                return self.settings;
            },
            validate: function() {
                var settings = self.settings;
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

                return errors;

            },
            valid: function() {
                var settings = self.settings;
                var id = $(this).prop('id');
                var required = $(this).prop('required') ? true : false;
                var min = typeof($(this).data(settings.dataLength)) != 'undefined' ? $(this).data(settings.dataLength) : 1;
                var msg = typeof($(this).data(settings.dataErrorMsg)) != 'undefined' ? $(this).data(settings.dataErrorMsg) : settings.defaultMsg;
                var formGroup = $(this).closest('.form-group');
                var makeErrors = function(message) {
                    message = typeof(message) == 'undefined' ? msg : message;
                    var helpBlock = formGroup.find('.'+settings.helpBlockClass.replace(' ','.')).length > 0 ? $(this).closest('.form-group').find(settings.helpBlockSelecter) : false;
                    if (!helpBlock) {
                        helpBlock = $('<div class="'+settings.helpBlockClass+'"></div>');
                        formGroup.append(helpBlock);
                    }
                    helpBlock.text(message);
                    formGroup.addClass('has-error')
                }
                var removeErrors = function(obj) {
                    obj = typeof(obj) == 'undefined' ? formGroup : obj;
                    obj.removeClass('has-error');
                }
                if (settings.errorHandlers.hasOwnProperty(id)) {
                    if (!settings.errorHandlers[id]($(this))) {
                        makeErrors();
                        return false;
                    };
                }
                if ($(this).prop('type') == 'radio' || $(this).prop('type') == 'checkbox') {
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

        if (self.settings.validOnBlur) {
            self.on('blur',self.settings.validateSelecters,function() {
                $(this).valid();
            })
        }

        if (self.settings.validOnKeyUp) {
            self.on('keyup',self.settings.validateSelecters,function() {
                $(this).valid();
            })
        }

        if (self.settings.validRadioCheckOnClick) {
            $(self).on('click','input[type="checkbox"],input[type="radio"]',function() {
                $(this).valid();
            });
        }

        return this;
    }

}( jQuery ));
