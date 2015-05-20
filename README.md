#validate-bootstrap.jquery

##Validation Plugin for Bootstrap 3 and jQuery

jQuery plugin for Bootstrap to validate form

v 0.8.2

written by Michael A Smith
May 12 2015

##Requires:
* Bootstrap 3 (tested with 3.3.4)
* jQuery (tested with 1.11.1)

##Features
* Validates input[type=text,checkbox,radio,email (regex for format),number], select and textarea
* Follows HTML5 required, min attribute.
* Defines error messages through data- attributes
* Uses native Bootstrap 3 styling for displaying errors messages

##Usage

Initiate the validator with
```
$('form').validator({options});
```
Once initiated, will add `$.fn.valid()` plugin for use on form controls.

Default options:
```
{
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
}
```

* alert: false or string. The message to alert() user when `.validator('check')`
* checkbox: validate checkboxes, true/false
* dataErrorMsg: data-* attribute to specify error message. data-error-msg by default
* defaultMsg: default error message
* formGroupErrorClass: error class to assign to form-group
* helpBlockClass: classes to assign to help-block
* radio: validate radio buttons, true/false
* validateSelecters: jQuery selecters for inputs to validate (not radio, checkbox. use radio and checkbox options)
* validHandlers: custom error handler functions. see section on errorHandlers below
* validOnBlur: validate form-control onBlur, true/false
* validOnKeyUp: validate form-control onKeyUp, true/false
* validRadioCheckOnClick: validate radio / checkboxes when clicked

##Basic Example

```
//initiate validator
$('form').validator();

//check valid before submitting
$('form').submit(function(e) {
    e.preventDefault();


    if ($('form').validator('check') < 1) {
        ...process submit...
    }
})
```

##HTML Markup, Radio & Checkboxes

*Form element must contain `novalidate` property.*

To make HTML element required, add the required attribute:
```
<input type="text" id="name" required>
```
Add `data-error-msg="custom error message"` or `min="3"` if desired.

To make a radio or checkbox group required:

1. Assign `name` attribute properly to all items in the group.
2. Add `required` and `data-error-msg` attributes to first radio or checkbox in group.
3. Message will be appended to parent form-group of first item.

##Custom Valid Handler

Create a custom handler by adding it to the validHandlers object while initiating
`.validator()` Return `true` if valid. Before returning true/false, formatting
could be done on the input value.

```
$('form').validator({
    validHandlers: {
        'customhandler':function(input) {
            //may do some formatting before validating
            $(input).val($(input).val().toUpperCase());
            return $(input).val() === 'JQUERY' ? true : false;
        }
    }
});
```
