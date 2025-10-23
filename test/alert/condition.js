const test = require('tape');
const Condition = require('../../grafana/alert/condition');

test('condition .withEvaluator', (t) => {
    const condition = new Condition().withEvaluator(2, 'gt').generate();

    t.deepEqual(condition.evaluator, {
        params: [2],
        type: 'gt',
    });
    t.end();
});

test('condition .withEvaluator should accept array of values', (t) => {
    const condition = new Condition()
        .withEvaluator([2, 4], 'within_range')
        .generate();

    t.deepEqual(condition.evaluator, {
        params: [2, 4],
        type: 'within_range',
    });
    t.end();
});

test('condition .witEvaluator should throw when passing a weird value', (t) => {
    const condition = new Condition();
    t.throws(() => condition.withEvaluator(2, 'bla'));
    t.end();
});

test('condition .withOperator', (t) => {
    const condition = new Condition().withOperator('or').generate();

    t.deepEqual(condition.operator, { type: 'or' });
    t.end();
});

test('condition .withOperator should throw when passing invalid value', (t) => {
    const condition = new Condition();
    t.throws(() => condition.withOperator('bla'));
    t.end();
});

test('condition .orCondition', (t) => {
    const condition = new Condition().orCondition().generate();

    t.deepEqual(condition.operator, { type: 'or' });
    t.end();
});

test('condition .andCondition', (t) => {
    const condition = new Condition().andCondition().generate();

    t.deepEqual(condition.operator, { type: 'and' });
    t.end();
});

test('condition should have default and operator', (t) => {
    const condition = new Condition().generate();

    t.deepEqual(condition.operator, { type: 'and' });
    t.end();
});

test('condition should allow setting the query metric with .onQuery', (t) => {
    const condition = new Condition().onQuery('D', '60m', 'now').generate();

    t.deepEqual(condition.query.params[0], 'D');
    t.deepEqual(condition.query.params[1], '60m');
    t.deepEqual(condition.query.params[2], 'now');
    t.end();
});

test('condition should throw when using .onQuery with a weird value', (t) => {
    const condition = new Condition();
    t.throws(() => condition.onQuery(2));
    t.end();
});

test('condition should allow choosing condition reducer type', (t) => {
    const condition = new Condition().withReducer('min').generate();

    t.deepEqual(condition.reducer, { params: [], type: 'min' });
    t.end();
});

test('condition should throw when using .withReducer with a weird value', (t) => {
    const condition = new Condition();
    t.throws(() => condition.withReducer('bla'));
    t.end();
});

test('override condition values from constructor', (t) => {
    const overrideReducer = {
        reducer: {
            params: [],
            type: 'max',
        },
    };
    const condition = new Condition(overrideReducer).generate();

    t.deepEqual(condition.reducer, {
        params: [],
        type: 'max',
    });
    t.end();
});
