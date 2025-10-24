import { GrafanaAlert } from '../../../src/grafana';

const simpleAlert: GrafanaAlert = {
    name: 'Panel Title alert',
    for: '15m',
    frequency: '5m',
    conditions: [],
    message: '',
    notifications: [],
    executionErrorState: 'keep_state',
    noDataState: 'keep_state',
    alertRuleTags: {},
    handler: 1,
};

export = simpleAlert;
