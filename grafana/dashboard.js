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

var Templates = require('./templates');
var Annotations = require('./annotations');
var ExternalLink = require('./external-link')

function Dashboard(opts) {
    opts = opts || {};
    this.state = {};
    this._init(opts);
    this._initRows(opts);
    this._initLinks(opts);
    this._initTemplating(opts);
    this._initAnnotations(opts);
}

Dashboard.prototype._init = function _init(opts) {
    this.state = this.state;
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
    if("editable" in opts) {
        this.state.editable = opts.editable;
    }
};

Dashboard.prototype._initRows = function _initRows(opts) {
    var self = this;

    this.rows = [];
    this.state.rows = [];

    if (opts.rows) {
        opts.rows.forEach(function r(row) {
            self.addRow(row);
        });
    }
};

Dashboard.prototype._initLinks = function _initLinks(opts) {
  this.links = opts.links || [];
  this.state.links = [];
};

Dashboard.prototype._initTemplating = function _initRows(opts) {
    var self = this;

    this.state.templating = {
        list: [],
        enable: true
    };

    if (opts.templating) {
        opts.templating.forEach(function temp(template) {
            template = new Templates.Custom(template);
            self.addTemplate(template);
        });
    }
};

Dashboard.prototype._initAnnotations = function _initAnnotations(opts) {
    var self = this;

    this.state.annotations = {
        list: [],
        enable: true
    };

    if (opts.annotations) {
        opts.annotations.forEach(function temp(annotation) {
            annotation = new Annotations.Graphite(annotation);
            self.addAnnotation(annotation);
        });
    }
};

Dashboard.prototype.addRow = function addRow(row) {
    this.rows.push(row);
};

Dashboard.prototype.addTemplate = function addTemplate(template) {
    this.state.templating.list.push(template.generate());
};

Dashboard.prototype.addAnnotation = function addAnnotation(annotation) {
    this.state.annotations.list.push(annotation.generate());
};

Dashboard.prototype.generate = function generate() {
    // Generate jsons.
    this.state.rows = this.rows.map(row => row.generate());
    this.state.links = this.links.map(link => {
      if (link instanceof ExternalLink) {
        return link.generate()
      }
      return link
    });

    return this.state;
};

module.exports = Dashboard;
