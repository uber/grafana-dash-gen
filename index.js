'use strict';

var Dashboard = require('./grafana/dashboard');
var Row = require('./grafana/row');
var Target = require('./grafana/target');
var Panels = require('./grafana/panels');
var Templates = require('./grafana/templates');
var publish = require('./grafana/publish');
var generateGraphId = require('./grafana/id');
var config = require('./grafana/config');
var Annotations = require('./grafana/annotations');

module.exports = {
    Dashboard: Dashboard,
    Row: Row,
    Panels: Panels,
    Templates: Templates,
    Annotations: Annotations,
    Target: Target,
    publish: publish,
    generateGraphId: generateGraphId,
    configure: config.configure
};
