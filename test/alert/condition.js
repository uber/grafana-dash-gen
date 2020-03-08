const test = require('tape');
const Condition = require('../../grafana/alert/condition');

test('condition .withEvaluator', assert => {
  const condition = new Condition()
    .withEvaluator(2, 'gt')
    .generate();

  assert.deepEqual(condition.evaluator, {
    params: [2],
    type: 'gt'
  });
  assert.end();
});

test('condition .withEvaluator should accept array of values', assert => {
  const condition = new Condition()
    .withEvaluator([2, 4], 'within_range')
    .generate();

  assert.deepEqual(condition.evaluator, {
    params: [2, 4],
    type: 'within_range',
  });
  assert.end();
});

test('condition .witEvaluator should throw when passing a weird value', assert => {
  const condition = new Condition();
  assert.throws(() => condition.withEvaluator(2, 'bla'));
  assert.end();
});

test('condition .withOperator', assert => {
  const condition = new Condition()
    .withOperator('or')
    .generate();

  assert.deepEqual(condition.operator, {type: 'or'});
  assert.end();
});

test('condition .withOperator should throw when passing invalid value', assert => {
  const condition = new Condition();
  assert.throws(() => condition.withOperator('bla'));
  assert.end();
});

test('condition .orCondition', assert => {
  const condition = new Condition()
    .orCondition()
    .generate();

  assert.deepEqual(condition.operator, {type: 'or'});
  assert.end();
});

test('condition .andCondition', assert => {
  const condition = new Condition()
    .andCondition()
    .generate();

  assert.deepEqual(condition.operator, {type: 'and'});
  assert.end();
});

test('condition should have default and operator', assert => {
  const condition = new Condition().generate();

  assert.deepEqual(condition.operator, {type: 'and'});
  assert.end();
});

test('condition should allow setting the query metric with .onQuery', assert => {
  const condition = new Condition()
    .onQuery('D', '60m', 'now')
    .generate();

  assert.deepEqual(condition.query.params[0], 'D');
  assert.deepEqual(condition.query.params[1], '60m');
  assert.deepEqual(condition.query.params[2], 'now');
  assert.end();
});

test('condition should throw when using .onQuery with a weird value', assert => {
  const condition = new Condition();
  assert.throws(() => condition.onQuery(2));
  assert.end();
});

test('condition should allow choosing condition reducer type', assert => {
  const condition = new Condition()
    .withReducer('min')
    .generate();

  assert.deepEqual(condition.reducer, {params: [], type: 'min'});
  assert.end();
});

test('condition should throw when using .withReducer with a weird value', assert => {
  const condition = new Condition();
  assert.throws(() => condition.withReducer('bla'));
  assert.end();
});

test('override condition values from constructor', assert => {
  const overrideReducer = {
    reducer: {
      params: [],
      type: 'max',
    }
  };
  const condition = new Condition(overrideReducer).generate();

  assert.deepEqual(condition.reducer, {
    params: [],
    type: 'max',
  });
  assert.end();
});
