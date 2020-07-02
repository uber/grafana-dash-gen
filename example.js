'use strict';

var grafana = require('./index');
var Row = grafana.Row;
var Dashboard = grafana.Dashboard;
var Panels = grafana.Panels;
var Target = grafana.Target;
var Alert = grafana.Alert;
var Condition = grafana.Condition;

// For grafana v1, the URL should look something like:
//
//   https://your.grafana.com/elasticsearch/grafana-dash/dashboard/
//
// Bascially, grafana v1 used elastic search as its backend, but grafana v2
// has its own backend. Because of this, the URL for grafana v2 should look
// something like this:
//
//   https://your.grafanahost.com/grafana2/api/dashboards/db/

grafana.configure({
    url: 'https://your.grafanahost.com/grafana2/api/dashboards/db/',
    cookie: 'auth-openid=REPLACETOKENIFAPPLICABLE',
    headers: {'x': 'y'}
});

// Dashboard Constants
var TITLE = 'TEST API dashboard';
var TAGS = ['myapp', 'platform'];
var TEMPLATING = [{
    name: 'dc',
    options: ['dc1', 'dc2']
}, {
    name: 'smoothing',
    options: ['30min', '10min', '5min', '2min', '1min']
}];
var ANNOTATIONS = [{
    name: 'Deploy',
    target: 'stats.$dc.production.deploy'
}];
var REFRESH = '1m';

// Target prefixes
var SERVER_PREFIX = 'servers.app*-$dc.myapp.';
var COUNT_PREFIX = 'stats.$dc.counts.myapp.';

function generateDashboard() {
    // Rows
    var volumeRow = new Row({
        title: 'Request Volume'
    });
    var systemRow = new Row({
        title: 'System / OS'
    });

    // Panels: request volume
    var rpsGraphPanel = new Panels.Graph({
        title: 'req/sec',
        span: 8,
        targets: [
            new Target(COUNT_PREFIX + 'statusCode.*').
                        transformNull(0).
                        sum().
                        hitcount('1seconds').
                        scale(0.1).
                        alias('rps')
        ]
    });

    // set alert on request volume when it's (max) value is lower than 1 req / sec
    var condition = new Condition()
      .withReducer('max')
      .withEvaluator(1, 'lt')
      .onQuery('A');

    var alert = new Alert()
      .addCondition(condition);

    rpsGraphPanel.addAlert(alert);

    var rpsStatPanel = new Panels.SingleStat({
        title: 'Current Request Volume',
        postfix: 'req/sec',
        span: 4,
        targets: [
            new Target(COUNT_PREFIX + 'statusCode.*').
                    sum().
                    scale(0.1)
        ]
    });

    var favDashboardList = new Panels.DashboardList({
        title: 'My Favorite Dashboard',
        span: 4,
        mode: 'search',
        query: 'dashboard list'
    });

    // Panels: system health
    var cpuGraph = new Panels.Graph({
        title: 'CPU',
        span: 4,
        targets: [
            new Target(SERVER_PREFIX + 'cpu.user').
                nonNegativeDerivative().
                scale(1 / 60).
                scale(100).
                averageSeries().
                alias('avg'),
            new Target(SERVER_PREFIX + 'cpu.user').
                nonNegativeDerivative().
                scale(1 / 60).
                scale(100).
                percentileOfSeries(95, false).
                alias('p95')
        ]
    });
    var rssGraph = new Panels.Graph({
        title: 'Memory',
        span: 4,
        targets: [
            new Target(SERVER_PREFIX + 'memory.rss').
                averageSeries().
                alias('rss')
        ]
    });
    var fdsGraph = new Panels.Graph({
        title: 'FDs',
        span: 4,
        targets: [
            new Target(SERVER_PREFIX + 'fds').
                averageSeries().
                movingAverage('10min').
                alias('moving avg')
        ]
    });

    // Dashboard
    var dashboard = new Dashboard({
        title: TITLE,
        tags: TAGS,
        templating: TEMPLATING,
        annotations: ANNOTATIONS,
        refresh: REFRESH
    });

    // Layout: panels
    volumeRow.addPanel(rpsGraphPanel);
    volumeRow.addPanel(rpsStatPanel);
    volumeRow.addPanel(favDashboardList);
    systemRow.addPanel(cpuGraph);
    systemRow.addPanel(rssGraph);
    systemRow.addPanel(fdsGraph);

    // Layout: rows
    dashboard.addRow(volumeRow);
    dashboard.addRow(systemRow);

    // Finish
    grafana.publish(dashboard);
}

module.exports = {
    generate: generateDashboard
};

if (require.main === module) {
    generateDashboard();
}
