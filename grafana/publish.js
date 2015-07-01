'use strict';
var request = require('request');
var config = require('./config');
var errors = require('./errors');

// Utility method for determining whether a string ends with a specific character
function endsWith(str, char) {
    return str.lastIndexOf(char) === str.length-1;
}

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

    if (!state.meta.slug) {
        throw errors.InvalidState({
            component: 'grafana.Dashboard',
            invalidArg: 'meta.slug',
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

    if (!cfg.user) {
        throw errors.Misconfigured({
            invalidArg: 'user',
            reason: 'undefined'
        });
    }

    if (!cfg.group) {
        throw errors.Misconfigured({
            invalidArg: 'group',
            reason: 'undefined'
        });
    }

    if (!cfg.cookie) {
        throw errors.Misconfigured({
            invalidArg: 'cookie',
            reason: 'undefined'
        });
    }

    var separator = endsWith(cfg.url, '/') ? '' : '/';
    var putUrl = [cfg.url, state.meta.slug].join(separator);
    var putData = {
        user: cfg.user,
        group: cfg.group,
        title: state.title,
        tags: state.tags,
        dashboard: dashboard.generate()
    };

    var j = request.jar();
    var cookie = request.cookie(cfg.cookie);
    j.setCookie(cookie, cfg.url);

    request({
        url: putUrl,
        method: 'PUT',
        json: putData,
        jar: j
    }, function responseHandler(err, response) {
        if (err) {
            console.log('Unable to publish dashboard ' + state.title);
        } else {
            if ([200, 201].indexOf(response.statusCode) === -1) {
                console.log('Unable to publish dashboard ' + state.title);
                console.log(response.body);
                console.log('Got statusCode' + response.statusCode);
                console.log('An invalid auth token results in a 302 error!');
            } else {
                console.log('Published the dashboard ' + state.title);
            }
        }
    });
}

module.exports = publish;
