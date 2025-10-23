const Condition = require('../../grafana/alert/condition');

test('condition .withEvaluator', () => {
    const condition = new Condition().withEvaluator(2, 'gt').generate();

    expect(condition.evaluator).toEqual({
        params: [2],
        type: 'gt',
    });
});

test('condition .withEvaluator should accept array of values', () => {
    const condition = new Condition()
        .withEvaluator([2, 4], 'within_range')
        .generate();

    expect(condition.evaluator).toEqual({
        params: [2, 4],
        type: 'within_range',
    });
});

test('condition .witEvaluator should throw when passing a weird value', () => {
    const condition = new Condition();
    expect(() => condition.withEvaluator(2, 'bla')).toThrow();
});

test('condition .withOperator', () => {
    const condition = new Condition().withOperator('or').generate();

    expect(condition.operator).toEqual({ type: 'or' });
});

test('condition .withOperator should throw when passing invalid value', () => {
    const condition = new Condition();
    expect(() => condition.withOperator('bla')).toThrow();
});

test('condition .orCondition', () => {
    const condition = new Condition().orCondition().generate();

    expect(condition.operator).toEqual({ type: 'or' });
});

test('condition .andCondition', () => {
    const condition = new Condition().andCondition().generate();

    expect(condition.operator).toEqual({ type: 'and' });
});

test('condition should have default and operator', () => {
    const condition = new Condition().generate();

    expect(condition.operator).toEqual({ type: 'and' });
});

test('condition should allow setting the query metric with .onQuery', () => {
    const condition = new Condition().onQuery('D', '60m', 'now').generate();

    expect(condition.query.params[0]).toEqual('D');
    expect(condition.query.params[1]).toEqual('60m');
    expect(condition.query.params[2]).toEqual('now');
});

test('condition should throw when using .onQuery with a weird value', () => {
    const condition = new Condition();
    expect(() => condition.onQuery(2)).toThrow();
});

test('condition should allow choosing condition reducer type', () => {
    const condition = new Condition().withReducer('min').generate();

    expect(condition.reducer).toEqual({ params: [], type: 'min' });
});

test('condition should throw when using .withReducer with a weird value', () => {
    const condition = new Condition();
    expect(() => condition.withReducer('bla')).toThrow();
});

test('override condition values from constructor', () => {
    const overrideReducer = {
        reducer: {
            params: [],
            type: 'max',
        },
    };
    const condition = new Condition(overrideReducer).generate();

    expect(condition.reducer).toEqual({
        params: [],
        type: 'max',
    });
});
