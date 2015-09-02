'use strict';
var nock = require('nock');
var test = require('cached-tape');
var config = require('../grafana/config');
var publish = require('../grafana/publish');
var Dashboard = require('../grafana/dashboard');

// configuration values, held constant for assertions
var baseUrl = 'http://awesome.com';
var url = [baseUrl, 'dashboard'].join('/');
var cookie = 'auth=foo';
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
            cookie: cookie,
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

test('Publish dashboard - misconfigured cookie', function t(assert) {
    assert.throws(function assertThrows() {
        config.configure({
            cookie: null,
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

test('Publish dashboard - error', function t(assert) {
    config.configure({
        cookie: cookie,
        url: 'http://localhost:11111'
    });
    publish(dashboard);
    assert.end();
});

test('Publish dashboard - client error', function t(assert) {
    config.configure({
      cookie: cookie,
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

test('Publish dashboard - client error (n/a)', function t(assert) {
    config.configure({
      cookie: cookie,
      url: url
    });
    nock(baseUrl)
      .post('/dashboard')
      .reply(412, {status: 'error'});
    publish(dashboard);
    assert.end();
});

test('Publish dashboard - server error', function t(assert) {
    config.configure({
      cookie: cookie,
      url: url
    });
    var expectedBody = {
      dashboard: dashboard.generate(),
      overwrite: true
    };
    nock(baseUrl)
      .post('/dashboard')
      .reply(500, function serverErrorHandler(uri, requestBody) {
          var body = JSON.parse(requestBody);
          assert.deepEqual(body, expectedBody);
      });
    publish(dashboard);
    assert.end();
});

test('Publish dashboard - success', function t(assert) {
    config.configure({
      cookie: cookie,
      url: url
    });
    var expectedBody = {
      dashboard: dashboard.generate(),
      overwrite: true
    };
    // hijack the calls to elastic search, need to test both response codes
    // since the initial request will return a 201 and the subsequent will
    // return a 200.
    nock(baseUrl)
      .post('/dashboard')
      .reply(201, function createdHandler(uri, requestBody) {
          var body = JSON.parse(requestBody);
          assert.deepEqual(body, expectedBody);
      })
      .post('/dashboard')
      .reply(200, function okHandler(uri, requestBody) {
          var body = JSON.parse(requestBody);
          assert.deepEqual(body, expectedBody);
          assert.end();
      });
    publish(dashboard);  // 201
    publish(dashboard);  // 200
});
