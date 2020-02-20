const Condition = require('../../grafana/alert/condition');

function ConditionBuilder() {
  const that = this;

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
    type: 'avg'
  };

  function withEvaluator(value, type) {
    const types = ['gt', 'lt', 'within_range'];

    if (!types.includes(type)) {
      throw Error(`Evaluator type must be one of [${types.toString()}]`);
    }

    that._evaluator.type = type;

    if (['gt', 'lt'].includes(type)) {
      that._evaluator.params = [value];
    } else if (Array.isArray(value)) {
      that._evaluator.params = value;
    }

    return this;
  }

  function withOperator(operator) {
    const types = ['and', 'or'];

    if (!types.includes(operator)) {
      throw Error(`Operator must be one of [${types.toString}]`);
    }

    that._operator.type = operator;
    return this;
  }

  function orCondition() {
    that._operator.type = 'or';
    return this;
  }

  function andCondition() {
    that._operator.type = 'and';
    return this;
  }

  function onQuery(query) {
    if (typeof query !== 'string') {
      throw Error('Query identifier must be a string. eg. "A" or "B", etc...');
    }
    that._query.params[0] = query;

    return this;
  }

  function withReducer(type) {
    const types = ['min', 'max', 'sum', 'avg', 'count', 'last', 'median', 'diff'];

    if (!types.includes(type)) {
      throw Error(`Reducer has to be one of [${types.toString()}]`);
    }

    that._reducer.type = type;
    return this;
  }

  function build() {
    return new Condition({
      evaluator: that._evaluator,
      operator: that._operator,
      query: that._query,
      reducer: that._reducer,
      type: 'query',
    })
      .generate();
  }

  return {
    withEvaluator,
    withOperator,
    withReducer,
    orCondition,
    andCondition,
    onQuery,
    build,
  }
}

module.exports = ConditionBuilder;
