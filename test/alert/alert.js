const test = require('tape');
const Alert = require('../../grafana/alert/alert');
const Condition = require('../../grafana/alert/condition');
const simpleAlert = require('../fixtures/alert/simple_alert');
const alertWithCondition = require('../fixtures/alert/alert_with_condition');

test('simple alert', function t(assert) {
  const alert = new Alert();

  assert.deepEqual(alert.generate(), simpleAlert);
  assert.end();
});

test('alert should be able to add condition', assert => {
  const alert = new Alert();
  const condition = new Condition()
    .onQuery('A')
    .withReducer('min')
    .withEvaluator(1.1, 'gt');

  alert.addCondition(condition);

  assert.deepEqual(alert.generate(), alertWithCondition);
  assert.end();
});

