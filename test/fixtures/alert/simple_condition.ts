import { GrafanaCondition } from '../../../src/grafana';

const simpleCondition: GrafanaCondition = {
    type: 'query',
    query: {
        params: ['A', '5m', 'now'],
    },
    reducer: {
        type: 'avg',
        params: [],
    },
    evaluator: {
        type: 'gt',
        params: [],
    },
    operator: {
        type: 'and',
    },
};

export = simpleCondition;
