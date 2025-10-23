const Condition = require('../../../src/alert/condition');
const Alert = require('../../../src/alert/alert');

const getAlert = () => {
    const condition = new Condition()
        .onQuery('B', '5m', 'now')
        .withReducer('min')
        .withEvaluator(1.1, 'gt');

    return new Alert().addCondition(condition);
};

module.exports.getAlert = getAlert;
