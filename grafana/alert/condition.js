function Condition(opts) {
  opts = opts || {};
  const self = this;

  const defaults = {
    evaluator: {
      params: [],
      type: 'gt',
    },
    operator: {
      type: 'and',
    },
    query: {
      params: ['A', '5m', 'now']
    },
    reducer: {
      params: [],
      type: 'avg'
    },
    type: 'query'
  };

  this.state = defaults;

  // Overwrite defaults with custom values
  Object.keys(opts).forEach(function eachOpt(opt) {
    self.state[opt] = opts[opt];
  });
}

Condition.prototype.generate = function generate() {
  return this.state;
};

module.exports = Condition;
