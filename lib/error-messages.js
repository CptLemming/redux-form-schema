import has from 'lodash/object/has'
import { isInt } from 'validator'

export const errorMessageGenerator = (messages, validatorId, label, opts) => {
  const validator = has(messages, validatorId) ? messages[validatorId] : messages.default;
  return validator(validatorId, label, opts);
};

export const errors = {
  required: (validatorId, label, opts) => {
    return `${label} is Required`
  },
  email: (validatorId, label, opts) => {
    return `${label} should be a valid Email Address`
  },
  in: (validatorId, label, opts) => {
    return `${label} should be one of ${opts.join(', ')}`
  },
  numeric: (validatorId, label, opts) => {
    return `${label} should only contain numbers`
  },
  int: (validatorId, label, opts) => {
    opts = opts || {}

    if (isInt(opts.min) && isInt(opts.max)) {
      return `${label} should be between ${opts.min} and ${opts.max}`
    }

    if (isInt(opts.min)) {
      return `${label} should be at least ${opts.min}`
    }

    if (isInt(opts.max)) {
      return `${label} should be at most ${opts.max}`
    }

    // otherwise message should just require integer value
    return `${label} should be an Number`
  },
  date: (validatorId, label, opts) => {
    return `${label} should be a Date`
  },
  before: (validatorId, label, opts) => {
    if (opts) {
      return `${label} should be ${validatorId} ${opts.toString()}`
    }

    return `${label} should be ${validatorId} Current Time`
  },
  after: (validatorId, label, opts) => {
    if (opts) {
      return `${label} should be ${validatorId} ${opts.toString()}`
    }

    return `${label} should be ${validatorId} Current Time`
  },
  length: (validatorId, label, opts) => {
    opts = opts || {}

    if (isInt(opts.min) && isInt(opts.max)) {
      return `${label} should be a minimum of ${opts.min} and a maximum of ${opts.max} characters`
    }

    if (isInt(opts.min)) {
      return `${label} should be a minimum of ${opts.min} characters`
    }

    if (isInt(opts.max)) {
      return `${label} should be a maximum of ${opts.max} characters`
    }

    return `${label} is an Invalid length`
  },
  URL: (validatorId, label, opts) => {
    return `${label} should be a valid URL`
  },
  default: (validatorId, label, opts) => {
    return `${label} is Invalid`
  }
};
