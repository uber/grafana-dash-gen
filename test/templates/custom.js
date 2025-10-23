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
var Custom = require('../../grafana/templates/custom');

var simpleCustom = require('../fixtures/templates/simple_custom');
var overrideCustom = require('../fixtures/templates/override_custom');
var overrideCustomTextValue = require('../fixtures/templates/override_custom_text_value');

test('Custom template has defaults', function (t) {
    var template = new Custom();
    t.deepEqual(template.state, simpleCustom);
    t.end();
});

test('Custom template creates state', function (t) {
    var name = 'custom';
    var options = ['a', 'b'];
    var template = new Custom({
        name: name,
        options: options,
        arbitraryProperty: 'foo',
    });
    t.deepEqual(template.state, overrideCustom);
    t.end();
});

test('Custom template generates state', function (t) {
    var name = 'custom';
    var options = ['a', 'b'];
    var template = new Custom({
        name: name,
        options: options,
        arbitraryProperty: 'foo',
    });
    t.deepEqual(template.generate(), overrideCustom);
    t.end();
});

test('Custom template can add options', function (t) {
    var name = 'custom';
    var options = ['a', 'b'];
    var template = new Custom({
        name: name,
        options: options,
        arbitraryProperty: 'foo',
    });
    t.deepEqual(template.state, overrideCustom);
    t.end();
});

test('Custom template can specify text and value', function (t) {
    var name = 'custom';
    var opt = {
        text: 'myText',
        value: 'myValue',
    };
    var template = new Custom({
        name: name,
        options: [opt],
        arbitraryProperty: 'foo',
    });
    t.deepEqual(template.generate(), overrideCustomTextValue);
    t.end();
});

test('Custom template overwrites default state', function (t) {
    var defaultTemplate = new Custom();
    t.equal(defaultTemplate.state.includeAll, false);

    var customTemplate = new Custom({
        includeAll: true,
        arbitraryProperty: 'foo',
    });
    t.equal(customTemplate.state.includeAll, true);
    t.equal(customTemplate.state.allValue, '');
    t.deepEqual(customTemplate.state.current, {});

    var customWithAllValue = new Custom({
        includeAll: true,
        arbitraryProperty: 'foo',
        allValue: 'grafana',
    });
    t.equal(customWithAllValue.state.includeAll, true);
    t.deepEqual(customWithAllValue.state.current, {});
    t.equal(customWithAllValue.state.allValue, 'grafana');

    var allIsDefault = new Custom({
        includeAll: true,
        arbitraryProperty: 'foo',
        options: [{ text: 'grafana', value: 'grafana' }],
    });
    t.equal(allIsDefault.state.includeAll, true);
    t.equal(allIsDefault.state.allValue, '');
    t.deepEqual(allIsDefault.state.current, {});

    var firstIsDefault = new Custom({
        arbitraryProperty: 'foo',
        options: [{ text: 'grafana', value: 'grafana' }],
    });
    t.equal(firstIsDefault.state.includeAll, false);
    t.equal(firstIsDefault.state.allValue, '');
    t.equal(firstIsDefault.state.current, firstIsDefault.state.options[0]);

    t.end();
});

test('Custom template supports custom default', function (t) {
    const defaultOption = { text: 'dash-gen', value: 'dash-gen' };
    var definedDefault = new Custom({
        includeAll: true,
        defaultValue: defaultOption.value,
        options: [{ text: 'grafana', value: 'grafana' }, defaultOption],
    });
    t.equal(definedDefault.state.includeAll, true);
    t.equal(definedDefault.state.allValue, '');
    t.equal(definedDefault.state.current, defaultOption);

    t.throws(
        () =>
            new Custom({
                includeAll: true,
                defaultValue: defaultOption.value,
                options: [{ text: 'grafana', value: 'grafana' }],
            }),
        new SyntaxError('default value not found in options list')
    );

    t.throws(
        () =>
            new Custom({
                includeAll: true,
                defaultValue: defaultOption.value,
            }),
        new SyntaxError('cannot define default value without any options')
    );

    t.throws(
        () =>
            new Custom({
                defaultValue: defaultOption.value,
            }),
        new SyntaxError('cannot define default value without any options')
    );

    t.end();
});
