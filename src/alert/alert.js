class Alert {
    constructor(opts = {}) {
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

    _init(opts) {
        Object.keys(opts).forEach((opt) => {
            this.state[opt] = opts[opt];
        });
    }

    _initConditions(opts) {
        this.state.conditions = this.state.conditions || [];

        if (opts.conditions) {
            this.conditions = this.conditions.concat(opts.conditions);
        }
    }

    addCondition(condition) {
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

module.exports = Alert;
