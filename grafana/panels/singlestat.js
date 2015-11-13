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

var generateGraphId = require('../id');

function SingleStat(opts) {
    opts = opts || {};
    var self = this;

    this.state = {
        title: 'single stat',
        error: false,
        span: 12,
        editable: true,
        type: 'singlestat',
        links: [],
        maxDataPoints: 100,
        interval: null,
        cacheTimeout: null,
        format: 'none',
        prefix: '',
        postfix: '',
        nullText: null,
        valueMaps: [{
            value: 'null',
            op: '=',
            text: 'N/A'
        }],
        nullPointMode: 'connected',
        valueName: 'current',
        prefixFontSize: '50%',
        valueFontSize: '80%',
        postfixFontSize: '50%',
        thresholds: '',
        colorBackground: false,
        colorValue: false,
        colors: [
            'rgba(71, 212, 59, 0.4)',
            'rgba(245, 150, 40, 0.73)',
            'rgba(225, 40, 40, 0.59)'
        ],
        sparkline: {
            show: true,
            full: true,
            lineColor: 'rgb(31, 193, 58)',
            fillColor: 'rgba(134, 178, 214, 0.41)'
        }
    };

    this.state.title = opts.title || this.state.title;
    this.state.id = opts.id || generateGraphId();
    this.state.span = opts.span || 12;
    this.state.postfix = opts.postfix || '';
    this.state.targets = [];
    this.state.sparkline = opts.sparkline || this.state.sparkline;
    this.state.colorValue = typeof opts.colorValue === 'boolean' ? opts.colorValue : this.state.colorValue;
    this.state.colors = opts.colors || this.state.colors;

    if (opts.targets) {
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

SingleStat.prototype.generate = function generate() {
    return this.state;
};

SingleStat.prototype.setTitle = function setTitle(title) {
    this.state.title = title;
};

SingleStat.prototype.addTarget = function addTarget(target) {
    this.state.targets.push({
        target: target.toString()
    });
};

module.exports = SingleStat;
