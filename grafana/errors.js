'use strict';
var TypedError = require('error/typed');

var UnfulfilledRequirement = TypedError({
    type: 'grafana.errors.UnfulfilledRequirement',
    message: '{component} missing requirement: {unfulfilledArg}',
    component: null,
    unfulfilledArg: null
});

var InvalidState = TypedError({
    type: 'grafana.errors.InvalidState',
    message: '{component} state is invalid: state.{invalidArg} {reason}',
    component: null,
    invalidArg: null,
    reason: null
});

var Misconfigured = TypedError({
    type: 'grafana.errors.Misconfigured',
    message: 'Incorrect configuration: config.{invalidArg} {reason} - {resolution}',
    invalidArg: null,
    reason: null,
    resolution: 'Must call grafana.configure before publishing'
});

module.exports = {
    UnfulfilledRequirement: UnfulfilledRequirement,
    InvalidState: InvalidState,
    Misconfigured: Misconfigured
};
