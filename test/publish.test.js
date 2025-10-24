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

test('Publish dashboard - requires dashboard', async () => {
    await expect(async () => {
        config.configure();
        return publish();
    }).rejects.toThrow('grafana.publish missing requirement: dashboard');
});

test('Publish dashboard - invalid state', async () => {
    await expect(async () => {
        config.configure();
        return publish({});
    }).rejects.toThrow(
        'grafana.Dashboard state is invalid: state.title undefined'
    );
});

test('Publish dashboard - invalid title', async () => {
    await expect(async () => {
        config.configure();
        return publish({
            state: {},
        });
    }).rejects.toThrow(
        'grafana.Dashboard state is invalid: state.title undefined'
    );
});

test('Publish dashboard - misconfigured url', async () => {
    await expect(async () => {
        config.configure({
            cookie: cookie,
            url: null,
        });
        return publish({
            state: {
                title: title,
            },
        });
    }).rejects.toThrow(
        'Incorrect configuration: config.url undefined - Must call grafana.configure before publishing'
    );
});

test('Publish dashboard - misconfigured cookie', async () => {
    await expect(async () => {
        config.configure({
            cookie: null,
            url: url,
        });
        return publish({
            state: {
                title: title,
            },
        });
    }).rejects.toThrow('Incorrect configuration: config.cookie undefined - ');
});

test('Publish dashboard - default empty headers', async function () {
    expect.assertions(1);
    config.configure({
        cookie: cookie,
        headers: null,
        url: url,
    });
    nock(baseUrl)
        .post('/dashboard')
        .reply(200, function createdHandler() {
            const headerType = typeof this.req.headers;
            expect(headerType).toBe('object');
        });
    await publish(dashboard); // 200
});

test('Publish dashboard - client error', async function () {
    expect.assertions(1);
    config.configure({
        cookie: cookie,
        url: url,
    });
    nock(baseUrl).post('/dashboard').reply(412, {
        status: 'version-mismatch',
        message: 'Version mismatch',
    });
    await publish(dashboard).catch((e) => {
        console.log(e);
        expect(e.info().response.status).toBe(412);
    });
});

test('Publish dashboard - client error (invalid)', async function () {
    expect.assertions(1);
    config.configure({
        cookie: cookie,
        url: url,
    });
    nock(baseUrl).post('/dashboard').reply(400, { status: 'error' });
    await publish(dashboard).catch((e) => {
        expect(e.info().response.status).toBe(400);
    });
});

test('Publish dashboard - client error (n/a)', async function () {
    expect.assertions(1);
    config.configure({
        cookie: cookie,
        url: url,
    });
    nock(baseUrl).post('/dashboard').reply(412, { status: 'error' });
    await publish(dashboard).catch((e) => {
        expect(e.info().response.status).toBe(412);
    });
});

test('Publish dashboard - bad response', async function () {
    expect.assertions(1);
    config.configure({
        cookie: cookie,
        url: url,
    });
    nock(baseUrl).post('/dashboard').reply(200, 'foo');
    await publish(dashboard).then((response) => {
        expect(response).toBe('foo');
    });
});

test('Publish dashboard - server unavailable', async function () {
    expect.assertions(1);
    config.configure({
        cookie: cookie,
        url: 'http://111.111.111.111',
    });
    await publish(dashboard).catch((e) => {
        expect(e.message).toBe('network timeout at: http://111.111.111.111/');
    });
});

test('Publish dashboard - server error', async function () {
    expect.assertions(1);
    config.configure({
        cookie: cookie,
        url: url,
    });
    nock(baseUrl).post('/dashboard').reply(500);
    await publish(dashboard).catch((e) => {
        expect(e.info().response.status).toBe(500);
    });
});

test('Publish dashboard - success', async function () {
    expect.assertions(2);
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
            expect(requestBody).toEqual(expectedBody);
        })
        .post('/dashboard')
        .reply(200, function okHandler(uri, requestBody) {
            expect(requestBody).toEqual(expectedBody);
        });
    await publish(dashboard) // 201
        .then(() => publish(dashboard)); // 200
});

test('Publish dashboard - success w/ custom timeout', async function () {
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
            expect(requestBody).toEqual(expectedBody);
        })
        .post('/dashboard')
        .reply(200, function okHandler(uri, requestBody) {
            expect(requestBody).toEqual(expectedBody);
        });
    await publish(dashboard, {
        timeout: 2000,
    }) // 201
        .then(() =>
            publish(dashboard, {
                timeout: 2000,
            })
        ); // 200
});

test('Publish dashboard - passes headers', async function () {
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
                expect(reqHeaders[key]).toEqual(headers[key]);
            });
        })
        .post('/dashboard')
        .reply(200, function okHandler() {
            const reqHeaders = this.req.headers;
            Object.keys(headers).forEach(function (key) {
                expect(reqHeaders[key]).toEqual(headers[key]);
            });
        });
    await publish(dashboard) // 201
        .then(() => publish(dashboard)); // 200
});

test('Publish dashboard - follows redirect', async () => {
    expect.assertions(1);
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
            expect(requestBody).toEqual(expectedBody);
        });
    await publish(dashboard);
});
