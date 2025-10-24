import type { GrafanaAlert } from '../grafana';
import type Condition from './condition';

type AlertOptions = Partial<
    Omit<GrafanaAlert, 'conditions'> & {
        conditions: Condition[];
    }
>;

class Alert {
    private conditions: Condition[];

    private state: GrafanaAlert;

    constructor(opts: AlertOptions = {}) {
        this.conditions = [];

        this.state = {
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

        this._init(opts);
        this._initConditions(opts);
    }

    _init(opts: AlertOptions) {
        Object.keys(opts).forEach((opt) => {
            this.state[opt] = opts[opt];
        });
    }

    _initConditions(opts: AlertOptions) {
        this.state.conditions = this.state.conditions || [];

        if (opts.conditions) {
            this.conditions = this.conditions.concat(opts.conditions);
        }
    }

    addCondition(condition: Condition) {
        this.conditions.push(condition);
        return this;
    }

    generate() {
        this.state.conditions = this.conditions.map((condition) =>
            condition.generate()
        );
        return this.state;
    }
}

export = Alert;
