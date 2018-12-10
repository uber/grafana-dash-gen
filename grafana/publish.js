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
var request = require('request');
var config = require('./config');
var errors = require('./errors');

/* eslint-disable max-statements, max-len, no-console, no-undef */
function publish(dashboard, opts) {
    opts = opts || {};

    if (!dashboard) {
        throw errors.UnfulfilledRequirement({
            component: 'grafana.publish',
            unfulfilledArg: 'dashboard'
        });
    }

    var state = dashboard.state;
    var cfg = config.getConfig();

    if (!state || !state.title) {
        throw errors.InvalidState({
            component: 'grafana.Dashboard',
            invalidArg: 'title',
            reason: 'undefined'
        });
    }

    if (!cfg.url) {
        throw errors.Misconfigured({
            invalidArg: 'url',
            reason: 'undefined',
            resolution: 'Must call grafana.configure before publishing'
        });
    }

    if (!cfg.token) {
        throw errors.Misconfigured({
            invalidArg: 'token',
            reason: 'Token is required for API utilization'
        });
    }

    var createData = {
        dashboard: dashboard.generate(),
        folderId: dashboard.getFolderId(opts),
        overwrite: true
    };

    request({
        url: cfg.url + '/api/dashboards/db/',
        method: 'POST',
        json: createData,
        headers: {
            "Authorization": "Bearer " + cfg.token
        },
        timeout: opts.timeout || 1000
    }, function createResponseHandler(createErr, createResp) {
        if (createErr) {
            console.log('Unable to publish dashboard: ' + createErr);
        } else if ([200, 201].indexOf(createResp.statusCode) === -1) {
            console.log('Unable to publish dashboard ' + state.title);
            console.log('Got statusCode' + createResp.statusCode);
        } else {
            console.log('Published the dashboard ' + state.title);
        }
    });
}
/* eslint-enable */

module.exports = publish;
