import Condition from '../../../src/alert/condition.js';
import Alert from '../../../src/alert/alert.js';

const getAlert = () => {
    const condition = new Condition()
        .onQuery('B', '5m', 'now')
        .withReducer('min')
        .withEvaluator(1.1, 'gt');

    return new Alert().addCondition(condition);
};

export { getAlert };
