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

var test = require('tape');
var Query = require('../../grafana/templates/query');

var simpleQuery = require('../fixtures/templates/simple_query');
var overrideQuery = require('../fixtures/templates/override_query');

test('Interval template has defaults', function t(assert) {
    var template = new Query('servers.*', {
        name: 'foo',
        datasource: 'default'
    });
    assert.deepEqual(template.generate(), simpleQuery);
    assert.end();
});

test('Query template requires query', function t(assert) {
    assert.throws(function catchError() {
        var template = new Query(null, {
            name: 'foo',
            datasource: 'default'
        });
        template.state.refresh = true;
        assert.fail();
    }, Error);
    assert.end();
});

test('Query template options default to empty objects', function t(assert) {
    assert.throws(function catchError() {
        var template = new Query('servers.*');
        template.state.refresh = true;
        assert.fail();
    }, Error);
    assert.end();
});

test('Query template requires name', function t(assert) {
    assert.throws(function catchTypeError() {
        var template = new Query('servers.*', {
            datasource: 'default'
        });
        template.state.refresh = true;
        assert.fail();
    }, Error);
    assert.end();
});

test('Query template requires datasource', function t(assert) {
    assert.throws(function catchTypeError() {
        var template = new Query('servers.*', {
            name: 'foo'
        });
        template.state.refresh = true;
        assert.fail();
    }, Error);
    assert.end();
});

test('Query template creates state', function t(assert) {
    var template = new Query('servers.*', {
        name: 'foo',
        datasource: 'default'
    });
    assert.deepEqual(template.generate(), simpleQuery);
    assert.end();
});

test('Query template state cannot be mutated after init', function t(assert) {
    var template = new Query('servers.*', {
        name: 'foo',
        datasource: 'default'
    });
    assert.deepEqual(template.generate(), simpleQuery);

    assert.throws(function catchTypeError() {
        template.state.refresh = true;
    }, TypeError);

    assert.end();
});

test('Query template state overridden on init', function t(assert) {
    var template = new Query('stats.*', {
        name: 'template',
        datasource: 'datasource',
        includeAll: false,
        allFormat: 'glob',
        allValue: '*',
        refresh: true,
        multi: true
    });
    assert.deepEqual(template.generate(), overrideQuery);
    assert.end();
});
