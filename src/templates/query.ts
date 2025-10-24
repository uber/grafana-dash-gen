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

import type { GrafanaQueryTemplate } from '../grafana';

/**
 * Provide a query to populate template variable.
 *
 * @param {string} query - The stat which will be queried.
 * @param {object} opts - Any state overrides, complete state of a query.
 *
 * @example
 * new Query('servers.*.docker.std-service-*', {
 *     name: 'servers',
 *     datasource: 'graphite',
 *     includeAll: true,
 *     allFormat: 'wildcard',
 *     multi: true,
 *     multiFormat: 'glob',
 *     regex: '/(.*)\\-us\\d+/'
 * });
 *
 * @see http://docs.grafana.org/reference/templating/
 */
class Query {
    state: GrafanaQueryTemplate;
    private _required: string[];
    private _overridable: string[];
    constructor(query: string, opts: Partial<GrafanaQueryTemplate> = {}) {
        this.state = {
            query: query,
            // todo: added default
            name: opts.name || '',
            datasource: opts.datasource,
            type: 'query',
            includeAll: true,
            allFormat: 'wildcard',
            allValue: null,
            refresh: false,
            multi: false,
            options: [],
            current: {},
        };

        this._required = ['name', 'datasource'];

        this._overridable = [
            'includeAll',
            'allFormat',
            'allValue',
            'multi',
            'multiFormat',
            'refresh',
            'regex',
            'tag',
        ];

        // Override overridable values
        Object.keys(opts).forEach((opt) => {
            if (this._overridable.indexOf(opt) !== -1) {
                this.state[opt] = opts[opt];
            }
        });

        // assert required state has been populated
        this._required.forEach((reqOpt) => {
            if (!this.state[reqOpt]) {
                throw new Error('Missing Requirement: ' + reqOpt);
            }
        });

        // make state immutable after this point
        Object.freeze(this.state);
    }

    generate() {
        return this.state;
    }
}

export = Query;
