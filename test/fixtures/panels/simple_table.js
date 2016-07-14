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
    title: "Panel Title",
    error: false,
    span: 12,
    editable: true,
    type: "table",
    isNew: true,
    id: 1,
    styles: 
    [{
        type: "date",
        pattern: "Time",
        dateFormat: "YYYY-MM-DD HH:mm:ss"
    },{
        unit: "short",
        type: "number",
        decimals: 0,
        colors: [
            "rgba(245, 54, 54, 0.9)",
            "rgba(237, 129, 40, 0.89)",
            "rgba(50, 172, 45, 0.97)"
        ],
        colorMode: null,
        pattern: "/.*/",
        thresholds: []
    }],
    targets: [],
    transform: "timeseries_aggregations",
    pageSize: null,
    showHeader: true,
    columns: 
    [{
        text: "Avg",
        value: "avg"
    }],
    scroll: true,
    fontSize: "100%",
    sort: {
        col: 0,
        desc: true
    },
    links: []
};
