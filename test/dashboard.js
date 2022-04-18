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
var Dashboard = require('../grafana/dashboard');
var ExternalLink = require('../grafana/external-link')
require('../grafana/panels'); // for coverage

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
        refresh: '1m',
        rows: [{
            title: 'New row',
            height: '250px',
            editable: true,
            collapse: false,
            panels: []
        }],
        editable: true,
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

test('Dashboard can add links', function t(assert) {
  const externalLinks = [
    new ExternalLink({
      title: "Uber Homepage",
      url: "www.uber.com",
    })
  ]
  var dashboard = new Dashboard({
    links: externalLinks
  });
  assert.deepEqual(dashboard.links, externalLinks);
  assert.end();
})

test('Dashboard can set time', function t(assert) {
    var d = new Dashboard({
        time: {
            from: 'now-1h',
            to: 'now'
        }
    });

    assert.deepEqual(d.generate().time, {
        from: 'now-1h',
        to: 'now'
    });
    assert.end();
});

test('Dashboard can generate correct body', function t(assert) {
    var rowData = {foo: 'foo'};
    var dashboard = new Dashboard({
      links: [
        new ExternalLink({
          title: "Uber Homepage",
          url: "www.uber.com",
        }),
        {
          title: "Google Homepage",
          tooltip: "",
          url: "www.google.com",
          icon: "external link",
          targetBlank: true,
          type: "link",
          includeVars: false,
          keepTime: false,
        }
      ]
    });
    var row = {
        generate: function generate() {
            return rowData;
        }
    };
    dashboard.addRow(row);
    simpleDashboard.rows = [rowData];
    var json = dashboard.generate();

    var expectedJson = {
      ...simpleDashboard,
      links: [
        {
          title: "Uber Homepage",
          tooltip: "",
          url: "www.uber.com",
          tags: [],
          icon: "external link",
          targetBlank: true,
          type: "link",
          includeVars: false,
          keepTime: false,
        },
        {
          title: "Google Homepage",
          tooltip: "",
          url: "www.google.com",
          icon: "external link",
          targetBlank: true,
          type: "link",
          includeVars: false,
          keepTime: false,
        }
      ]
    }
    assert.deepEqual(json, expectedJson);
    assert.end();
});
