'use strict';

var test = require('cached-tape');
var Dashboard = require('../grafana/dashboard');

var simpleDashboard = require('./fixtures/simple_dashboard.js');
var overrideDashboard = require('./fixtures/override_dashboard.js');

test('simple Dashboard', function t(assert) {
  var dashboard = new Dashboard();
  dashboard.state.id = simpleDashboard.id;

  assert.deepEqual(dashboard.state, simpleDashboard);
  assert.end();
});

test('Dashboard with overriden information', function t(assert) {
  var dashboard = new Dashboard({
    title: 'custom title',
    slug: 'custom-slug'
  });

  dashboard.state.id = overrideDashboard.id;
  assert.deepEqual(dashboard.state, overrideDashboard);
  assert.end();
});
