'use strict';

var _ = require('underscore');
var util = require('util');

var Target = function Target() {
    if (typeof arguments[0] === 'string') {
        // Format string
        this.source = util.format.apply(null, arguments);
    } else {
        // Another target
        this.source = arguments[0];
        this.func = arguments[1];
    }
};

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
var methods = {
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
    useSeriesAbove: 3
};

_.each(methods, function each(n, method) {
    Target.prototype[method] = function t() {
        if (arguments.length < n) {
            console.warn("Incorrect number of arguments passed to %s", method);
            console.trace();
        }
        return new Target(this,
            [method].concat(Array.prototype.slice.call(arguments, 0)));
    };
});

var colors = [
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

_.each(colors, function each(color) {
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

Target.prototype.perSecond = function perSecond() {
    return this.scale(0.1);
};

Target.prototype.summarize15min = function summarize15min() {
    return this.summarize('15min');
};

module.exports = Target;
