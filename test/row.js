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
var Row = require('../grafana/row');

var simpleRow = require('./fixtures/simple_row.js');
var overrideRow = require('./fixtures/override_row.js');
var panelData = {
    foo: 'foo',
    bar: 'bar',
    baz: 1
};

test('Simple row', function t(assert) {
    var row = new Row();
    assert.deepEqual(row.generate(), simpleRow);
    assert.end();
});

test('Row with overriden information', function t(assert) {
    var panel1 = {
      generate: function generate() {
          return panelData;
      }
    };
    var row = new Row({
        title: 'My Row',
        height: '1000px',
        editable: false,
        collapse: true,
        panels: [panel1]
    });
    assert.deepEqual(row.generate(), overrideRow);
    assert.end();
});

test('Add panels to row when passed', function t(assert) {
    var panel1 = {
      foo: 'foo',
      bar: 'bar',
      baz: 1
    };
    var panel2 = {
      foo: 'foo2',
      bar: 'bar2',
      baz: 2
    };
    var row = new Row({
        panels: [panel1, panel2]
    });

    assert.deepEqual(row.state.panels, [panel1, panel2]);
    assert.end();
});

test('Row can add panels', function t(assert) {
    var row = new Row({
        title: 'My Row',
        height: '1000px',
        editable: false,
        collapse: true
    });
    var panel1 = {
      foo: 'foo',
      bar: 'bar',
      baz: 1
    };
    var panel2 = {
      foo: 'foo2',
      bar: 'bar2',
      baz: 2
    };

    row.addPanel(panel1);
    row.addPanel(panel2);
    assert.deepEqual(row.panels, [panel1, panel2]);
    assert.end();
});

test('Row generates state', function t(assert) {
    var panel = {
      generate: function generate() {
          return panelData;
      }
    };
    var row = new Row({
        title: 'My Row',
        height: '1000px',
        editable: false,
        collapse: true,
        panels: [panel]
    });

    assert.deepEqual(row.generate(), overrideRow);
    assert.end();
});
