(function($) {

  $.fn.validator = function(options) {
    var $self = this;
    var validator = $.fn.validator;
    //var options_obj = typeof (options) == 'string' ? {} : options;
    var settings = validator.settings;

    validator._init = function(options) {
      //stop Chrome and other HTML5 compliant browsers from doing their own validation
      $self.attr('novalidate', 'novalidate');

      // extend defaults, existing settings (to save state)
      //   and passed options.
      validator.settings = $.extend({}, {
        alert: 'The form has some invalid fields. Please review.',
        checkbox: true,
        dataErrorMsg: 'error-msg',
        defaultMsg: 'Required.',
        formGroupErrorClass: 'has-error',
        helpBlockClass: 'help-block with-errors',
        radio: true,
        validateSelecters: 'input[type="text"],input[type="email"],input[type="number"],select,textarea',
        validHandlers: {},
        validOnBlur: true,
        validOnKeyUp: false,
        validRadioCheckOnClick: true
      }, validator.settings, options);

      // define .valid() with existing settings
      $.extend($.fn, {
        valid: function() {
          var self = this;
          var settings = validator.settings;
          var id = this.prop('id');
          var required = this.prop('required') ? true : false;
          var min = isNaN(parseInt(this.prop('min'))) ? 1 : parseInt(this.prop('min'));
          var msg = typeof(this.data(settings.dataErrorMsg)) != 'undefined' ? this.data(settings.dataErrorMsg) : settings.defaultMsg;
          var formGroup = this.closest('.form-group');
          var type = this.prop('type');
          var helpBlockSelecter = '.' + settings.helpBlockClass.replace(' ', '.');
          // functions for error display
          var makeErrors = function(message) {
            message = typeof(message) == 'undefined' ? msg : message;
            if (formGroup.find(helpBlockSelecter).length) formGroup.find(helpBlockSelecter).remove();
            var helpBlock = $('<div class="' + settings.helpBlockClass + '"></div>').html(message);
            formGroup.append(helpBlock);
            formGroup.addClass('has-error');
          };
          var removeErrors = function(obj) {
            obj = typeof(obj) == 'undefined' ? formGroup : obj;
            obj.removeClass('has-error').find(helpBlockSelecter).remove();
          };
          // check for custom valid handler
          var customvalid = true;
          $.each(settings.validHandlers, function(k, v) {
            if (self.is(k)) {
              if (!v(self)) {
                customvalid = false;
                makeErrors();
                return false;
              }
            }
          });
          //if customvalid handle returned false, exit as false, else continue
          if (!customvalid) {
            return false;
          }
          //if hidden, skip this field
          if (this.is(':hidden')) return true;
          // validate by type
          switch (type) {
            // radio / checkbox is valid if at least one is checked
            case "radio":
            case "checkbox":
              var name = this.prop('name');
              var group = $self.find('input[name="' + name + '"]');
              var first = $self.find('input[name="' + name + '"]').eq(0);
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
              if (re.test(this.val())) {
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
              if (!isNaN(v) && isFinite(v) && v !== '') {
                removeErrors();
                return true;
              } else {
                makeErrors(msg);
                return false;
              }
              break;
              // default - check if long enough
            default:
              var length = this.val() === null ? 0 : this.val().length;
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



      return true;
    };

    //initiate first time, no need to define validate
    if (!validator.isinit) {
      validator.isinit = validator._init(options);
    }



    //  define function to validate entire form
    //  creates a collection of jQuery objects to run .valid() on
    var validate = function() {

      var errors = 0;
      var validobjs = $();
      var names = [];

      // if checking checkbox and radio, only select first object in
      // name group (only validate each group once)
      if (settings.checkbox) {
        $self.find('input:checkbox').each(function() {
          if (names.indexOf($(this).prop('name'))) {
            names.push($(this).prop('name'));
          }
        });
      }
      if (settings.radio) {
        $self.find('input:radio').each(function() {
          if (names.indexOf($(this).prop('name'))) {
            names.push($(this).prop('name'));
          }
        });
      }
      // add radio / checkbox items to collection
      $.each(names, function(i) {
        validobjs = validobjs.add($self.find('input[name="' + names[i] + '"]').eq(0));
      });
      // add everything else
      validobjs = validobjs.add($self.find(settings.validateSelecters));

      // validate each obj, count errors
      $.each(validobjs, function() {
        if ($(this).valid() !== true) errors++;
      });

      // alert if errors
      if (errors > 0 && settings.alert) alert(settings.alert);

      //cleanup any messages left
      if (errors == 0) $('.form-group.has-error').removeClass('has-error').find('.help-block.with-errors').remove();

      // return error count
      validator.lastcheckerrors = errors;
      return errors;

    };

    // handling for running .validator() to change options
    if (typeof(options) == 'string') {
      switch (options) {
        // check = validate entire form
        case 'check':
          return validate();
          // errors = return last error check
        case 'errors':
          return validator.lastcheckerrors;
          // options = return current settings
        case 'options':
          return validator.settings;
      }
    }

    // bind .valid() to blur event on form-control
    if (validator.settings.validOnBlur) {
      $self.on('blur', validator.settings.validateSelecters, function() {
        $(this).valid();
      });
    }

    // bind .valid() on keyup on form-control
    if (validator.settings.validOnKeyUp) {
      $self.on('keyup', validator.settings.validateSelecters, function() {
        $(this).valid();
      });
    }

    // bind .valid() on click for radio / checkboxes
    if (validator.settings.validRadioCheckOnClick) {
      $self.on('click', 'input[type="checkbox"],input[type="radio"]', function() {
        $(this).valid();
      });
    }



    return $self;
  };

}(jQuery));
