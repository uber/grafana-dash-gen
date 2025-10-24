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

var Dashboard = require('./dashboard');
var Row = require('./row');
var ExternalLink = require('./external-link');
var Target = require('./target');
var Panels = require('./panels');
var Alert = require('./alert/alert');
var Condition = require('./alert/condition');
var Templates = require('./templates');
var publish = require('./publish');
var generateGraphId = require('./id');
var config = require('./config');
var Annotations = require('./annotations');

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
    configure: config.configure,
};
