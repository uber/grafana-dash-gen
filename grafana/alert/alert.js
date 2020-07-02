function Alert(opts) {
  opts = opts || {};
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

Alert.prototype._init = function _init(opts) {
  const self = this;

  Object.keys(opts).forEach(function eachOpt(opt) {
    self.state[opt] = opts[opt];
  });
}

Alert.prototype._initConditions = function _initConditions(opts) {
  var self = this;
  this.state.conditions = this.state.conditions || [];

  if (opts.conditions) {
    self.conditions = self.conditions.concat(opts.conditions);
  }
};

Alert.prototype.addCondition = function addCondition(condition) {
  this.conditions.push(condition);
  return this;
};

Alert.prototype.generate = function generate() {
  this.state.conditions = this.conditions.map(condition => condition.generate());
  return this.state;
};

module.exports = Alert;
