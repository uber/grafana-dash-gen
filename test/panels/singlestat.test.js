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

var SingleStat = require('../../src/panels/singlestat');

var simpleSingleStat = require('../fixtures/panels/simple_singlestat');
var overrideSingleStat = require('../fixtures/panels/override_singlestat');

test('simple SingleStat panel', function () {
    var graph = new SingleStat();
    graph.state.id = simpleSingleStat.id;

    expect(graph.generate()).toEqual(simpleSingleStat);
});

test('SingleStat panel with overriden information', function () {
    var graph = new SingleStat({
        span: 4,
        title: 'custom title',
        targets: ['target'],
        datasource: 'M3',
        arbitraryProperty: 'foo',
    });
    graph.state.id = overrideSingleStat.id;

    expect(graph.generate()).toEqual(overrideSingleStat);
});

test('SingleStat can set title', function () {
    var title = 'title';
    var graph = new SingleStat();
    graph.setTitle(title);
    expect(graph.state.title).toEqual(title);
});

test('add graph to row and dashboard when passed', function () {
    var calledAddPanel = 0;
    var calledAddRow = 0;

    new SingleStat({
        // @ts-expect-error incomplete mock
        row: {
            addPanel: function addPanel() {
                calledAddPanel += 1;
            },
        },

        // @ts-expect-error incomplete mock
        dashboard: {
            addRow: function addRow() {
                calledAddRow += 1;
            },
        },
    });

    expect(calledAddRow).toEqual(1);
    expect(calledAddPanel).toEqual(1);
});
