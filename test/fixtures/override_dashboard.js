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
module.exports = {
  id: null,
  title: 'custom title',
  originalTitle: 'Generated Dashboard',
  tags: ['foo', 'bar'],
  style: 'dark',
  timezone: 'browser',
  editable: true,
  hideControls: false,
  sharedCrosshair: false,
  refresh: '1m',
  schemaVersion: 6,
  hideAllLegends: false,
  rows: [],
  templating: {
    enable: true,
    list: [{
        allFormat: 'glob',
        current: {
          text: 'a',
          value: 'a'
        },
        datasource: null,
        includeAll: false,
        allValue: '',
        name: 'myvar',
        options: [{
            text: 'a',
            value: 'a'
        }, {
            text: 'b',
            value: 'b'
        }],
        query: 'a,b',
        refresh: 1,
        'refresh_on_load': false,
        type: 'custom'
    }, {
        allFormat: 'glob',
        current: {
            text: '30min',
            value: '30min'
        },
        datasource: null,
        includeAll: false,
        allValue: '',
        name: 'smoothing',
        options: [{
            text: '30min',
            value: '30min'
        }, {
            text: '10min',
            value: '10min'
        }, {
            text: '5min',
            value: '5min'
        }, {
            text: '2min', value: '2min'
        }, {
            text: '1min',
            value: '1min'
        }],
        query: '30min,10min,5min,2min,1min',
        refresh: 1,
        'refresh_on_load': false,
        type: 'custom'
    }]
  },
  annotations: {
    enable: true,
    list: [{
        name: 'Deploy Completed',
        datasource: 'graphite',
        showLine: true,
        iconColor: 'rgb(255, 234, 0)',
        lineColor: 'rgba(165, 161, 70, 0.59)',
        iconSize: 10,
        enable: true,
        target: 'path.to.metric.with.annotation'
    }]
  },
  time: null,
  links: [],
};
