'use strict';

var test = require('cached-tape');
var Dashboard = require('../grafana/dashboard');

var simpleDashboard = require('./fixtures/simple_dashboard');
var overrideDashboard = require('./fixtures/override_dashboard');

test('Simple Dashboard', function t(assert) {
    var dashboard = new Dashboard();
    dashboard.state.id = simpleDashboard.id;
    assert.deepEqual(dashboard.state, simpleDashboard);
    assert.end();
});

test('Dashboard with overriden information', function t(assert) {
    var dashboard = new Dashboard({
        title: 'custom title',
        slug: 'custom-slug',
        tags: ['foo', 'bar'],
        templating: [{
            name: 'myvar',
            options: ['a', 'b']
        }, {
            name: 'smoothing',
            options: ['30min', '10min', '5min', '2min', '1min']
        }],
        annotations: [{
            name: 'Deploy Completed',
            target: 'path.to.metric.with.annotation'
        }],
        refresh: '1m'
    });
    dashboard.state.id = overrideDashboard.id;
    assert.deepEqual(dashboard.state, overrideDashboard);
    assert.end();
});


test('Dashboard can add rows', function t(assert) {
    var dashboard = new Dashboard();
    var row = {foo: 'foo'};
    dashboard.addRow(row);
    assert.deepEqual(dashboard.rows, [row]);
    assert.end();
});

test('Dashboard can generate JSON string', function t(assert) {
    var rowData = {foo: 'foo'};
    var dashboard = new Dashboard();
    var row = {
        generate: function generate() {
            return rowData;
        }
    };
    dashboard.addRow(row);
    simpleDashboard.rows = [rowData];
    var json = dashboard.generate();
    var expectedJSON = JSON.stringify(simpleDashboard, null, '\t');
    assert.equal(json, expectedJSON);
    assert.end();
});
