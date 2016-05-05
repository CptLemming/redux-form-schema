'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _each = require('lodash/collection/each');

var _each2 = _interopRequireDefault(_each);

var _merge = require('lodash/object/merge');

var _merge2 = _interopRequireDefault(_merge);

var _startCase = require('lodash/string/startCase');

var _startCase2 = _interopRequireDefault(_startCase);

var _isFunction = require('lodash/lang/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isUndefined = require('lodash/lang/isUndefined');

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _isString = require('lodash/lang/isString');

var _isString2 = _interopRequireDefault(_isString);

var _errorMessages = require('./error-messages');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (schema) {
  var customErrorMessages = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var fields = Object.keys(schema);
  var errorMessages = (0, _merge2.default)(_errorMessages.errors, customErrorMessages);
  var validate = buildValidationFn(schema, errorMessages);
  return {
    fields: fields,
    validate: validate,
    errors: errorMessages
  };
};

function buildValidationFn(schema, errorMessages) {
  return function (formValues) {
    var errors = {};

    if (!formValues) {
      return errors;
    }

    // TODO this could possibly be done with lodash transform
    (0, _each2.default)(schema, function (definition, fieldRef) {
      var label = definition.label;
      var required = definition.required;
      var type = definition.type;
      var validate = definition.validate;
      var error = definition.error;

      var fieldValue = formValues[fieldRef];
      var fieldValueExists = isDefined(formValues[fieldRef]);

      // required is active if it is `true` or a function that returns
      // true when passed the form values as an argument. This allows
      // you to perform conditional requires based on other values in
      // the form
      var isRequired = required && required === true || (0, _isFunction2.default)(required) && required(formValues);

      // validate required
      if (isRequired && !fieldValueExists) {
        var message = error || (0, _errorMessages.errorMessageGenerator)(errorMessages, 'required', label);
        addErrorToField(errors, fieldRef, message);
      }

      // validate simple type validators
      if (fieldValueExists && type && !validates(type, fieldValue)) {
        // use custom error message or fallback to default
        var _message = error || (0, _errorMessages.errorMessageGenerator)(errorMessages, type, label);
        addErrorToField(errors, fieldRef, _message);
      }

      // validate complex validations
      if (validate) {

        // only validate if rule doesnt exist, or rule exists and the
        // function returns true when passed formValues

        (0, _each2.default)(validate, function (opts, id) {
          // TODO support array of validate's which will allow multiple
          // rule based validations

          // skip validation if we have no field value
          if (!fieldValueExists) {
            return;
          }

          var isValid = void 0;
          var customValidator = (0, _isFunction2.default)(opts) && opts;

          if (customValidator) {
            isValid = customValidator(formValues, fieldValue);
          } else {
            isValid = validates(id, fieldValue, opts);
          }

          if (!isValid) {
            // use custom error message or fallback to default
            var _message2 = error || (0, _errorMessages.errorMessageGenerator)(errorMessages, id, label, opts);
            addErrorToField(errors, fieldRef, _message2);
          }
        });
      }
    });

    return errors;
  };
}

function addErrorToField(errors, fieldRef, errorMessage) {
  errors[fieldRef] = errors[fieldRef] || [];
  errors[fieldRef].push(errorMessage);
}

// Get validator by string (the part after 'is' in validator methods)
// validatorId = 'email' => validator.isEmail
// validatorId = 'date' => validator.isDate
// validatorId = 'creditCard' => validator.isCreditCard
function getValidator(validatorId) {
  var validatorIdInStartCase = (0, _startCase2.default)(validatorId);
  var validatorFn = _validator2.default['is' + validatorIdInStartCase];
  return validatorFn;
}

/**
 * run a validator with value and options
 * @param {String} validatorId the id of `validator` method
 * @param {String} value to run against validator
 * @param {Mixed} ...opts if applicable
 */
function validates(validatorId, value, opts) {
  var validatorFn = getValidator(validatorId);
  if (!validatorFn) {
    return console.warn('Missing validator for \'' + validatorId + '\'');
  }

  switch (validatorId) {
    case 'length':
      // isLength is a case where we don't follow the API of
      // validator.js which accepts two arguments for length that
      // doesn't play nice with a single object definition (like in
      // our schemas). This also is consistent with how min/max is
      // defined in the isInt validator
      return validatorFn(value, opts.min, opts.max);
    default:
      return validatorFn(value, opts);
  }
}

function isDefined(value) {
  return typeof value !== 'undefined' && String(value).length > 0;
}