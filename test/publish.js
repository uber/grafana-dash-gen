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
var nock = require('nock');
var test = require('tape');
var config = require('../grafana/config');
var publish = require('../grafana/publish');
var Dashboard = require('../grafana/dashboard');

// configuration values, held constant for assertions
var baseUrl = 'http://awesome.com';
var url = [baseUrl, 'dashboard'].join('/');
var token = 'abcdefg';
var title = 'Test Dashboard';
var tags = ['tag1', 'tag2'];
var refresh = '1m';
var templateVar1 = {
    name: 'myVar1',
    options: ['a', 'b']
};
var templateVar2 = {
    name: 'marVar2',
    options: [0, 1, 2, 3, 4]
};
var annotation1 = {
    name: 'myAnnotation1',
    target: 'my.annotation.target.1'
};

var dashboard = new Dashboard({
    title: title,
    tags: tags,
    refresh: refresh,
    templating: [templateVar1, templateVar2],
    annotations: [annotation1]
});

test('Publish dashboard - requires dashboard', function t(assert) {
    assert.throws(function assertThrows() {
        config.configure();
        publish();
    }, /UnfulfilledRequirement/);
    assert.end();
});

test('Publish dashboard - invalid state', function t(assert) {
    assert.throws(function assertThrows() {
        config.configure();
        publish({});
    }, /InvalidState/);
    assert.end();
});

test('Publish dashboard - invalid title', function t(assert) {
    assert.throws(function assertThrows() {
        config.configure();
        publish({
            state: {}
        });
    }, /InvalidState/);
    assert.end();
});

test('Publish dashboard - misconfigured url', function t(assert) {
    assert.throws(function assertThrows() {
        config.configure({
            token: token,
            url: null
        });
        publish({
            state: {
                title: title
            }
        });
    }, /Misconfigured/);
    assert.end();
});

test('Publish dashboard - misconfigured token', function t(assert) {
    assert.throws(function assertThrows() {
        config.configure({
            token: null,
            url: url
        });
        publish({
            state: {
                title: title
            }
        });
    }, /Misconfigured/);
    assert.end();
});

test('Publish dashboard - client error', function t(assert) {
    config.configure({
        token: token,
        url: url
    });
    nock(baseUrl)
        .post('/dashboard')
        .reply(412, {
            status: 'version-mismatch',
            message: 'Version mismatch'
        });
    publish(dashboard);
    assert.end();
});

test('Publish dashboard - client error (invalid)', function t(assert) {
    config.configure({
        token: token,
        url: url
    });
    nock(baseUrl)
        .post('/dashboard')
        .reply(400, { status: 'error' });
    publish(dashboard);
    assert.end();
});

test('Publish dashboard - client error (n/a)', function t(assert) {
    config.configure({
        token: token,
        url: url
    });
    nock(baseUrl)
        .post('/dashboard')
        .reply(412, { status: 'error' });
    publish(dashboard);
    assert.end();
});

test('Publish dashboard - bad response', function t(assert) {
    config.configure({
        token: token,
        url: url
    });
    nock(baseUrl)
        .post('/dashboard')
        .reply(200, 'foo');
    publish(dashboard);
    assert.end();
});

test('Publish dashboard - server unavailable', function t(assert) {
    config.configure({
        token: token,
        url: 'http://111.111.111.111'
    });
    publish(dashboard);
    assert.end();
});

test('Publish dashboard - server error', function t(assert) {
    config.configure({
        token: token,
        url: url
    });
    nock(baseUrl)
        .post('/dashboard')
        .reply(500);
    publish(dashboard);
    assert.end();
});

test('Publish dashboard - success', function t(assert) {
    config.configure({
        token: token,
        url: url
    });
    var expectedBody = {
        dashboard: dashboard.generate(),
        overwrite: true,
        folderId: null
    };

    // hijack the calls to elastic search, need to test both response codes
    // since the initial request will return a 201 and the subsequent will
    // return a 200.
    nock(baseUrl)
        .post('/dashboard')
        .reply(201, function(uri, requestBody) {
            assert.deepEqual(requestBody, expectedBody);
        })
        .post('/dashboard')
        .reply(200, function(uri, requestBody) {
            assert.deepEqual(requestBody, expectedBody);
            assert.end();
        });
    publish(dashboard); // 201
    publish(dashboard); // 200
});

test('Publish dashboard - success w/ custom timeout', function t(assert) {
    config.configure({
        token: token,
        url: url
    });
    var expectedBody = {
        dashboard: dashboard.generate(),
        overwrite: true,
        folderId: null
    };
    // hijack the calls to elastic search, need to test both response codes
    // since the initial request will return a 201 and the subsequent will
    // return a 200.
    nock(baseUrl)
        .post('/dashboard')
        .reply(201, function(uri, requestBody) {
            assert.deepEqual(requestBody, expectedBody);
        })
        .post('/dashboard')
        .reply(200, function(uri, requestBody) {
            assert.deepEqual(requestBody, expectedBody);
            assert.end();
        });
    publish(dashboard, {
        timeout: 2000
    }); // 201
    publish(dashboard, {
        timeout: 2000
    }); // 200
});