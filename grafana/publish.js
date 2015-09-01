'use strict';
var request = require('request');
var config = require('./config');
var errors = require('./errors');

// Utility method for determining whether a string ends with a
// specific character
function endsWith(str, char) {
    return str.lastIndexOf(char) === str.length - 1;
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

    if (!state.slug && !state.meta.slug) {
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

    // var separator = endsWith(cfg.url, '/') ? '' : '/';
    // var deleteUrl = [cfg.url, state.slug].join(separator);
    var createData = {
        dashboard: dashboard.generate()
    };

    var j = request.jar();
    var cookie = request.cookie(cfg.cookie);
    j.setCookie(cookie, cfg.url);

    request({
        url: cfg.url,
        method: 'POST',
        json: createData,
        jar: j
    }, function createResponseHandler(createErr, rawCreateResp) {
        var createResp = rawCreateResp.toJSON();
        if (createErr) {
            console.log('Unable to publish dashboard ' + state.title);
        } else if (createResp.statusCode === 412) {
            console.log('Unable to publish dashboard: ' + state.title + ' already exists');
            /* TODO: should delete here?
            request({
              url: deleteUrl,
              method: 'DELETE',
              jar: j
            }, function deleteResponseHandler(deleteErr, rawDeleteResp) {
                if (deleteErr) {
                    console.log('Unable to publish dashboard ' + state.title);
                }
                var deleteResp = rawDeleteResp.toJSON();
                console.log(deleteResp.statusCode);
                // if success, re-publish
            });
            */
        } else {
            if ([200, 201].indexOf(createResp.statusCode) === -1) {
                console.log('Unable to publish dashboard ' + state.title);
                console.log(createResp.body);
                console.log('Got statusCode' + createResp.statusCode);
                console.log('An invalid auth token results in a 302 error!');
            } else {
                console.log('Published the dashboard ' + state.title);
            }
        }
    });
}

module.exports = publish;
