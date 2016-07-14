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

function Table(opts) {
    opts = opts || {};
    var self = this;

    var defaults = {
        "title": "Panel Title",
        "error": false,
        "span": 12,
        "editable": true,
        "type": "table",
        "isNew": true,
        "id": generateGraphId(),
        "styles": [
            {
                "type": "date",
                "pattern": "Time",
                "dateFormat": "YYYY-MM-DD HH:mm:ss"
            },{
                "unit": "short",
                "type": "number",
                "decimals": 0,
                "colors": [
                    "rgba(245, 54, 54, 0.9)",
                    "rgba(237, 129, 40, 0.89)",
                    "rgba(50, 172, 45, 0.97)"
                ],
                "colorMode": null,
                "pattern": "/.*/",
                "thresholds": []
            }
        ],
        "targets": [],
        "transform": "timeseries_aggregations",
        "pageSize": null,
        "showHeader": true,
        "columns": [{
            "text": "Avg",
            "value": "avg"
        }],
        "scroll": true,
        "fontSize": "100%",
        "sort": {
            "col": 0,
            "desc": true
        },
        "links": []
    };
    this.state = defaults;

    // Overwrite defaults with custom values
    Object.keys(opts).forEach(function eachOpt(opt) {
        self.state[opt] = opts[opt];
    });

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

Table.prototype.generate = function generate() {
    return this.state;
};

Table.prototype.setTitle = function setTitle(title) {
    this.state.title = title;
};

Table.prototype.addTarget = function addTarget(target) {
    this.state.targets.push({
        target: target.toString(),
        hide: target.hide
    });
};
module.exports = Table;
