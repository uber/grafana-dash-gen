var test = require('tape');
var Alert = require('../../grafana/alert/alert');
var Condition = require('../../grafana/alert/condition');
var simpleAlert = require('../fixtures/alert/simple_alert');
var alertWithCondition = require('../fixtures/alert/alert_with_condition');
var condition = require('../fixtures/alert/simple_condition');

test('simple alert', function t(assert) {
  var alert = new Alert();

  assert.deepEqual(alert.generate(), simpleAlert);
  assert.end();
});

test('alert with conditions override', function t(assert) {
    var alert = new Alert({
    conditions: [condition]
  });

  assert.deepEqual(alert.generate(), alertWithCondition);
  assert.end();
});
