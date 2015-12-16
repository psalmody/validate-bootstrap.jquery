# validate-bootstrap.jquery

## Validation Plugin for Bootstrap 3 and jQuery

jQuery plugin for Bootstrap to validate form

written by Michael A Smith
May 12 2015

## Requires:
* [Bootstrap 3](http://getbootstrap.com/) (tested with 3.3.4)
* [jQuery](https://jquery.com/) (tested with 1.11.1 & 2.1.4)

## Features
* Validates `input[type=text,checkbox,radio,email (regex for format),number]`, `select` and `textarea`
* Follows HTML5 required, min attribute.
* Defines error messages through data- attributes
* Uses native Bootstrap 3 styling for displaying errors messages

## Installation

Install with Bower:

```bash
bower install validate-bootstrap.jquery
```

Also with NPM:

```bash
npm install validate-bootstrap.jquery
```

## Usage

Initiate the validator with
```javascript
$('form').validator({options});
```
Once initiated, will add `$.fn.valid()` plugin for use on form controls.

Default options:

```javascript
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

## Basic Example

```javascript
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

## HTML Markup, Radio & Checkboxes

*Form element must contain `novalidate` property.*

To make HTML element required, add the required attribute:

```html
<input type="text" id="name" required>
```

Add `data-error-msg="custom error message"` or `min="3"` if desired.

To make a radio or checkbox group required:

1. Assign `name` attribute properly to all items in the group.
2. Add `required` and `data-error-msg` attributes to first radio or checkbox in group.
3. Message will be appended to parent form-group of first item.


##Custom Valid Handler

Custom valid handlers may be added by adding a function object to the `validHandlers`
setting. The function object should be identified by a jQuery selecter and will then
be applied to all inputs matching that selecter.

Return `true` if valid. Before returning true/false, formatting
could be done on the input value.

For example, with:

```html
<input type='text' class='customhandler form-control'>
```

Create a custom handler which changes the value to upper-case text and
checks to see if it equals "JQUERY".

```javascript
$("form").validator({
    validHandlers: {
        '.customhandler':function(input) {
            //may do some formatting before validating
            input.val(input.val().toUpperCase());
            //return true if valid
            return input.val() === 'JQUERY' ? true : false;
        }
    }
});
```

## Handling select2 and Bootstrap

In my experience, [select2](https://select2.github.io/) and [Bootstrap](http://getbootstrap.com/) don't play super well together.
Even with [select2-bootstrap-css](https://fk.github.io/select2-bootstrap-css/) there are still visibility issues.

A couple of hacks are required to make select2 and bootstrap work with this plugin.

* Make sure to include select2-boostrap-css in your project.
* Add the following styles to highlight the select2 input with errors:
```css
.form-group.has-error .select2-selection {
    border-color:#a94442;
}
```
* Add the following binding on select change event:
```javascript
$('select').on('change',function() {
    $(this).valid();
})
```
