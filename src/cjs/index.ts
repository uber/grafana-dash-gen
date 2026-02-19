import api, {
    type Alert as _Alert,
    type Condition as _Condition,
    type Dashboard as _Dashboard,
    type ExternalLink as _ExternalLink,
    type Row as _Row,
    type Target as _Target,
} from '../index.js';

// Keeps `require('grafana-dash-gen')` returning the API object itself, with
// `g.Dashboard` etc. usable as types, as before the ESM conversion.
// Only compiled by tsconfig.cjs.json.
const dashgen = api;
namespace dashgen {
    export type Alert = _Alert;
    export type Condition = _Condition;
    export type Dashboard = _Dashboard;
    export type ExternalLink = _ExternalLink;
    export type Row = _Row;
    export type Target = _Target;
}

export = dashgen;
