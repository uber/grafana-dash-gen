// Copyright (c) 2015 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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

var ApiError = TypedError({
    type: 'grafana.errors.ApiError',
    message: 'Some error happened trying to use grafana API: {reason} - {apiCall} - code: {code}',
    apiCall: null,
    reason: null,
    code: null
});

var NoFolderException = TypedError({
    type: 'grafana.errors.NoFolderException',
    message: 'Folder {folder} doesn\'t exists, please create it through grafana interface',
    folder: null
});

module.exports = {
    UnfulfilledRequirement: UnfulfilledRequirement,
    InvalidState: InvalidState,
    Misconfigured: Misconfigured,
    ApiError: ApiError,
    NoFolderException: NoFolderException
};
