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

import Graph from '../../src/panels/graph.js';

import { getAlert } from '../fixtures/alert/alert.mock.js';
import simpleGraph from '../fixtures/panels/simple_graph.js';
import overrideGraph from '../fixtures/panels/override_graph.js';
import simpleGraphWithAlert from '../fixtures/panels/graph_with_alert.js';
import alertWithCondition from '../fixtures/alert/alert_with_condition.js';

test('simple graph', () => {
    const graph = new Graph();
    graph.state.id = simpleGraph.id;
    expect(graph.generate()).toEqual(simpleGraph);
});

test('graph with overriden information', () => {
    const graph = new Graph({
        span: 4,
        title: 'custom title',
        targets: ['target'],
        datasource: 'M3',
        fill: 0,
        arbitraryProperty: 'foo',
    });
    graph.state.id = overrideGraph.id;

    expect(graph.generate()).toEqual(overrideGraph);
});

test('add graph to row and dashboard when passed', () => {
    let calledAddPanel = 0;
    let calledAddRow = 0;

    new Graph({
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

test('graph should assign a refId to each target added', () => {
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

    expect(graph.generate().targets).toEqual(expectedTargets);
});

test('graph should be able to add alert', () => {
    const graph = new Graph({
        targets: ['firstTarget'],
    });

    graph.state.id = simpleGraphWithAlert.id;
    graph.addAlert(getAlert());

    expect(graph.generate()).toEqual(simpleGraphWithAlert);
});

test('graph should receive an alert in the constructor', () => {
    const graph = new Graph({
        alert: alertWithCondition,
        targets: ['firstTarget'],
    });
    graph.state.id = simpleGraphWithAlert.id;

    expect(graph.generate()).toEqual(simpleGraphWithAlert);
});

test('graph should add other targets when a target contains refs', () => {
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

    expect(actualDivideTarget).toEqual(expectedDivideTarget);
});

test('graph should throw descriptive error when referencing non-existent target', () => {
    expect(() => {
        new Graph({
            targets: [
                'target-1',
                "alias(divideSeries(#Z, #A), 'invalid ref')", // #Z doesn't exist
            ],
        });
    }).toThrow(/Invalid target reference: #Z does not exist/);
});
