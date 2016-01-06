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

var errors = require('../errors');

function Graphite(opts) {
    opts = opts || {};
    var self = this;

    if (!opts.name) {
        throw errors.UnfulfilledRequirement({
            component: 'grafana.annotations.Graphite',
            unfulfilledArg: 'name'
        });
    }

    if (!opts.target) {
        throw errors.UnfulfilledRequirement({
            component: 'grafana.annotations.Graphite',
            unfulfilledArg: 'target'
        });
    }

    var defaults = {
        name: 'no name',
        datasource: 'graphite',
        showLine: true,
        iconColor: 'rgb(255, 234, 0)',
        lineColor: 'rgba(165, 161, 70, 0.59)',
        iconSize: 10,
        enable: true,
        target: ''
    };
    self.state = defaults;

    // Overwrite defaults with custom values
    Object.keys(opts).forEach(function eachOpt(opt) {
        self.state[opt] = opts[opt];
    });
}

Graphite.prototype.generate = function generate() {
    return this.state;
};

module.exports = Graphite;
