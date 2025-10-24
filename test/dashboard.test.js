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

var Dashboard = require('../src/dashboard');
var ExternalLink = require('../src/external-link');
require('../src/panels'); // for coverage

var simpleDashboard = require('./fixtures/simple_dashboard');
var overrideDashboard = require('./fixtures/override_dashboard');

test('Simple Dashboard', function () {
    var dashboard = new Dashboard();
    dashboard.state.id = simpleDashboard.id;
    expect(dashboard.state).toEqual(simpleDashboard);
});

test('Dashboard with overriden information', function () {
    var dashboard = new Dashboard({
        title: 'custom title',
        tags: ['foo', 'bar'],
        templating: [
            {
                name: 'myvar',
                options: ['a', 'b'],
            },
            {
                name: 'smoothing',
                options: ['30min', '10min', '5min', '2min', '1min'],
            },
        ],
        annotations: [
            {
                name: 'Deploy Completed',
                target: 'path.to.metric.with.annotation',
            },
        ],
        refresh: '1m',
        rows: [
            {
                // @ts-expect-error todo: this is not correct and will result in errors if to call .generate()
                title: 'New row',
                height: '250px',
                editable: true,
                collapse: false,
                panels: [],
            },
        ],
        editable: true,
    });
    dashboard.state.id = overrideDashboard.id;
    expect(dashboard.state).toEqual(overrideDashboard);
});

test('Dashboard can add rows', function () {
    var dashboard = new Dashboard();
    var row = { foo: 'foo' };
    // @ts-expect-error todo: bad mock
    dashboard.addRow(row);
    expect(dashboard.rows).toEqual([row]);
});

test('Dashboard can add links', function () {
    const externalLinks = [
        new ExternalLink({
            title: 'Uber Homepage',
            url: 'www.uber.com',
        }),
    ];
    var dashboard = new Dashboard({
        links: externalLinks,
    });
    expect(dashboard.links).toEqual(externalLinks);
});

test('Dashboard can set time', function () {
    var d = new Dashboard({
        time: {
            from: 'now-1h',
            to: 'now',
        },
    });

    expect(d.generate().time).toEqual({
        from: 'now-1h',
        to: 'now',
    });
});

test('Dashboard can generate correct body', function () {
    var rowData = { foo: 'foo' };
    var dashboard = new Dashboard({
        links: [
            new ExternalLink({
                title: 'Uber Homepage',
                url: 'www.uber.com',
            }),
            {
                title: 'Google Homepage',
                tooltip: '',
                url: 'www.google.com',
                icon: 'external link',
                targetBlank: true,
                type: 'link',
                includeVars: false,
                keepTime: false,
            },
        ],
    });
    var row = {
        generate: function generate() {
            return rowData;
        },
    };
    // @ts-expect-error incomplete mock
    dashboard.addRow(row);
    // @ts-expect-error todo: incomplete mock
    simpleDashboard.rows = [rowData];
    var json = dashboard.generate();

    var expectedJson = {
        ...simpleDashboard,
        links: [
            {
                title: 'Uber Homepage',
                tooltip: '',
                url: 'www.uber.com',
                tags: [],
                icon: 'external link',
                targetBlank: true,
                type: 'link',
                includeVars: false,
                keepTime: false,
            },
            {
                title: 'Google Homepage',
                tooltip: '',
                url: 'www.google.com',
                icon: 'external link',
                targetBlank: true,
                type: 'link',
                includeVars: false,
                keepTime: false,
            },
        ],
    };
    expect(json).toEqual(expectedJson);
});
