'use strict';

var grafana = require('./index');
var Row = grafana.Row;
var Dashboard = grafana.Dashboard;
var Panels = grafana.Panels;
var Target = grafana.Target;

// For grafana v1, the URL should look something like:
//
//   https://your.grafana.com/elasticsearch/grafana-dash/dashboard/
//
// Bascially, grafana v1 used elastic search as its backend, but grafana v2
// has it's own backend. Because of this, the URL for grafana v2 should look
// something like this:
//
//   https://your.grafana.com/grafana2/grafana-dash/dashboard/
grafana.configure({
    url: 'https://your.grafana.com/elasticsearch/grafana-dash/dashboard/',
    cookie: 'auth-openid=someidhere'
});

var dashboard = new Dashboard({
   title: 'TEST Api dashboard',
   slug: 'test-api',
   templating: [{
       name: 'dc',
       options: ['dc1', 'dc2']
   }, {
       name: 'smoothing',
       options: ['30min', '10min', '5min', '2min', '1min']
   }],
   annotations: [{
       name: 'Deploy',
       target: 'stats.$dc.production.deploy'
   }]
});

var row = new Row();

var panel = new Panels.Graph({
  title: 'api req/sec',
  span: 5,
  targets: [
      new Target('api.statusCode.*').
                  transformNull(0).
                  sum().
                  hitcount('1seconds').
                  scale(0.1).
                  alias('rps')
  ],
  row: row,
  dashboard: dashboard
});

var requestVolume = new Panels.SingleStat({
    title: 'Current Request Volume',
    postfix: 'req/sec',
    targets: [
        new Target('stats.$dc.counts').
                sum().scale(0.1)
    ],
    row: new Row(),
    dashboard: dashboard
});

console.log(dashboard.generate());
grafana.publish(dashboard);
