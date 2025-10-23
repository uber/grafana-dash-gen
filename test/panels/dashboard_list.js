// Copyright (c) 2018 Uber Technologies, Inc.
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
var DashboardList = require('../../grafana/panels/dashboard_list');

var dashboardList = require('../fixtures/panels/simple_dashboard_list.js');
var overrideDashboardList = require('../fixtures/panels/override_dashboard_list.js');

test('simple DashboardList panel', function (t) {
    var graph = new DashboardList();
    graph.state.id = dashboardList.id;

    t.deepEqual(graph.generate(), dashboardList);
    t.end();
});

test('DashboardList panel with overriden information', function (t) {
    var graph = new DashboardList({
        span: 3,
        title: 'dashboard list',
        mode: 'search',
    });
    graph.state.id = overrideDashboardList.id;

    t.deepEqual(graph.generate(), overrideDashboardList);
    t.end();
});

test('DashboardList can set title', function (t) {
    var title = 'title';
    var graph = new DashboardList();
    graph.setTitle(title);
    t.deepEqual(graph.state.title, title);
    t.end();
});

test('add graph to row and dashboard when passed', function (t) {
    var calledAddPanel = 0;
    var calledAddRow = 0;

    new DashboardList({
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
