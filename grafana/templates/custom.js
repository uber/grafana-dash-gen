'use strict';

function Custom(opts) {
	opts = opts || {};
	var self = this;

	this.state = {
        'type': 'custom',
        'datasource': null,
        'refresh_on_load': false,
        'name': 'dc',
        'options': [],
        'includeAll': false,
        'allFormat': 'glob',
        'query': 'sjc1,dca1',
        'current': {
          'text': 'sjc1',
          'value': 'sjc1'
        }
    };

    this.state.name = opts.name || 'template';

    if (opts.options) {
		opts.options.forEach(function addOp(option) {
			self.addOption(option, true);
		});
    }
}

Custom.prototype.addOption = function addOption(option, defaultOption){
	this.state.options.push({
		'text': option,
		'value': option
	});

	// update the query
	var query = [];
	this.state.options.forEach(function forEach(op) {
		query.push(op.text);
	});

	this.state.query = query.join(',');

	if (defaultOption) {
		this.state.current = {
			text: option,
			value: option
		};
	}
};

Custom.prototype.generate = function generate() {
	return this.state;
};

module.exports = Custom;
