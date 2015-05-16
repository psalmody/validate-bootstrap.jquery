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
* Validates input :text, :checkbox, :radio, select and textarea
* Follows HTML5 required attribute.
* Defines error messages and minimum lengths through data- attributes
* Uses native Bootstrap 3 styling for displaying errors messages

##Usage

Initiate the validator with
```
$('form').validator({options});
```
Once initiated, will allow `$.valid();` on form items and add `$.validate()` to form object.

Default options:
```
{
    validateSelecters:'input:text,select,textarea',
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
}
```

* validateSelecters: jQuery-style selecters to validate
* radio: validate radio buttons, true/false
* checkbox: validate checkboxes, true/false
* formGroupErrorClass: error class to assign to form-group
* helpBlockClass: classes to assign to help-block
* dataLength: data-* attribute to specify length. data-min-length by default
* dataErrorMsg: data-* attribute to specify error message. data-error-msg by default
* defaultMsg: default error message
* validHandlers: custom error handler functions. see section on errorHandlers below
* validOnBlur: validate form-control onBlur, true/false
* validOnKeyUp: validate form-control onKeyUp, true/false
* validRadioCheckOnClick: validate radio / checkboxes when clicked
* alert: false or string. The message to alert() user when $.validate()

##Basic Example

```
//initiate validator
$('form').validator();

//check valid before submitting
$('form').submit(function(e) {
    e.preventDefault();


    if ($('form').validate('check') < 1) {
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
Add `data-error-msg="custom error message"` or `data-min-length="3"` if desired.

To make a radio or checkbox group required:

1. Assign `name` attribute properly to all items in the group.
2. Add `required` and `data-error-msg` attributes to first radio or checkbox in group.
3. Message will be appended to parent form-group of first item.

##Custom Valid Handler

Create a custom handler by adding it to the validHandlers object while initiating
`$.validator()` Return `true` if valid.

```
$.validator({
    validHandlers: {
        "form-control_id":function(input) {
            return $(input).val() == 'Validator Bootstrap' ? true : false;
        }
    }
})
```
