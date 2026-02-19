import type {
    GrafanaCondition,
    GrafanaEvaluatorType,
    GrafanaOperatorType,
    GrafanaReducerType,
} from '../grafana.js';

class Condition {
    private state: Partial<GrafanaCondition>;
    private _evaluator: GrafanaCondition['evaluator'];
    private _operator: GrafanaCondition['operator'];
    private _query: GrafanaCondition['query'];
    private _reducer: GrafanaCondition['reducer'];
    constructor(opts: Partial<GrafanaCondition> = {}) {
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
    withEvaluator(value: (string | number)[], type: 'within_range'): Condition;
    withEvaluator(value: string | number, type: 'gt' | 'lt'): Condition;
    withEvaluator(
        value: (string | number) | (string | number)[],
        type: GrafanaEvaluatorType
    ) {
        const types = ['gt', 'lt', 'within_range'];

        if (!types.includes(type)) {
            throw Error(`Evaluator type must be one of [${types.toString()}]`);
        }

        this._evaluator.type = type;

        if (['gt', 'lt'].includes(type)) {
            this._evaluator.params = [value as string];
        } else if (Array.isArray(value)) {
            this._evaluator.params = value;
        }

        return this;
    }
    withOperator(operator: GrafanaOperatorType) {
        const types = ['and', 'or'] as const;

        if (!types.includes(operator)) {
            throw Error(`Operator must be one of [${types.toString()}]`);
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
    onQuery(query: string, duration?: string, from?: string) {
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
    withReducer(type: GrafanaReducerType) {
        const types = [
            'min',
            'max',
            'sum',
            'avg',
            'count',
            'last',
            'median',
            'diff',
        ] satisfies GrafanaReducerType[];

        if (!types.includes(type)) {
            throw Error(`Reducer has to be one of [${types.toString()}]`);
        }

        this._reducer.type = type;
        return this;
    }
    generate(): GrafanaCondition {
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

export default Condition;
