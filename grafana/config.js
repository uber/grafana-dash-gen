'use strict';
var xtend = require('xtend');

var configurations = {
    user: 'guest',
    group: 'guest',
    url: 'https://your.graphite.url.com/elasticsearch/grafana-dash/dashboard/',
    cookie: 'auth-openid=AAAAG'
};

function config(opts) {
    configurations = xtend(configurations, opts);
}

function getConfig() {
    return configurations;
}

module.exports = {
    config: config,
    getConfig: getConfig
};
