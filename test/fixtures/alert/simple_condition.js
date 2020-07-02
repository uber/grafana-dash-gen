module.exports = {
  type: 'query',
  query: {
    params: [
      'A',
      '5m',
      'now'
    ]
  },
  reducer: {
    type: 'avg',
    params: []
  },
  evaluator: {
    type: 'gt',
    params: []
  },
  operator: {
    type: 'and'
  }
};
