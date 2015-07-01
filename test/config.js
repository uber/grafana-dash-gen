'use strict';

var test = require('cached-tape');
var config = require('../grafana/config');

test('config extends default configuration', function t(assert) {
    var foo = 'foo';
    var bar = 1;
    var user = 'notguest';
    var group = 'guest';
    var url = 'http://myfakeurl.com';
    var cookie = 'auth=value';

    var cfg = {
        foo: foo,
        bar: bar,
        user: user,
        url: url,
        cookie: cookie
    };

    var expected = {
        foo: foo,
        bar: bar,
        user: user,
        group: group,
        url: url,
        cookie: cookie
    };

    config.configure(cfg);
    var result = config.getConfig();

    assert.deepEqual(result, expected);
    assert.end();
});
