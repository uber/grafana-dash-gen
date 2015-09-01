'use strict';

var chalk = require('chalk');
var request = require('request');
var config = require('./config');
var errors = require('./errors');

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
            chalk.red('Unable to publish dashboard ' + state.title);
            return;
        }

        if (resp.statusCode === 412) {
            chalk.red('Unable to publish dashboard: ' + state.title);
            chalk.red('Error: ' + (resp.body && resp.body.message || 'n/a'));
            return;
        }

        if ([200, 201].indexOf(resp.statusCode) === -1) {
            chalk.red('Unable to publish dashboard ' + state.title);
            chalk.red('Body: ' + resp.body);
            chalk.red('Got statusCode: ' + resp.statusCode);
            chalk.white('An invalid auth token results in a 302 error!');
            return;
        }
        chalk.green('Published the dashboard ' + state.title);
    });
}

module.exports = publish;
