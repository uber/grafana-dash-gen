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

const test = require('tape');
const Graph = require('../../grafana/panels/graph');

const getAlert = require('../fixtures/alert/alert.mock').getAlert;
const simpleGraph = require('../fixtures/panels/simple_graph.js');
const overrideGraph = require('../fixtures/panels/override_graph.js');
const simpleGraphWithAlert = require('../fixtures/panels/graph_with_alert.js');
const alertWithCondition = require('../fixtures/alert/alert_with_condition.js');

test('simple graph', (t) => {
    const graph = new Graph();
    graph.state.id = simpleGraph.id;
    t.deepEqual(graph.generate(), simpleGraph);
    t.end();
});

test('graph with overriden information', (t) => {
    const graph = new Graph({
        span: 4,
        title: 'custom title',
        targets: ['target'],
        datasource: 'M3',
        fill: 0,
        arbitraryProperty: 'foo',
    });
    graph.state.id = overrideGraph.id;

    t.deepEqual(graph.generate(), overrideGraph);
    t.end();
});

test('add graph to row and dashboard when passed', (t) => {
    let calledAddPanel = 0;
    let calledAddRow = 0;

    new Graph({
        row: {
            addPanel: function addPanel() {
                calledAddPanel += 1;
            },
        },

        dashboard: {
            addRow: function addRow() {
                calledAddRow += 1;
            },
        },
    });

    t.deepEqual(calledAddRow, 1);
    t.deepEqual(calledAddPanel, 1);
    t.end();
});

test('graph should assign a refId to each target added', (t) => {
    const firstTarget = 'target';
    const secondTarget = 'target-2';

    const expectedTargets = [
        {
            hide: undefined,
            refId: 'A',
            target: firstTarget,
        },
        {
            hide: undefined,
            refId: 'B',
            target: secondTarget,
        },
    ];

    const graph = new Graph({
        span: 4,
        title: 'custom title',
        targets: [firstTarget, secondTarget],
        datasource: 'M3',
        fill: 0,
        arbitraryProperty: 'foo',
    });

    t.deepEqual(graph.generate().targets, expectedTargets);
    t.end();
});

test('graph should be able to add alert', (t) => {
    const graph = new Graph({
        targets: ['firstTarget'],
    });

    graph.state.id = simpleGraphWithAlert.id;
    graph.addAlert(getAlert());

    t.deepEqual(graph.generate(), simpleGraphWithAlert);
    t.end();
});

test('graph should receive an alert in the constructor', (t) => {
    const graph = new Graph({
        alert: alertWithCondition,
        targets: ['firstTarget'],
    });
    graph.state.id = simpleGraphWithAlert.id;

    t.deepEqual(graph.generate(), simpleGraphWithAlert);
    t.end();
});

test('graph should add other targets when a target contains refs', (t) => {
    const graph = new Graph({
        targets: [
            "alias(scaleToSeconds(summarize(sumSeries(target-1), '60m', 'sum', false), 60), 'alias-1')",
            "alias(scaleToSeconds(summarize(sumSeries(target-2), '60m', 'sum', false), 60), 'alias-2')",
            "alias(divideSeries(#B, #A), 'success rate')",
        ],
    });

    const actualDivideTarget = graph.generate().targets[2];
    const expectedDivideTarget = {
        hide: undefined,
        refId: 'C',
        target: "alias(divideSeries(#B, #A), 'success rate')",
        targetFull:
            "alias(divideSeries(alias(scaleToSeconds(summarize(sumSeries(target-2), '60m', 'sum', false), 60), 'alias-2'), alias(scaleToSeconds(summarize(sumSeries(target-1), '60m', 'sum', false), 60), 'alias-1')), 'success rate')",
    };

    t.deepEqual(actualDivideTarget, expectedDivideTarget);
    t.end();
});
