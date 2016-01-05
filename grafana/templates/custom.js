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

    var defaultState = {
        allFormat: 'glob',
        current: null,
        datasource: null,
        includeAll: false,
        name: 'template',
        options: [],
        query: null,
        refresh_on_load: false,
        type: 'custom'
    };
    this.state = defaultState;

    // Overwrite defaults with custom values
    for (var opt in opts) {
        if (opts.hasOwnProperty(opt)) {
            this.state[opt] = opts[opt];
        }
    }

    if (this.state.options.length) {
        this._processOptions();
    }
}

/*
 * Ensures options are objects, and updates the state's query and current values.
 */
Custom.prototype._processOptions = function _processOptions() {
    var self = this;

    var newOptions = [];
    var newQuery = [];

    this.state.options.forEach(function processOption(option) {
        var opt = {};
        if (typeof option === 'object') {
            opt = option;
        } else {
            opt = {
                text: option,
                value: option
            }
        }
        self.state.current = opt;
        newOptions.push(opt);
        newQuery.push(opt.value);
    });

    this.state.options = newOptions;
    this.state.query = newQuery.join(',');
};

Custom.prototype.generate = function generate() {
    return this.state;
};

module.exports = Custom;
