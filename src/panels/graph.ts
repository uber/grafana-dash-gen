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
import type { GrafanaGraphPanel } from '../grafana.js';
import type Row from '../row.js';
import type Dashboard from '../dashboard.js';
import type Alert from '../alert/alert.js';

type GraphPanelOptions = Partial<
    GrafanaGraphPanel & {
        row: Row;
        dashboard: Dashboard;
    }
>;

class Graph {
    private _currentRefIndex: number;
    state: GrafanaGraphPanel;
    constructor(opts: GraphPanelOptions = {}) {
        this._currentRefIndex = 0;

        const defaults: GrafanaGraphPanel = {
            type: 'graph',
            id: generateGraphId(),
            renderer: 'flot',
            title: 'no title (click here)',
            error: false,
            editable: true,
            'x-axis': true,
            'y-axis': true,
            y_formats: ['short', 'short'],
            grid: {
                leftMax: null,
                rightMax: null,
                leftMin: null,
                rightMin: null,
                threshold1: null,
                threshold2: null,
                threshold1Color: 'rgba(216, 200, 27, 0.27)',
                threshold2Color: 'rgba(234, 112, 112, 0.22)',
            },
            lines: true,
            span: 12,
            fill: 0,
            linewidth: 1,
            points: false,
            pointradius: 5,
            bars: false,
            stack: false,
            percentage: false,
            targets: [],
            legend: {
                show: true,
                values: true,
                min: false,
                max: true,
                current: false,
                total: false,
                avg: true,
            },
            nullPointMode: 'null as zero',
            steppedLine: false,
            tooltip: {
                value_type: 'cumulative',
                shared: false,
            },
            aliasColors: {},
            seriesOverrides: [{}],
            links: [],
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

    addAlert(alert: Alert) {
        this.state.alert = alert.generate();
    }

    addTarget(target: string & { hide: any }) {
        const refs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const builtTarget = target.toString();

        const targetWithRefs: { target: string; hide: unknown; refId: string } =
            {
                target: builtTarget,
                hide: target.hide,
                // todo: can potentially run out of bounds
                refId: refs[this._currentRefIndex++]!,
            };

        const targetFull = handleRefTargets(builtTarget, this.state.targets);
        const targetToAdd = Object.assign({}, targetWithRefs, targetFull);
        this.state.targets.push(targetToAdd);
    }
}

function getRefsFromTarget(target: string) {
    const refMatchRegex = /.*?#(\w)[,)]/g;
    const refs = [];
    let matches;

    while ((matches = refMatchRegex.exec(target))) {
        refs.push(matches[1]);
    }
    return refs;
}

type TargetObject = {
    target: string;
    hide: unknown;
    refId: string;
    targetFull?: string | undefined;
};

function handleRefTargets(
    target: string,
    targets: TargetObject[]
): { targetFull?: string | undefined } {
    if (target.includes('#')) {
        const refs = getRefsFromTarget(target);
        const findTargetByRefId = (targets: TargetObject[], refId: string) => {
            const found = targets.find((target) => target.refId === refId);
            if (!found) {
                throw new Error(
                    `Invalid target reference: #${refId} does not exist. Available refs: ${targets.map((t) => t.refId).join(', ')}`
                );
            }
            return found.target;
        };

        return {
            targetFull: refs.reduce(
                (res, ref) =>
                    res.replace(`#${ref}`, findTargetByRefId(targets, ref)),
                target
            ),
        };
    }

    return {};
}

export default Graph;
