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
var Graph = require('../../grafana/panels/graph');

var simpleGraph = require('../fixtures/panels/simple_graph.js');
var overrideGraph = require('../fixtures/panels/override_graph.js');

test('simple graph', function t(assert) {
    var graph = new Graph();
    graph.state.id = simpleGraph.id;
    assert.deepEqual(graph.generate(), simpleGraph);
    assert.end();
});

test('graph with overriden information', function t(assert) {
    var graph = new Graph({
        span: 4,
        fill: 0,
        nullPointMode: 'connected',
        title: 'custom title',
        targets: ['target']
    });
    graph.state.id = overrideGraph.id;

    assert.deepEqual(graph.generate(), overrideGraph);
    assert.end();
});

test('add graph to row and dashboard when passed', function t(assert) {
    var calledAddPanel = 0;
    var calledAddRow = 0;

    new Graph({
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
