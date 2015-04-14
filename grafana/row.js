'use strict';

function Row(opts) {
	opts = opts || {};
	
	this.state = {
      'title': 'New row',
      'height': '250px',
      'editable': true,
      'collapse': false,
      'panels': []
	};

	this.panels = [];
}

Row.prototype.generate = function generate() {
	var generatedJson = [];
	this.panels.forEach(function generatePannelJson(panel) {
		generatedJson.push(panel.generate());
	});

	this.state.panels = generatedJson;
	return this.state;
};

Row.prototype.addPanel = function addPanel(panel) {
	this.panels.push(panel);
};

module.exports = Row;
