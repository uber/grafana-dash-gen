function Alert(opts) {
  opts = opts || {};
  const self = this;

  const defaults = {
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

  this.state = defaults;

  // Overwrite defaults with custom values
  Object.keys(opts).forEach(function eachOpt(opt) {
    self.state[opt] = opts[opt];
  });
}

Alert.prototype.addCondition = function addCondition(condition) {
  this.state.conditions.push(condition);
  return this;
};

Alert.prototype.generate = function generate() {
  return this.state;
};

module.exports = Alert;
