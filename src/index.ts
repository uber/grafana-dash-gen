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

import _Dashboard = require('./dashboard');
import _Row = require('./row');
import _ExternalLink = require('./external-link');
import _Target = require('./target');
import _Panels = require('./panels');
import _Alert = require('./alert/alert');
import _Condition = require('./alert/condition');
import _Templates = require('./templates');
import _publish = require('./publish');
import _generateGraphId = require('./id');
import config = require('./config');
import _Annotations = require('./annotations');

namespace _dashgen {
    export type Dashboard = _Dashboard;
    export const Dashboard = _Dashboard;
    export type Row = _Row;
    export const Row = _Row;
    export type ExternalLink = _ExternalLink;
    export const ExternalLink = _ExternalLink;
    export const Panels = _Panels;
    export const Templates = _Templates;
    export type Alert = _Alert;
    export const Alert = _Alert;
    export type Condition = _Condition;
    export const Condition = _Condition;
    export const Annotations = _Annotations;
    export type Target = _Target;
    export const Target = _Target;
    export const publish = _publish;
    export const generateGraphId = _generateGraphId;
    export const configure = config.configure;
}

export = _dashgen;
