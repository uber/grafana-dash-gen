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

var Dashboard = require('./grafana/dashboard');
var Row = require('./grafana/row');
var ExternalLink = require('./grafana/external-link')
var Target = require('./grafana/target');
var Panels = require('./grafana/panels');
var Alert = require('./grafana/alert/alert');
var Condition = require('./grafana/alert/condition');
var Templates = require('./grafana/templates');
var publish = require('./grafana/publish');
var generateGraphId = require('./grafana/id');
var config = require('./grafana/config');
var Annotations = require('./grafana/annotations');

module.exports = {
    Dashboard: Dashboard,
    Row: Row,
    ExternalLink: ExternalLink,
    Panels: Panels,
    Templates: Templates,
    Alert,
    Condition,
    Annotations: Annotations,
    Target: Target,
    publish: publish,
    generateGraphId: generateGraphId,
    configure: config.configure
};
