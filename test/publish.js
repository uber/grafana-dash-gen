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
const nock = require('nock');
const test = require('tape');
const config = require('../grafana/config');
const publish = require('../grafana/publish');
const Dashboard = require('../grafana/dashboard');
const ExternalLink = require('../grafana/external-link');

// configuration values, held constant for assertions
const baseUrl = 'http://awesome.com';
const url = [baseUrl, 'dashboard'].join('/');
const cookie = 'auth=foo';
const headers = { asdf: ['qwer'] };
const title = 'Test Dashboard';
const tags = ['tag1', 'tag2'];
const refresh = '1m';
const templateconst1 = {
    name: 'myconst1',
    options: ['a', 'b'],
};
const templateconst2 = {
    name: 'marconst2',
    options: [0, 1, 2, 3, 4],
};
const annotation1 = {
    name: 'myAnnotation1',
    target: 'my.annotation.target.1',
};

const externalLinks = [
    new ExternalLink({
        title: 'Uber Home Page',
        url: 'www.uber.com',
    }),
];

const dashboard = new Dashboard({
    title: title,
    tags: tags,
    refresh: refresh,
    templating: [templateconst1, templateconst2],
    annotations: [annotation1],
    links: externalLinks,
});

test('Publish dashboard - requires dashboard', function (t) {
    t.throws(function assertThrows() {
        config.configure();
        publish();
    }, /UnfulfilledRequirement/);
    t.end();
});

test('Publish dashboard - invalid state', function (t) {
    t.throws(function assertThrows() {
        config.configure();
        publish({});
    }, /InvalidState/);
    t.end();
});

test('Publish dashboard - invalid title', function (t) {
    t.throws(function assertThrows() {
        config.configure();
        publish({
            state: {},
        });
    }, /InvalidState/);
    t.end();
});

test('Publish dashboard - misconfigured url', function (t) {
    t.throws(function assertThrows() {
        config.configure({
            cookie: cookie,
            url: null,
        });
        publish({
            state: {
                title: title,
            },
        });
    }, /Misconfigured/);
    t.end();
});

test('Publish dashboard - misconfigured cookie', function (t) {
    t.throws(function assertThrows() {
        config.configure({
            cookie: null,
            url: url,
        });
        publish({
            state: {
                title: title,
            },
        });
    }, /Misconfigured/);
    t.end();
});

test('Publish dashboard - default empty headers', function (t) {
    t.plan(1);
    config.configure({
        cookie: cookie,
        headers: null,
        url: url,
    });
    nock(baseUrl)
        .post('/dashboard')
        .reply(200, function createdHandler() {
            const headerType = typeof this.req.headers;
            t.equal(headerType, 'object');
        });
    publish(dashboard); // 200
});

test('Publish dashboard - client error', function (t) {
    t.plan(1);
    config.configure({
        cookie: cookie,
        url: url,
    });
    nock(baseUrl).post('/dashboard').reply(412, {
        status: 'version-mismatch',
        message: 'Version mismatch',
    });
    publish(dashboard).catch((e) => {
        t.equal(e.info().response.status, 412);
    });
});

test('Publish dashboard - client error (invalid)', function (t) {
    t.plan(1);
    config.configure({
        cookie: cookie,
        url: url,
    });
    nock(baseUrl).post('/dashboard').reply(400, { status: 'error' });
    publish(dashboard).catch((e) => {
        t.equal(e.info().response.status, 400);
    });
});

test('Publish dashboard - client error (n/a)', function (t) {
    t.plan(1);
    config.configure({
        cookie: cookie,
        url: url,
    });
    nock(baseUrl).post('/dashboard').reply(412, { status: 'error' });
    publish(dashboard).catch((e) => {
        t.equal(e.info().response.status, 412);
    });
});

test('Publish dashboard - bad response', function (t) {
    t.plan(1);
    config.configure({
        cookie: cookie,
        url: url,
    });
    nock(baseUrl).post('/dashboard').reply(200, 'foo');
    publish(dashboard).then((response) => {
        t.equal(response, 'foo');
    });
});

test('Publish dashboard - server unavailable', function (t) {
    t.plan(1);
    config.configure({
        cookie: cookie,
        url: 'http://111.111.111.111',
    });
    publish(dashboard).catch((e) => {
        t.equal(e.message, 'network timeout at: http://111.111.111.111/');
    });
});

test('Publish dashboard - server error', function (t) {
    t.plan(1);
    config.configure({
        cookie: cookie,
        url: url,
    });
    nock(baseUrl).post('/dashboard').reply(500);
    publish(dashboard).catch((e) => {
        t.equal(e.info().response.status, 500);
    });
});

test('Publish dashboard - success', function (t) {
    t.plan(2);
    config.configure({
        cookie: cookie,
        url: url,
    });
    const expectedBody = {
        dashboard: dashboard.generate(),
        overwrite: true,
    };
    // hijack the calls to elastic search, need to test both response codes
    // since the initial request will return a 201 and the subsequent will
    // return a 200.
    nock(baseUrl)
        .post('/dashboard')
        .reply(201, function createdHandler(uri, requestBody) {
            t.deepEqual(requestBody, expectedBody);
        })
        .post('/dashboard')
        .reply(200, function okHandler(uri, requestBody) {
            t.deepEqual(requestBody, expectedBody);
        });
    publish(dashboard) // 201
        .then(() => publish(dashboard)); // 200
});

test('Publish dashboard - success w/ custom timeout', function (t) {
    config.configure({
        cookie: cookie,
        url: url,
    });
    const expectedBody = {
        dashboard: dashboard.generate(),
        overwrite: true,
    };
    // hijack the calls to elastic search, need to test both response codes
    // since the initial request will return a 201 and the subsequent will
    // return a 200.
    nock(baseUrl)
        .post('/dashboard')
        .reply(201, function createdHandler(uri, requestBody) {
            t.deepEqual(requestBody, expectedBody);
        })
        .post('/dashboard')
        .reply(200, function okHandler(uri, requestBody) {
            t.deepEqual(requestBody, expectedBody);
            t.end();
        });
    publish(dashboard, {
        timeout: 2000,
    }) // 201
        .then(() =>
            publish(dashboard, {
                timeout: 2000,
            })
        ); // 200
});

test('Publish dashboard - passes headers', function (t) {
    config.configure({
        cookie: cookie,
        headers: headers,
        url: url,
    });
    // hijack the calls to elastic search, need to test both response codes
    // since the initial request will return a 201 and the subsequent will
    // return a 200.
    nock(baseUrl)
        .post('/dashboard')
        .reply(201, function createdHandler() {
            const reqHeaders = this.req.headers;
            Object.keys(headers).forEach(function (key) {
                t.deepEqual(reqHeaders[key], headers[key]);
            });
        })
        .post('/dashboard')
        .reply(200, function okHandler() {
            const reqHeaders = this.req.headers;
            Object.keys(headers).forEach(function (key) {
                t.deepEqual(reqHeaders[key], headers[key]);
            });
            t.end();
        });
    publish(dashboard) // 201
        .then(() => publish(dashboard)); // 200
});

test('Publish dashboard - follows redirect', (t) => {
    t.plan(1);
    const redirectBase = 'http://willredirect.com';
    config.configure({
        cookie: cookie,
        url: redirectBase + '/dashboard',
    });
    const expectedBody = {
        dashboard: dashboard.generate(),
        overwrite: true,
    };
    // we need to specify 307 in order for a POST redirect to be followed correctly
    nock(redirectBase)
        .defaultReplyHeaders({
            Location: url,
        })
        .post('/dashboard')
        .reply(307);

    nock(baseUrl)
        .post('/dashboard')
        .reply(200, function okHandler(uri, requestBody) {
            t.deepEqual(requestBody, expectedBody);
        });
    publish(dashboard);
});
