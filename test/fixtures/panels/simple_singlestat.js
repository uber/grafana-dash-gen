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

module.exports = {
	cacheTimeout: null,
	colorBackground: false,
	colorValue: false,
	colors: ['rgba(71, 212, 59, 0.4)', 'rgba(245, 150, 40, 0.73)', 'rgba(225, 40, 40, 0.59)'],
	editable: true,
	error: false,
	format: 'none',
	id: 5,
	interval: null,
	links: [],
	maxDataPoints: 100,
	nullPointMode: 'connected',
	nullText: null,
	postfix: '',
	postfixFontSize: '50%',
	prefix: '',
	prefixFontSize: '50%',
	span: 12,
	sparkline: {
		fillColor: 'rgba(134, 178, 214, 0.41)',
		full: true,
		lineColor: 'rgb(31, 193, 58)',
		show: true
	},
	targets: [],
	thresholds: '',
	title: 'single stat',
	type: 'singlestat',
	valueFontSize: '80%',
	valueMaps: [{
		op: '=',
		text: 'N/A',
		value: 'null'
	}],
	valueName: 'current',
	datasource: 'graphite'
}
