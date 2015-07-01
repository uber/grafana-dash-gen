'use strict';
var nock = require('nock');
var test = require('cached-tape');
var config = require('../grafana/config');
var publish = require('../grafana/publish');
var Dashboard = require('../grafana/dashboard');

// configuration values, held constant for assertions
var url = 'http://awesome.com/dashboard';
var user = 'user';
var group = 'group';
var cookie = 'auth=foo';
var title = 'Test Dashboard';
var slug = 'test-dashboard';
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
    slug: slug,
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

test('Publish dashboard - invalid meta.slug', function t(assert) {
    assert.throws(function assertThrows() {
        config.configure();
        publish({
            state: {
                title: 'foo',
                meta: {}
            }
        });
    }, /InvalidState/);
    assert.end();
});

test('Publish dashboard - misconfigured url', function t(assert) {
    assert.throws(function assertThrows() {
        config.configure({
            user: user,
            group: group,
            cookie: cookie,
            url: null
        });
        publish({
            state: {
                title: title,
                meta: {
                    slug: slug
                }
            }
        });
    }, /Misconfigured/);
    assert.end();
});

test('Publish dashboard - misconfigured user', function t(assert) {
    assert.throws(function assertThrows() {
        config.configure({
            user: null,
            group: group,
            cookie: cookie,
            url: url
        });
        publish({
            state: {
                title: title,
                meta: {
                    slug: slug
                }
            }
        });
    }, /Misconfigured/);
    assert.end();
});

test('Publish dashboard - misconfigured group', function t(assert) {
    assert.throws(function assertThrows() {
        config.configure({
            user: user,
            group: null,
            cookie: cookie,
            url: url
        });
        publish({
            state: {
                title: title,
                meta: {
                    slug: slug
                }
            }
        });
    }, /Misconfigured/);
    assert.end();
});

test('Publish dashboard - misconfigured cookie', function t(assert) {
    assert.throws(function assertThrows() {
        config.configure({
            user: user,
            group: group,
            cookie: null,
            url: url
        });
        publish({
            state: {
                title: title,
                meta: {
                    slug: slug
                }
            }
        });
    }, /Misconfigured/);
    assert.end();
});

test('Publish dashboard - not found', function t(assert) {
    config.configure({
        cookie: cookie,
        url: url
    });
    // just needs to generate a 404 for coverage
    nock(url)
      .put('/' + slug)
      .reply(404, function () {
        assert.end();
      });
    publish(dashboard);
});

test('Publish dashboard - error', function t(assert) {
    config.configure({
        cookie: cookie,
        url: 'localhost:11111'
    });
    publish(dashboard);
    assert.end();
});

test('Publish dashboard - success', function t(assert) {
    config.configure({
      user: user,
      group: group,
      cookie: cookie,
      url: url
    });
    var expectedBody = {
      user: user,
      group: group,
      title: title,
      tags: tags,
      dashboard: dashboard.generate()
    };
    // hijack the calls to elastic search, need to test both response codes
    // since the initial request will return a 201 and the subsequent will
    // return a 200.
    nock(url)
      .put('/' + slug)
      .reply(201, function(uri, requestBody) {
        var body = JSON.parse(requestBody);
        assert.deepEqual(body, expectedBody);
      })
      .put('/' + slug)
      .reply(200, function(uri, requestBody) {
        var body = JSON.parse(requestBody);
        assert.deepEqual(body, expectedBody);
        assert.end();
      });
    publish(dashboard);  // 201
    publish(dashboard);  // 200
});

test('Publish dashboard - handle URLs with trailing slash', function t(assert) {
    config.configure({
      user: user,
      group: group,
      cookie: cookie,
      url: url + '/' // having slash
    });
    var expectedBody = {
      user: user,
      group: group,
      title: title,
      tags: tags,
      dashboard: dashboard.generate()
    };
    nock(url)
      .put('/' + slug)
      .reply(201, function(uri, requestBody) {
        var body = JSON.parse(requestBody);
        assert.deepEqual(body, expectedBody);
        assert.end();
      });
    publish(dashboard);
});

test('Publish dashboard - handle URLs without trailing slash', function t(assert) {
    config.configure({
      user: user,
      group: group,
      cookie: cookie,
      url: url + '/' // having slash
    });
    var expectedBody = {
      user: user,
      group: group,
      title: title,
      tags: tags,
      dashboard: dashboard.generate()
    };
    nock(url)
      .put('/' + slug)
      .reply(201, function(uri, requestBody) {
        var body = JSON.parse(requestBody);
        assert.deepEqual(body, expectedBody);
        assert.end();
      });
    publish(dashboard);
});
