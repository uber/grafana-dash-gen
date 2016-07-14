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
var Table = require('../../grafana/panels/table');

var simpleTable = require('../fixtures/panels/simple_table.js');
var overrideTable = require('../fixtures/panels/override_table.js');

test('simple table', function t(assert) {
    var table = new Table();
    table.state.id = simpleTable.id;
    assert.deepEqual(table.generate(), simpleTable);
    assert.end();
});

test('table with overriden information', function t(assert) {
    var table = new Table({
        span: 4,
        title: 'custom title',
        targets: ['target'],
        datasource: 'M3',
        arbitraryProperty: 'foo'
    });
    table.state.id = overrideTable.id;

    assert.deepEqual(table.generate(), overrideTable);
    assert.end();
});

test('add graph to row and dashboard when passed', function t(assert) {
    var calledAddPanel = 0;
    var calledAddRow = 0;

    new Table({
        row: {
            addPanel: function addPanel() {
                calledAddPanel += 1;
            }
        },

        dashboard: {
            addRow: function addRow() {
                calledAddRow += 1;
            }
        }
    });

    assert.deepEqual(calledAddRow, 1);
    assert.deepEqual(calledAddPanel, 1);
    assert.end();
});

test('table with overriden info and title', function t(assert) {
    var table = new Table({
        span: 4,
        targets: ['target'],
        datasource: 'M3',
        arbitraryProperty: 'foo'
    });
    table.state.id = overrideTable.id;
    table.setTitle('custom title');

    assert.deepEqual(table.generate(), overrideTable);
    assert.end();
});
