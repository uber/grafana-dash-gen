var test = require('tape');
var Condition = require('../../grafana/alert').Condition;
var simpleCondition = require('../fixtures/alert/simple_condition');

test('simple condition', function t(assert) {
  var condition = new Condition();

  assert.deepEqual(condition.generate(), simpleCondition);
  assert.end();
});
