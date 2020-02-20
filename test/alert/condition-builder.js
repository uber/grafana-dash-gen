const test = require('tape');
const ConditionBuilder = require('../../grafana/alert/condition-builder');

test('condition builder .withEvaluator', assert => {
  const conditionBuilder = new ConditionBuilder();
  conditionBuilder.withEvaluator(2, 'gt');
  const condition = conditionBuilder.build();

  assert.deepEqual(condition.evaluator, {
    params: [2],
    type: 'gt'
  });
  assert.end();
});

test('condition builder .withEvaluator should accept array of values', assert => {
  const condition = new ConditionBuilder()
    .withEvaluator([2, 4], 'within_range')
    .build();

  assert.deepEqual(condition.evaluator, {
    params: [2, 4],
    type: 'within_range',
  });
  assert.end();
});

test('condition builder .witEvaluator should throw when passing a weird value', assert => {
  const conditionBuilder = new ConditionBuilder();
  assert.throws(() => conditionBuilder.withEvaluator(2, 'bla'));
  assert.end();
});

test('condition builder .withOperator', assert => {
  const conditionBuilder = new ConditionBuilder();
  const condition = conditionBuilder
    .withOperator('or')
    .build();

  assert.deepEqual(condition.operator, {type: 'or'});
  assert.end();
});

test('condition builder .withOperator should throw when passing invalid value', assert => {
  const conditionBuilder = new ConditionBuilder();
  assert.throws(() => conditionBuilder.withOperator('bla'));
  assert.end();
});

test('condition builder .orCondition', assert => {
  const conditionBuilder = new ConditionBuilder();
  const condition = conditionBuilder
    .orCondition()
    .build();

  assert.deepEqual(condition.operator, {type: 'or'});
  assert.end();
});

test('condition builder .andCondition', assert => {
  const conditionBuilder = new ConditionBuilder();
  const condition = conditionBuilder
    .andCondition()
    .build();

  assert.deepEqual(condition.operator, {type: 'and'});
  assert.end();
});

test('condition builder should have default and operator', assert => {
  const conditionBuilder = new ConditionBuilder();
  const condition = conditionBuilder.build();

  assert.deepEqual(condition.operator, {type: 'and'});
  assert.end();
});

test('condition builder should allow setting the query metric with .onQuery', assert => {
  const conditionBuilder = new ConditionBuilder();
  const condition = conditionBuilder
    .onQuery('D')
    .build();

  assert.deepEqual(condition.query.params[0], 'D');
  assert.end();
});

test('condition builder should throw when using .onQuery with a weird value', assert => {
  const conditionBuilder = new ConditionBuilder();
  assert.throws(() => conditionBuilder.onQuery(2));
  assert.end();
});

test('condition builder should allow choosing condition reducer type', assert => {
  const conditionBuilder = new ConditionBuilder();
  const condition = conditionBuilder
    .withReducer('min')
    .build();

  assert.deepEqual(condition.reducer, {params: [], type: 'min'});
  assert.end();
});

test('condition builder should throw when using .withReducer with a weird value', assert => {
  const conditionBuilder = new ConditionBuilder();
  assert.throws(() => conditionBuilder.withReducer('bla'));
  assert.end();
});
