'use strict';

var test = require('cached-tape');
var config = require('../grafana/config');

test('config extends default configuration', function t(assert) {
    var foo = 'foo';
    var bar = 1;
    var user = 'notguest';
    var url = 'http://myfakeurl.com';
    var defaultGroup = 'guest';
    var defaultCookie = 'auth-openid=AAAAG';

    var cfg = {
        foo: foo,
        bar: bar,
        user: user,
        url: url
    };

    var expected = {
        foo: foo,
        bar: bar,
        user: user,
        group: defaultGroup,
        url: url,
        cookie: defaultCookie
    };

    config.config(cfg);
    var result = config.getConfig();

    assert.deepEqual(result, expected);
    assert.end();
});
