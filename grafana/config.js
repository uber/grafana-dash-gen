'use strict';
var xtend = require('xtend');

/**
 * `user` - Auth user, defaults to "guest"
 * `group` - Auth group, defaults to "guest"
 * `url` - Full URL to grafana's elasticsearch endpoint
 * `cookie` - Key/value pair for auth, defaults to"auth-openid="
 */
var configurations = {
    user: 'guest',
    group: 'guest',
    url: 'https://your.graphite.url.com/elasticsearch/grafana-dash/dashboard/',
    cookie: 'auth-openid='
};

function configure(opts) {
    configurations = xtend(configurations, opts);
}

function getConfig() {
    return configurations;
}

module.exports = {
    configure: configure,
    getConfig: getConfig
};
