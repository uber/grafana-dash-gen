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
