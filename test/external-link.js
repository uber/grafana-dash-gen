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

'use strict';

var test = require('tape');
var ExternalLink = require('../grafana/external-link');
var defaultExternalLink = require('./fixtures/external_link');

test('default external link', function t(assert) {
  var externalLink = new ExternalLink({
    title: "Uber Home Page",
    url: "www.uber.com",
  });
  assert.deepEqual(externalLink.generate(), defaultExternalLink);
  assert.end();
});

test('external link with custom settings', function t(assert) {
  var externalLink = new ExternalLink({
    title: "Uber Home Page",
    tooltip: "click to view",
    url: "www.uber.com",
  })
    .includeTimeFilter()
    .includeVariableValues()
    .withIcon("custom icon");

  assert.deepEqual(externalLink.generate(), {
    title: 'Uber Home Page',
    tooltip: "click to view",
    url: "www.uber.com",
    tags: [],
    icon: "custom icon",
    targetBlank: true,
    type: "link",
    includeVars: true,
    keepTime: true,
  });
  assert.end();
});

test('external link validates required fields', function t(assert) {
  assert.throws(
    () => new ExternalLink().generate(),
    new SyntaxError("a title for the link must be provided"),
  );
  assert.throws(
    () => new ExternalLink({title: "Uber Home Page"}).generate(),
    new SyntaxError("a url for the link must be provided"),
  );
  assert.end();
});



