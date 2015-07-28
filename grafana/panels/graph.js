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

var _ = require('underscore');
var defaultsDeep = require('defaults-deep');
var generateGraphId = require('../id');

function Graph(opts) {
    opts = opts || {};
    var self = this;

    var defaults = {
        'type': 'graph',
        'id': generateGraphId(),
        'renderer': 'flot',
        'title': 'no title (click here)',
        'error': false,
        'editable': true,
        'x-axis': true,
        'y-axis': true,
        'y_formats': [
            'short',
            'short'
        ],
        'grid': {
            'leftMax': null,
            'rightMax': null,
            'leftMin': null,
            'rightMin': null,
            'threshold1': null,
            'threshold2': null,
            'threshold1Color': 'rgba(216, 200, 27, 0.27)',
            'threshold2Color': 'rgba(234, 112, 112, 0.22)'
        },
        'lines': true,
        'span': 12,
        'fill': 2,
        'linewidth': 1,
        'points': false,
        'pointradius': 5,
        'bars': false,
        'stack': false,
        'percentage': false,
        'targets': [],
        'legend': {
            'show': true,
            'values': true,
            'min': false,
            'max': true,
            'current': false,
            'total': false,
            'avg': true
        },
        'nullPointMode': 'null as zero',
        'steppedLine': false,
        'tooltip': {
            'value_type': 'cumulative',
            'shared': false
        },
        'aliasColors': {},
        'seriesOverrides': [
            {}
        ],
        'links': [],
        'datasource': 'graphite'
    };

    // Allow overriding of any options
    this.state = defaultsDeep(_.clone(opts), defaults);

    if (opts.targets) {
        this.state.targets = [];
        opts.targets.forEach(function addT(target) {
            self.addTarget(target);
        });
    }

    // finally add to row/dashboard if given
    if (opts.row && opts.dashboard) {
        opts.row.addPanel(this);
        opts.dashboard.addRow(opts.row);
    }
}

Graph.prototype.generate = function generate() {
    return this.state;
};

Graph.prototype.addTarget = function addTarget(target) {
    this.state.targets.push({
        target: target.toString()
    });
};

module.exports = Graph;
