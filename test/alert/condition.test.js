// Copyright (c) 2015 Uber Technologies, Inc.
// Copyright (c) 2026 Stalin
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

const Condition = require('../../src/alert/condition');

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
    // @ts-expect-error intentionally bad input
    expect(() => condition.withEvaluator(2, 'bla')).toThrow();
});

test('condition .withOperator', () => {
    const condition = new Condition().withOperator('or').generate();

    expect(condition.operator).toEqual({ type: 'or' });
});

test('condition .withOperator should throw when passing invalid value', () => {
    const condition = new Condition();
    // @ts-expect-error intentionally bad input
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
    // @ts-expect-error intentionally bad input
    expect(() => condition.onQuery(2)).toThrow();
});

test('condition .onQuery should retain the default time range when omitted', () => {
    const condition = new Condition().onQuery('B').generate();

    expect(condition.query.params).toEqual(['B', '5m', 'now']);
    expect(JSON.parse(JSON.stringify(condition)).query.params).toEqual([
        'B',
        '5m',
        'now',
    ]);
});

test('condition .onQuery should default only the omitted time arguments', () => {
    expect(new Condition().onQuery('B', '60m').generate().query.params).toEqual(
        ['B', '60m', 'now']
    );
    expect(
        new Condition().onQuery('B', undefined, '1m').generate().query.params
    ).toEqual(['B', '5m', '1m']);
});

test('condition should allow choosing condition reducer type', () => {
    const condition = new Condition().withReducer('min').generate();

    expect(condition.reducer).toEqual({ params: [], type: 'min' });
});

test('condition should throw when using .withReducer with a weird value', () => {
    const condition = new Condition();
    // @ts-expect-error intentionally bad input
    expect(() => condition.withReducer('bla')).toThrow();
});

test('override condition values from constructor', () => {
    const overrideReducer = {
        reducer: {
            params: [],
            type: 'max',
        },
    };
    // @ts-expect-error type is not inferred correctly in js file
    const condition = new Condition(overrideReducer).generate();

    expect(condition.reducer).toEqual({
        params: [],
        type: 'max',
    });
});
