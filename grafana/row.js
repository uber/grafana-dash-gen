'use strict';

var xtend = require('xtend');

function Row(opts) {
    opts = opts || {};
    var self = this;

    var state = {
      title: 'New row',
      height: '250px',
      editable: true,
      collapse: false,
      panels: []
    };

    this.state = xtend(state, opts);
    this.panels = [];

    if (opts.panels) {
        opts.panels.forEach(function addP(panel) {
            self.addPanel(panel);
        });
    }
}

Row.prototype.generate = function generate() {
    var generatedPanels = [];
    this.panels.forEach(function generatePanel(panel) {
        generatedPanels.push(panel.generate());
    });

    this.state.panels = generatedPanels;
    return this.state;
};

Row.prototype.addPanel = function addPanel(panel) {
    this.panels.push(panel);
};

module.exports = Row;
