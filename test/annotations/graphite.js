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

/* eslint-disable no-new */
var test = require('tape');
var Graphite = require('../../grafana/annotations/graphite');

var simpleGraphite = require('../fixtures/annotations/simple_graphite');
var overrideGraphite = require('../fixtures/annotations/override_graphite');

test('Graphite annotation has requirements', function t(assert) {
    assert.throws(function assertThrows() {
        new Graphite();
    }, /UnfulfilledRequirement/);
    assert.end();
});

test('Graphite annotation requires name', function t(assert) {
    assert.throws(function assertThrows() {
        new Graphite({target: 'foo'});
    }, /UnfulfilledRequirement/);
    assert.end();
});

test('Graphite annotation requires target', function t(assert) {
    assert.throws(function assertThrows() {
        new Graphite({name: 'foo'});
    }, /UnfulfilledRequirement/);
    assert.end();
});

test('Graphite annotation generates state', function t(assert) {
    var annotation = new Graphite({
      name: 'name',
      target: 'target'
    });
    assert.deepEqual(annotation.generate(), simpleGraphite);
    assert.end();
});

test('Graphite annotation state can be overridden', function t(assert) {
    var annotation = new Graphite({
      name: 'custom name',
      datasource: 'custom datasource',
      showLine: false,
      iconColor: 'rgb(255, 0, 0)',
      lineColor: 'rgb(0, 0, 255)',
      iconSize: 5,
      enable: false,
      target: 'custom.target',
      arbitraryProperty: 'foo'
    });
    assert.deepEqual(annotation.generate(), overrideGraphite);
    assert.end();
});
