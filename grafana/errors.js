'use strict';

var TypedError = require('error/typed');

var UnfulfilledRequirement = TypedError({
    type: 'grafana.errors.UnfulfilledRequirement',
    message: '{constructor} missing requirement: {unfulfilledArg}',
    unfulfilledArg: null
})
