'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errors = exports.errorMessageGenerator = undefined;

var _has = require('lodash/object/has');

var _has2 = _interopRequireDefault(_has);

var _validator = require('validator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var errorMessageGenerator = exports.errorMessageGenerator = function errorMessageGenerator(messages, validatorId, label, opts) {
  var validator = (0, _has2.default)(messages, validatorId) ? messages[validatorId] : messages.default;
  return validator(validatorId, label, opts);
};

var errors = exports.errors = {
  required: function required(validatorId, label, opts) {
    return label + ' is Required';
  },
  email: function email(validatorId, label, opts) {
    return label + ' should be a valid Email Address';
  },
  in: function _in(validatorId, label, opts) {
    return label + ' should be one of ' + opts.join(', ');
  },
  numeric: function numeric(validatorId, label, opts) {
    return label + ' should only contain numbers';
  },
  int: function int(validatorId, label, opts) {
    opts = opts || {};

    if ((0, _validator.isInt)(opts.min) && (0, _validator.isInt)(opts.max)) {
      return label + ' should be between ' + opts.min + ' and ' + opts.max;
    }

    if ((0, _validator.isInt)(opts.min)) {
      return label + ' should be at least ' + opts.min;
    }

    if ((0, _validator.isInt)(opts.max)) {
      return label + ' should be at most ' + opts.max;
    }

    // otherwise message should just require integer value
    return label + ' should be an Number';
  },
  date: function date(validatorId, label, opts) {
    return label + ' should be a Date';
  },
  before: function before(validatorId, label, opts) {
    if (opts) {
      return label + ' should be ' + validatorId + ' ' + opts.toString();
    }

    return label + ' should be ' + validatorId + ' Current Time';
  },
  after: function after(validatorId, label, opts) {
    if (opts) {
      return label + ' should be ' + validatorId + ' ' + opts.toString();
    }

    return label + ' should be ' + validatorId + ' Current Time';
  },
  length: function length(validatorId, label, opts) {
    opts = opts || {};

    if ((0, _validator.isInt)(opts.min) && (0, _validator.isInt)(opts.max)) {
      return label + ' should be a minimum of ' + opts.min + ' and a maximum of ' + opts.max + ' characters';
    }

    if ((0, _validator.isInt)(opts.min)) {
      return label + ' should be a minimum of ' + opts.min + ' characters';
    }

    if ((0, _validator.isInt)(opts.max)) {
      return label + ' should be a maximum of ' + opts.max + ' characters';
    }

    return label + ' is an Invalid length';
  },
  URL: function URL(validatorId, label, opts) {
    return label + ' should be a valid URL';
  },
  default: function _default(validatorId, label, opts) {
    return label + ' is Invalid';
  }
};