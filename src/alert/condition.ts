import type { GrafanaCondition } from '../grafana';

class Condition {
    private state: GrafanaCondition;
    private _evaluator: { params: any[]; type: string };
    private _operator: { type: string };
    private _query: { params: string[] };
    private _reducer: { params: any[]; type: string };
    constructor(opts = {}) {
        // @ts-expect-error todo: should fields be optional?
        this.state = {};

        this._evaluator = {
            params: [],
            type: 'gt',
        };

        this._operator = {
            type: 'and',
        };

        this._query = {
            params: ['A', '5m', 'now'],
        };

        this._reducer = {
            params: [],
            type: 'avg',
        };

        Object.keys(opts).forEach((opt) => {
            this.state[opt] = opts[opt];
        });
    }
    withEvaluator(value, type) {
        const types = ['gt', 'lt', 'within_range'];

        if (!types.includes(type)) {
            throw Error(`Evaluator type must be one of [${types.toString()}]`);
        }

        this._evaluator.type = type;

        if (['gt', 'lt'].includes(type)) {
            this._evaluator.params = [value];
        } else if (Array.isArray(value)) {
            this._evaluator.params = value;
        }

        return this;
    }
    withOperator(operator) {
        const types = ['and', 'or'];

        if (!types.includes(operator)) {
            throw Error(`Operator must be one of [${types.toString}]`);
        }

        this._operator.type = operator;
        return this;
    }
    orCondition() {
        this._operator.type = 'or';
        return this;
    }
    andCondition() {
        this._operator.type = 'and';
        return this;
    }
    onQuery(query, duration, from) {
        if (typeof query !== 'string') {
            throw Error(
                'Query identifier must be a string. eg. "A" or "B", etc...'
            );
        }
        this._query.params[0] = query;
        this._query.params[1] = duration;
        this._query.params[2] = from;

        return this;
    }
    withReducer(type) {
        const types = [
            'min',
            'max',
            'sum',
            'avg',
            'count',
            'last',
            'median',
            'diff',
        ];

        if (!types.includes(type)) {
            throw Error(`Reducer has to be one of [${types.toString()}]`);
        }

        this._reducer.type = type;
        return this;
    }
    generate() {
        return Object.assign(
            {},
            {
                evaluator: this._evaluator,
                operator: this._operator,
                query: this._query,
                reducer: this._reducer,
                type: 'query',
            },
            this.state
        );
    }
}

export = Condition;
