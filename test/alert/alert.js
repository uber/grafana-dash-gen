const test = require('tape');
const Alert = require('../../grafana/alert/alert');
const Condition = require('../../grafana/alert/condition');
const simpleAlert = require('../fixtures/alert/simple_alert');
const alertWithCondition = require('../fixtures/alert/alert_with_condition');

test('simple alert', function (t) {
    const alert = new Alert();

    t.deepEqual(alert.generate(), simpleAlert);
    t.end();
});

test('alert should be able to add condition', (t) => {
    const alert = new Alert();
    const condition = new Condition()
        .onQuery('B', '5m', 'now')
        .withReducer('min')
        .withEvaluator(1.1, 'gt');

    alert.addCondition(condition);

    t.deepEqual(alert.generate(), alertWithCondition);
    t.end();
});

test('alert should be able to override defaults from the constructor', (t) => {
    const overrideOptions = {
        name: 'override name',
        for: '30min',
    };

    const alert = new Alert(overrideOptions);
    const actualAlert = alert.generate();

    t.deepEqual(actualAlert.name, overrideOptions.name);
    t.deepEqual(actualAlert.for, overrideOptions.for);
    t.end();
});

test('alert should be able to receive conditions in the constructor', (t) => {
    const condition = new Condition({
        type: 'query',
        query: {
            params: ['B', '5m', 'now'],
        },
        reducer: {
            type: 'min',
            params: [],
        },
        evaluator: {
            type: 'gt',
            params: [1.1],
        },
        operator: {
            type: 'and',
        },
    });

    const overrideConditions = { conditions: [condition] };
    const alert = new Alert(overrideConditions);

    t.deepEqual(alert.generate(), alertWithCondition);
    t.end();
});
