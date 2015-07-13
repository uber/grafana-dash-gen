'use strict';

var Templates = require('./templates');
var Annotations = require('./annotations');

function Dashboard(opts) {
    opts = opts || {};
    var self = this;

    this.state = {};

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
    this.state.version = opts.version || 6;
    this.state.hideAllLegends = !!opts.hideAllLegends;

    this.state.meta = {};
    this.state.meta.slug = opts.slug || this.state.title.split(' ').join('-');

    this.state.rows = [];

    this.state.annotations = {
        list: [],
        enable: true
    };

    this.state.templating = {
        list: [],
        enable: true
    };

    this.state.annotations = {
        list: [],
        enable: true
    };

    if (opts.templating) {
        opts.templating.forEach(function temp(template) {
            template = new Templates.Custom(template);
            self.addTemplate(template);
        });
    }

    if (opts.annotations) {
        opts.annotations.forEach(function temp(annotation){
            annotation = new Annotations.Graphite(annotation);
            self.addAnnotation(annotation);
        });
    }

    this.rows = [];
}

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
    var generatedJson = [];
    this.rows.forEach(function generateRowJson(row) {
        generatedJson.push(row.generate());
    });

    this.state.rows = generatedJson;
    return JSON.stringify(this.state, null, '\t');
};

module.exports = Dashboard;
