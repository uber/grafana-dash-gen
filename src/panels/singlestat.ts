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

import generateGraphId from '../id.js';
import type { GrafanaSingleStatPanel } from '../grafana.js';
import type Row from '../row.js';
import type Dashboard from '../dashboard.js';

type SingleStatOptions = Partial<
    GrafanaSingleStatPanel & {
        row: Row;
        dashboard: Dashboard;
    }
>;

class SingleStat {
    state: GrafanaSingleStatPanel;
    constructor(opts: SingleStatOptions = {}) {
        const defaults: GrafanaSingleStatPanel = {
            id: generateGraphId(),
            title: 'single stat',
            targets: [],
            error: false,
            span: 12,
            editable: true,
            type: 'singlestat',
            links: [],
            maxDataPoints: 100,
            interval: null,
            cacheTimeout: null,
            format: 'none',
            prefix: '',
            postfix: '',
            nullText: null,
            valueMaps: [
                {
                    value: 'null',
                    op: '=',
                    text: 'N/A',
                },
            ],
            nullPointMode: 'connected',
            valueName: 'current',
            prefixFontSize: '50%',
            valueFontSize: '80%',
            postfixFontSize: '50%',
            thresholds: '',
            colorBackground: false,
            colorValue: false,
            colors: [
                'rgba(71, 212, 59, 0.4)',
                'rgba(245, 150, 40, 0.73)',
                'rgba(225, 40, 40, 0.59)',
            ],
            sparkline: {
                show: true,
                full: true,
                lineColor: 'rgb(31, 193, 58)',
                fillColor: 'rgba(134, 178, 214, 0.41)',
            },
            datasource: 'graphite',
        };
        this.state = defaults;

        // Overwrite defaults with custom values
        Object.keys(opts).forEach((opt) => {
            this.state[opt] = opts[opt];
        });

        if (opts.targets) {
            this.state.targets = [];
            opts.targets.forEach((target) => {
                this.addTarget(target);
            });
        }

        // finally add to row/dashboard if given
        if (opts.row && opts.dashboard) {
            opts.row.addPanel(this);
            opts.dashboard.addRow(opts.row);
        }
    }

    generate() {
        return this.state;
    }

    setTitle(title: string) {
        this.state.title = title;
    }

    addTarget(target) {
        this.state.targets.push({
            target: target.toString(),
        });
    }
}

export default SingleStat;
