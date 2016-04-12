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

var _ = require('underscore');
var util = require('util');

function Target() {
    if (arguments.length === 0) {
        throw new Error('Incorrect invocation of Target. ' +
                        'Must provide at least one argument');
    }
    if (typeof arguments[0] === 'string') {
        // Format string
        this.source = util.format.apply(null, arguments);
    } else {
        // Another target
        this.source = arguments[0];
        this.func = arguments[1];
    }
}

Target.prototype.toString = function toString() {
    if (this.func) {
        var args = _.reduce(this.func.slice(1), function reduce(memo, arg) {
            if (typeof arg === 'string') {
                arg = JSON.stringify(arg);
            } else {
                arg = arg.toString();
            }
            return memo + ', ' + arg;
        }, '');
        return this.func[0] + '(' + this.source.toString() + args + ')';
    } else {
        return this.source;
    }
};

// Primitive methods
// Method Name: arity ignoring first target input
Target.PRIMITIVES = {
    absolute: 0,
    aggregateLine: 0,
    alias: 1,
    aliasByMetric: 0,
    aliasByNode: 1,
    aliasSub: 2,
    alpha: 1,
    areaBetween: 0,
    asPercent: 0,
    averageAbove: 1,
    averageBelow: 1,
    averageOutsidePercentile: 1,
    averageSeries: 0,
    averageSeriesWithWildcards: 1,
    cactiStyle: 0,
    color: 1,
    consolidateBy: 1,
    countSeries: 0,
    cumulative: 0,
    currentAbove: 1,
    currentBelow: 1,
    dashed: 0,
    derivative: 0,
    diffSeries: 1,
    divideSeries: 1,
    drawAsInfinite: 0,
    exclude: 1,
    grep: 1,
    group: 0,
    groupByNode: 2,
    highestAverage: 1,
    highestCurrent: 1,
    highestMax: 1,
    hitcount: 1,
    holtWintersAbberation: 0,
    holtWintersConfidenceArea: 0,
    holtWintersConfidenceBands: 0,
    holtWintersForecast: 0,
    integral: 0,
    invert: 0,
    isNonNull: 0,
    keepLastValue: 0,
    legendValue: 1,
    limit: 1,
    lineWidth: 1,
    logarithm: 0,
    lowestAverage: 1,
    lowestCurrent: 1,
    mapSeries: 1,
    maxSeries: 0,
    maximumAbove: 1,
    maximumBelow: 1,
    minSeries: 0,
    minimumAbove: 1,
    mostDeviant: 1,
    movingAverage: 1,
    movingMedian: 1,
    multiplySeries: 0,
    nPercentile: 1,
    nonNegativeDerivative: 0,
    offset: 1,
    offsetToZero: 0,
    perSecond: 0,
    percentileOfSeries: 1,
    rangeOfSeries: 0,
    reduceSeries: 3,
    removeAbovePercentile: 1,
    removeAboveValue: 1,
    removeBelowPercentile: 1,
    removeBelowValue: 1,
    removeBetweenPercentile: 1,
    scale: 1,
    scaleToSeconds: 1,
    secondYAxis: 0,
    smartSummarize: 1,
    sortByMaxima: 0,
    sortByMinima: 0,
    sortByName: 0,
    sortByTotal: 0,
    stacked: 0,
    stddevSeries: 0,
    stdev: 1,
    sum: 0,
    sumSeries: 0,
    sumSeriesWithWildcards: 1,
    summarize: 1,
    timeShift: 1,
    timeStack: 3,
    transformNull: 0,
    useSeriesAbove: 3,
    weightedAverage: 2
};

_.each(Target.PRIMITIVES, function each(n, method) {
    Target.prototype[method] = function t() {
        if (arguments.length < n) {
            /*eslint-disable*/
            console.warn("Incorrect number of arguments passed to %s", method);
            console.trace();
            /*eslint-enable*/
        }
        return new Target(this,
            [method].concat(Array.prototype.slice.call(arguments, 0)));
    };
});

Target.COLORS = [
    'orange',
    'blue',
    'green',
    'red',
    'white',
    'yellow',
    'brown',
    'purple',
    'pink',
    'aqua'
];

_.each(Target.COLORS, function each(color) {
    Target.prototype[color] = function t() {
        return this.color(color);
    };
});

// Target Helpers

Target.prototype.cpu = function cpu() {
    return this.derivative().scale(0.016666666667).removeBelowValue(0);
};

Target.prototype.reallyFaded = function reallyFaded() {
    return this.lineWidth(5).alpha(0.5);
};

Target.prototype.faded = function faded() {
    return this.alpha(0.5).lineWidth(5);
};

Target.prototype.lastWeek = function lastWeek() {
    return this.timeShift('7d');
};

Target.prototype.summarize15min = function summarize15min() {
    return this.summarize('15min');
};

Target.prototype.hide = function hide() {
    this.hide = true;
    return this;
};

module.exports = Target;
