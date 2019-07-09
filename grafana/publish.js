// Copyright (c) 2015 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

"use strict";
const request = require("request-promise-native");
const config = require("./config");
const errors = require("./errors");

/* eslint-disable max-statements, max-len, no-console, no-undef */
function publish(dashboard, opts) {
  opts = opts || {};

  if (!dashboard) {
    throw errors.UnfulfilledRequirement({
      component: "grafana.publish",
      unfulfilledArg: "dashboard"
    });
  }

  const state = dashboard.state;
  const cfg = config.getConfig();

  if (!state || !state.title) {
    throw errors.InvalidState({
      component: "grafana.Dashboard",
      invalidArg: "title",
      reason: "undefined"
    });
  }

  if (!cfg.url) {
    throw errors.Misconfigured({
      invalidArg: "url",
      reason: "undefined",
      resolution: "Must call grafana.configure before publishing"
    });
  }

  if (!cfg.cookie) {
    throw errors.Misconfigured({
      invalidArg: "cookie",
      reason: "undefined"
    });
  }

  const headers = cfg.headers || {};

  const createData = {
    dashboard: dashboard.generate(),
    overwrite: true
  };

  const j = request.jar();
  const cookie = request.cookie(cfg.cookie);
  j.setCookie(cookie, cfg.url);
  return request({
    url: cfg.url,
    method: "POST",
    headers: headers,
    json: createData,
    jar: j,
    timeout: opts.timeout || 1000,
    followAllRedirects: true
  })
    .then(resp => {
      console.log("Published the dashboard", state.title);
      return resp;
    })
    .catch(e => {
      console.log(
        "grafana-dash-gen: publish: caught error: ",
        e.name,
        e.message
      );
      console.log("Unable to publish dashboard ", state.title);
      console.log("response headers: ", e.response && e.response.headers);
      console.log("response body: ", e.response && e.response.body);
      console.log("response statusCode:", e.response && e.response.statusCode);
      throw e; // rethrow for downstream consumers
    });
}
/* eslint-enable */

module.exports = publish;
