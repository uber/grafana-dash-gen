'use strict';

var chalk = require('chalk');
var request = require('request');
var config = require('./config');
var errors = require('./errors');

/* eslint-disable no-console,no-undef */
var info = function info(str) {
    console.log(chalk.white(str));
};
var success = function success(str) {
    console.log(chalk.green(str));
};
var error = function error(str) {
    console.log(chalk.red(str));
};
/* eslint-enable no-console, no-undef */

function publish(dashboard) {
    if (!dashboard) {
        throw errors.UnfulfilledRequirement({
            component: 'grafana.publish',
            unfulfilledArg: 'dashboard'
        });
    }

    var state = dashboard.state;
    var cfg = config.getConfig();

    if (!state || !state.title) {
        throw errors.InvalidState({
            component: 'grafana.Dashboard',
            invalidArg: 'title',
            reason: 'undefined'
        });
    }

    if (!cfg.url) {
        throw errors.Misconfigured({
            invalidArg: 'url',
            reason: 'undefined',
            resolution: 'Must call grafana.configure before publishing'
        });
    }

    if (!cfg.cookie) {
        throw errors.Misconfigured({
            invalidArg: 'cookie',
            reason: 'undefined'
        });
    }

    var reqData = {
        dashboard: dashboard.generate(),
        overwrite: true // always overwrite existing when publishing
    };

    var j = request.jar();
    var cookie = request.cookie(cfg.cookie);
    j.setCookie(cookie, cfg.url);

    request({
        url: cfg.url,
        method: 'POST',
        json: reqData,
        jar: j
    }, function publishResponseHandler(err, rawResp) {
        var resp = rawResp && rawResp.toJSON() || {};
        if (err) {
            error('Unable to publish dashboard ' + state.title);
            return;
        }

        if (resp.statusCode === 412) {
            error('Unable to publish dashboard: ' + state.title);
            error('Error: ' + (resp.body && resp.body.message || 'n/a'));
            return;
        }

        if ([200, 201].indexOf(resp.statusCode) === -1) {
            error('Unable to publish dashboard ' + state.title);
            error('Body: ' + resp.body);
            error('Got statusCode: ' + resp.statusCode);
            info('An invalid auth token results in a 302 error!');
            return;
        }
        success('Published the dashboard ' + state.title);
    });
}

module.exports = publish;
