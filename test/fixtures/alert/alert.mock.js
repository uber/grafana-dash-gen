const ConditionBuilder = require('../../../grafana/alert/condition-builder');
const Alert = require('../../../grafana/alert/alert');

const getAlert = () => {
  const condition = new ConditionBuilder()
    .onQuery('A')
    .withReducer('min')
    .withEvaluator(10, 'gt')
    .build();

  return new Alert().addCondition(condition);
};

module.exports.getAlert = getAlert;
