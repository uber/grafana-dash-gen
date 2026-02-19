// Smoke test for the built package: run `pnpm run build` first.
// Loads grafana-dash-gen through its own `exports` map as both CommonJS and ESM.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const names = [
    'Dashboard',
    'Row',
    'ExternalLink',
    'Target',
    'Panels',
    'Alert',
    'Condition',
    'Templates',
    'Annotations',
    'publish',
    'generateGraphId',
    'configure',
];

const cjs = require('grafana-dash-gen');
assert.deepEqual(Object.keys(cjs).sort(), [...names].sort());
assert.equal(cjs.default, undefined, 'require() must return the API object');

import('grafana-dash-gen').then((esm) => {
    for (const name of names) {
        assert.equal(typeof esm[name], typeof cjs[name], `esm ${name}`);
        assert.equal(esm.default[name], esm[name], `esm default ${name}`);
    }
    const dashboard = new cjs.Dashboard({ title: 'smoke' });
    assert.equal(dashboard.generate().title, 'smoke');
    console.log('grafana-dash-gen loads as CommonJS and ESM');
});
