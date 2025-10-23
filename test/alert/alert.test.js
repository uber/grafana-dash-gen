const Alert = require('../../grafana/alert/alert');
const Condition = require('../../grafana/alert/condition');
const simpleAlert = require('../fixtures/alert/simple_alert');
const alertWithCondition = require('../fixtures/alert/alert_with_condition');

test('simple alert', function () {
    const alert = new Alert();

    expect(alert.generate()).toEqual(simpleAlert);
});

test('alert should be able to add condition', () => {
    const alert = new Alert();
    const condition = new Condition()
        .onQuery('B', '5m', 'now')
        .withReducer('min')
        .withEvaluator(1.1, 'gt');

    alert.addCondition(condition);

    expect(alert.generate()).toEqual(alertWithCondition);
});

test('alert should be able to override defaults from the constructor', () => {
    const overrideOptions = {
        name: 'override name',
        for: '30min',
    };

    const alert = new Alert(overrideOptions);
    const actualAlert = alert.generate();

    expect(actualAlert.name).toEqual(overrideOptions.name);
    expect(actualAlert.for).toEqual(overrideOptions.for);
});

test('alert should be able to receive conditions in the constructor', () => {
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

    expect(alert.generate()).toEqual(alertWithCondition);
});
