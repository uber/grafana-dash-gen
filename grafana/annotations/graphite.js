'use strict';

function Graphite(opts) {
	opts = opts || {};
	var self = this;

	self.state = {
		name: opts.name,
		datasource: 'graphite',
		showLine: true,
        iconColor: 'rgb(255, 234, 0)',
        lineColor: 'rgba(165, 161, 70, 0.59)',
        iconSize: 10,
		enable: true,
		target: opts.target
	};
}

Graphite.prototype.generate = function generate() {
	return this.state;
};

module.exports = Graphite;
