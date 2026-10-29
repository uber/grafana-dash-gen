import { writeFileSync } from 'node:fs';

// The package is "type": "module", so mark the CommonJS build as commonjs.
writeFileSync('grafana/cjs/package.json', '{ "type": "commonjs" }\n');
