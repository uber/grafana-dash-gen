module.exports = {
  name: 'Panel Title alert',
  conditions: [{
    type: 'query',
    query: {
      params: [
        'B',
        '5m',
        'now'
      ]
    },
    reducer: {
      type: 'min',
      params: []
    },
    evaluator: {
      type: 'gt',
      params: [1.1]
    },
    operator: {
      type: 'and'
    }
  }],
  for: '15m',
  frequency: '5m',
  message: '',
  notifications: [],
  executionErrorState: 'keep_state',
  noDataState: 'keep_state',
  alertRuleTags: {},
  handler: 1,
};
