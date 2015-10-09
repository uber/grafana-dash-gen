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

var test = require('cached-tape');
var Custom = require('../../grafana/templates/custom');

var simpleCustom = require('../fixtures/templates/simple_custom');
var overrideCustom = require('../fixtures/templates/override_custom');

test('Custom template has defaults', function t(assert) {
    var template = new Custom();
    assert.deepEqual(template.state, simpleCustom);
    assert.end();
});

test('Custom template creates state', function t(assert) {
    var name = 'custom';
    var options = ['a', 'b'];
    var template = new Custom({
        name: name,
        options: options
    });
    assert.deepEqual(template.state, overrideCustom);
    assert.end();
});

test('Custom template generates state', function t(assert) {
    var name = 'custom';
    var options = ['a', 'b'];
    var template = new Custom({
        name: name,
        options: options
    });
    assert.deepEqual(template.generate(), overrideCustom);
    assert.end();
});

test('Custom template can add options', function t(assert) {
    var name = 'custom';
    var template = new Custom({name: name});
    template.addOption('a');
    template.addOption('b', true)

    assert.deepEqual(template.state, overrideCustom);
    assert.end();
});
