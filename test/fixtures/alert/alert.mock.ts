import Condition = require('../../../src/alert/condition');
import Alert = require('../../../src/alert/alert');

const getAlert = () => {
    const condition = new Condition()
        .onQuery('B', '5m', 'now')
        .withReducer('min')
        .withEvaluator(1.1, 'gt');

    return new Alert().addCondition(condition);
};

export = { getAlert };
