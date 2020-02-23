const Condition = require('./index').Condition;

function Alert(opts) {
  opts = opts || {};
  const self = this;

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

  Object.keys(opts).forEach(function eachOpt(opt) {
    if (opt === 'conditions') {
      self.state[opt] = opts[opt].map(condition => new Condition(condition))
    } else {
      self.state[opt] = opts[opt];
    }
  });
}

Alert.prototype.addCondition = function addCondition(condition) {
  this.state.conditions.push(condition);
  return this;
};

Alert.prototype.generate = function generate() {
  this.state.conditions = this.state.conditions.map(condition => condition.generate());
  return this.state;
};

module.exports = Alert;
