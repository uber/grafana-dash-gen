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

import Templates = require('./templates');
import Annotations = require('./annotations');
import ExternalLink = require('./external-link');

class Dashboard {
    state: any;
    rows: any[];
    links: any[];
    constructor(opts = {}) {
        this.state = {};
        this._init(opts);
        this._initRows(opts);
        this._initLinks(opts);
        this._initTemplating(opts);
        this._initAnnotations(opts);
    }

    _init(opts) {
        this.state.id = opts.id || null;
        this.state.title = opts.title || 'Generated Grafana Dashboard';
        this.state.originalTitle = opts.originalTitle || 'Generated Dashboard';
        this.state.tags = opts.tags || [];
        this.state.style = opts.style || 'dark';
        this.state.timezone = opts.timezone || 'browser';
        this.state.editable = true;
        this.state.hideControls = !!opts.hideControls;
        this.state.sharedCrosshair = !!opts.sharedCrosshair;
        this.state.refresh = opts.refresh || false;
        this.state.schemaVersion = opts.schemaVersion || 6;
        this.state.hideAllLegends = !!opts.hideAllLegends;
        this.state.time = opts.time || null;
        if ('editable' in opts) {
            this.state.editable = opts.editable;
        }
    }

    _initRows(opts) {
        this.rows = [];
        this.state.rows = [];

        if (opts.rows) {
            opts.rows.forEach((row) => {
                this.addRow(row);
            });
        }
    }

    _initLinks(opts) {
        this.links = opts.links || [];
        this.state.links = [];
    }

    _initTemplating(opts) {
        this.state.templating = {
            list: [],
            enable: true,
        };

        if (opts.templating) {
            opts.templating.forEach((template) => {
                template = new Templates.Custom(template);
                this.addTemplate(template);
            });
        }
    }

    _initAnnotations(opts) {
        this.state.annotations = {
            list: [],
            enable: true,
        };

        if (opts.annotations) {
            opts.annotations.forEach((annotation) => {
                annotation = new Annotations.Graphite(annotation);
                this.addAnnotation(annotation);
            });
        }
    }

    addRow(row) {
        this.rows.push(row);
    }

    addTemplate(template) {
        this.state.templating.list.push(template.generate());
    }

    addAnnotation(annotation) {
        this.state.annotations.list.push(annotation.generate());
    }

    generate() {
        // Generate jsons.
        this.state.rows = this.rows.map((row) => row.generate());
        this.state.links = this.links.map((link) => {
            if (link instanceof ExternalLink) {
                return link.generate();
            }
            return link;
        });

        return this.state;
    }
}

export = Dashboard;
