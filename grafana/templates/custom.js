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

function Custom(opts) {
    opts = opts || {};
    var self = this;

    this.state = {
        type: 'custom',
        datasource: null,
        refresh_on_load: false,
        options: [],
        includeAll: false,
        allFormat: 'glob',
        query: null,
        current: null
    };

    this.state.name = opts.name || 'template';

    if (opts.options) {
        opts.options.forEach(function addOp(option) {
            self.addOption(option, true);
        });
    }
}

Custom.prototype.addOption = function addOption(option, defaultOption) {
    var opt = {};
    // Don't assume that the text and value should be the same
    if (typeof option === 'object') {
        opt = option;
    } else {
        opt = {
            text: option,
            value: option
        }
    }
    this.state.options.push(opt);

    // update the query
    var query = [];
    this.state.options.forEach(function forEach(op) {
        query.push(op.value);
    });

    this.state.query = query.join(',');

    if (defaultOption) {
        this.state.current = {
            text: opt.text,
            value: opt.value
        };
    }
};

Custom.prototype.generate = function generate() {
    return this.state;
};

module.exports = Custom;
