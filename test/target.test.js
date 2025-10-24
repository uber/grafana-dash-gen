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

var util = require('util');
var Target = require('../src/target');

test('Target throws exception on invalid invocation', function () {
    expect(function shouldThrow() {
        // @ts-expect-error intentionally invalid call
        new Target();
    }).toThrow(
        'Incorrect invocation of Target. Must provide at least one argument'
    );
});

test('Target can initialize as a single string source', function () {
    var arg = 'path.to.metric';
    var target = new Target(arg);
    expect(target.source).toBe(arg);
});

test('Target can initialize as a single interpolated string source', function () {
    var arg = 'path.to.%s.metric';
    var sub = 'foo';
    var argFinal = 'path.to.foo.metric';
    var target = new Target(arg, sub);
    expect(target.source).toBe(argFinal);
});

test('Target can initialize as a source and function', function () {
    var arg = 'path.to.metric';
    new Target(arg)
        .averageSeries()
        .movingAverage('$smoothing')
        .alias('Total P95');
});

test('Target can initialize and chain methods', function () {
    var arg = 'path.to.metric';
    var target = new Target(arg)
        .averageSeries()
        .movingAverage('$smoothing')
        .alias('Total P95');

    Object.keys(Target.PRIMITIVES).forEach(function eachPrimitive(primitive) {
        expect(typeof target[primitive] === 'function').toBeTruthy();
    });
});

test('Target warns on incorrect primitive invocation', function () {
    expect.assertions(2);
    console.warn = function warn(str) {
        expect(str).toBeTruthy();
    };
    console.trace = function trace(str) {
        expect(str).toBeFalsy();
    };
    new Target('foo').alpha();
});

test('Target color methods are generated correctly', function () {
    var arg = 'path.to.metric';
    var target = new Target(arg);

    Target.COLORS.forEach(function eachColor(color) {
        expect(typeof target[color] === 'function').toBeTruthy();
        var str = target[color]().toString();
        var expected = util.format('color(path.to.metric, "%s")', color);
        expect(str).toBe(expected);
    });
});

test('Target helper-method - color', function () {
    var arg = 'path.to.metric';
    var expected = 'color(path.to.metric, "COLOR")';
    var target = new Target(arg).color('COLOR').toString();
    expect(target).toBe(expected);
});

test('Target helper-method - cpu', function () {
    var arg = 'path.to.metric';
    var expected = [
        'removeBelowValue(',
        'scale(',
        'derivative(',
        'path.to.metric), ',
        '0.016666666667), 0)',
    ].join('');
    var target = new Target(arg).cpu().toString();
    expect(target).toBe(expected);
});

test('Target helper-method - reallyFaded', function () {
    var arg = 'path.to.metric';
    var expected = 'alpha(lineWidth(path.to.metric, 5), 0.5)';
    var target = new Target(arg).reallyFaded().toString();
    expect(target).toBe(expected);
});

test('Target helper-method - faded', function () {
    var arg = 'path.to.metric';
    var expected = 'lineWidth(alpha(path.to.metric, 0.5), 5)';
    var target = new Target(arg).faded().toString();
    expect(target).toBe(expected);
});

test('Target helper-method - lastWeek', function () {
    var arg = 'path.to.metric';
    var expected = 'timeShift(path.to.metric, "7d")';
    var target = new Target(arg).lastWeek().toString();
    expect(target).toBe(expected);
});

test('Target helper-method - summarize15min', function () {
    var arg = 'path.to.metric';
    var expected = 'summarize(path.to.metric, "15min")';
    var target = new Target(arg).summarize15min().toString();
    expect(target).toBe(expected);
    expect(target.hide).toBe(undefined);
});

test('Target can call hide()', function () {
    var target = new Target('path.to.metric').hide();

    expect(target.toString()).toBe('path.to.metric');
    expect(target.hide).toBe(true);
});
