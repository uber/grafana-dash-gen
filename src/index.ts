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

import Dashboard from './dashboard.js';
import Row from './row.js';
import ExternalLink from './external-link.js';
import Target from './target.js';
import * as Panels from './panels/index.js';
import Alert from './alert/alert.js';
import Condition from './alert/condition.js';
import * as Templates from './templates/index.js';
import publish from './publish.js';
import generateGraphId from './id.js';
import { configure } from './config.js';
import * as Annotations from './annotations/index.js';

export {
    Dashboard, Row, ExternalLink, Target,
    Panels, Alert, Condition, Templates,
    publish, generateGraphId, configure, Annotations,
};

export default {
    Dashboard, Row, ExternalLink, Target,
    Panels, Alert, Condition, Templates,
    publish, generateGraphId, configure, Annotations,
};
