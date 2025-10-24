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

import fetch = require('node-fetch');
import config = require('./config');
import errors = require('./errors');

function publish(dashboard, opts: any = {}) {
    if (!dashboard) {
        throw errors.UnfulfilledRequirement.create(
            '{component} missing requirement: {unfulfilledArg}',
            {
                component: 'grafana.publish',
                unfulfilledArg: 'dashboard',
            }
        );
    }

    const state = dashboard.state;
    const cfg = config.getConfig();

    if (!state || !state.title) {
        throw errors.InvalidState.create(
            '{component} state is invalid: state.{invalidArg} {reason}',
            {
                component: 'grafana.Dashboard',
                invalidArg: 'title',
                reason: 'undefined',
            }
        );
    }

    if (!cfg.url) {
        throw errors.Misconfigured.create(
            'Incorrect configuration: config.{invalidArg} {reason} - {resolution}',
            {
                invalidArg: 'url',
                reason: 'undefined',
                resolution: 'Must call grafana.configure before publishing',
            }
        );
    }

    if (!cfg.cookie) {
        throw errors.Misconfigured.create(
            'Incorrect configuration: config.{invalidArg} {reason} - {resolution}',
            {
                invalidArg: 'cookie',
                reason: 'undefined',
            }
        );
    }

    const headers = new fetch.Headers(cfg.headers || {});
    headers.set('Cookie', cfg.cookie);
    headers.set('Content-Type', 'application/json');

    const createData = {
        dashboard: dashboard.generate(),
        overwrite: true,
    };

    return fetch(cfg.url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(createData),
        timeout: opts.timeout || 1000,
    })
        .then((resp) => {
            if (resp.ok) {
                console.log('Published the dashboard', state.title);
                return resp.text();
            } else {
                throw errors.ResponseError.create('request failed: {name}', {
                    name: resp.statusText,
                    response: resp,
                });
            }
        })
        .catch((e) => {
            console.log(
                'grafana-dash-gen: publish: caught error: ',
                e.name,
                e.message
            );
            console.log('Unable to publish dashboard ', state.title);
            if (e.response) {
                console.log(
                    'response headers: ',
                    e.response && e.response.headers.raw()
                );
                console.log('response body: ', e.response && e.response.text());
                console.log(
                    'response statusCode:',
                    e.response && e.response.status
                );
            }
            throw e; // rethrow for downstream consumers
        });
}

export = publish;
