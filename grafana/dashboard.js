'use strict';

var Templates = require('./templates');
var Annotations = require('./annotations');

function Dashboard(opts) {
    var self = this;
    opts = opts || {};

    // initialize internal state
    this.state = {};
    this._init(opts);
    this._initMeta(opts);
    this._initRows(opts);
    this._initAnnotations(opts);
    this._initTemplating(opts);

    if (opts.templating) {
        opts.templating.forEach(function temp(template) {
            template = new Templates.Custom(template);
            self.addTemplate(template);
        });
    }

    if (opts.annotations) {
        opts.annotations.forEach(function temp(annotation) {
            annotation = new Annotations.Graphite(annotation);
            self.addAnnotation(annotation);
        });
    }
}

Dashboard.prototype._init = function _init(opts) {
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
};

Dashboard.prototype._initRows = function _initRows(opts) {
    this.rows = [];
    this.state.rows = [];
};

Dashboard.prototype._initAnnotations = function _initAnnotations(opts) {
    this.state.annotations = {
        list: [],
        enable: true
    };
};

Dashboard.prototype._initTemplating = function _initTemplating(opts) {
    this.state.templating = {
        list: [],
        enable: true
    };
};

Dashboard.prototype.addTemplate = function addTemplate(template) {
    this.state.templating.list.push(template.generate());
};

Dashboard.prototype.addAnnotation = function addAnnotation(annotation) {
    this.state.annotations.list.push(annotation.generate());
};

Dashboard.prototype.addRow = function addRow(row) {
    this.rows.push(row);
};

Dashboard.prototype.generate = function generate() {
    // Generate json for the rows
    var generatedRows = [];
    this.rows.forEach(function generateRowJson(row) {
        generatedRows.push(row.generate());
    });

    this.state.rows = generatedRows;
    return this.state;
};

module.exports = Dashboard;
