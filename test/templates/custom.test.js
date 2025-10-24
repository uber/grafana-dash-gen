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

var Custom = require('../../grafana/templates/custom');

var simpleCustom = require('../fixtures/templates/simple_custom');
var overrideCustom = require('../fixtures/templates/override_custom');
var overrideCustomTextValue = require('../fixtures/templates/override_custom_text_value');

test('Custom template has defaults', function () {
    var template = new Custom();
    expect(template.state).toEqual(simpleCustom);
});

test('Custom template creates state', function () {
    var name = 'custom';
    var options = ['a', 'b'];
    var template = new Custom({
        name: name,
        options: options,
        arbitraryProperty: 'foo',
    });
    expect(template.state).toEqual(overrideCustom);
});

test('Custom template generates state', function () {
    var name = 'custom';
    var options = ['a', 'b'];
    var template = new Custom({
        name: name,
        options: options,
        arbitraryProperty: 'foo',
    });
    expect(template.generate()).toEqual(overrideCustom);
});

test('Custom template can add options', function () {
    var name = 'custom';
    var options = ['a', 'b'];
    var template = new Custom({
        name: name,
        options: options,
        arbitraryProperty: 'foo',
    });
    expect(template.state).toEqual(overrideCustom);
});

test('Custom template can specify text and value', function () {
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
    expect(template.generate()).toEqual(overrideCustomTextValue);
});

test('Custom template overwrites default state', function () {
    var defaultTemplate = new Custom();
    expect(defaultTemplate.state.includeAll).toBe(false);

    var customTemplate = new Custom({
        includeAll: true,
        arbitraryProperty: 'foo',
    });
    expect(customTemplate.state.includeAll).toBe(true);
    expect(customTemplate.state.allValue).toBe('');
    expect(customTemplate.state.current).toEqual({});

    var customWithAllValue = new Custom({
        includeAll: true,
        arbitraryProperty: 'foo',
        allValue: 'grafana',
    });
    expect(customWithAllValue.state.includeAll).toBe(true);
    expect(customWithAllValue.state.current).toEqual({});
    expect(customWithAllValue.state.allValue).toBe('grafana');

    var allIsDefault = new Custom({
        includeAll: true,
        arbitraryProperty: 'foo',
        options: [{ text: 'grafana', value: 'grafana' }],
    });
    expect(allIsDefault.state.includeAll).toBe(true);
    expect(allIsDefault.state.allValue).toBe('');
    expect(allIsDefault.state.current).toEqual({});

    var firstIsDefault = new Custom({
        arbitraryProperty: 'foo',
        options: [{ text: 'grafana', value: 'grafana' }],
    });
    expect(firstIsDefault.state.includeAll).toBe(false);
    expect(firstIsDefault.state.allValue).toBe('');
    expect(firstIsDefault.state.current).toBe(firstIsDefault.state.options[0]);
});

test('Custom template supports custom default', function () {
    const defaultOption = { text: 'dash-gen', value: 'dash-gen' };
    var definedDefault = new Custom({
        includeAll: true,
        defaultValue: defaultOption.value,
        options: [{ text: 'grafana', value: 'grafana' }, defaultOption],
    });
    expect(definedDefault.state.includeAll).toBe(true);
    expect(definedDefault.state.allValue).toBe('');
    expect(definedDefault.state.current).toBe(defaultOption);

    expect(
        () =>
            new Custom({
                includeAll: true,
                defaultValue: defaultOption.value,
                options: [{ text: 'grafana', value: 'grafana' }],
            })
    ).toThrow(new SyntaxError('default value not found in options list'));

    expect(
        () =>
            new Custom({
                includeAll: true,
                defaultValue: defaultOption.value,
            })
    ).toThrow(
        new SyntaxError('cannot define default value without any options')
    );

    expect(
        () =>
            new Custom({
                defaultValue: defaultOption.value,
            })
    ).toThrow(
        new SyntaxError('cannot define default value without any options')
    );
});
