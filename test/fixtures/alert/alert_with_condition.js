module.exports = {
  "name": "Panel Title alert",
  "conditions": [{
    "type": "query",
    "query": {
      "params": [
        "A",
        "5m",
        "now"
      ]
    },
    "reducer": {
      "type": "avg",
      "params": []
    },
    "evaluator": {
      "type": "gt",
      "params": []
    },
    "operator": {
      "type": "and"
    }
  }],
  "for": "15m",
  "frequency": "5m",
  "message": '',
  "notifications": [],
  "executionErrorState": "keep_state",
  "noDataState": "keep_state",
  "alertRuleTags": {},
  "handler": 1,
};
