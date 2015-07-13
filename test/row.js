'use strict';

var test = require('cached-tape');
var Row = require('../grafana/row');

var simpleRow = require('./fixtures/simple_row.js');
var overrideRow = require('./fixtures/override_row.js');
var panelData = {
    foo: 'foo',
    bar: 'bar',
    baz: 1
};

test('Simple row', function t(assert) {
    var row = new Row();
    assert.deepEqual(row.generate(), simpleRow);
    assert.end();
});

test('Row with overriden information', function t(assert) {
    var panel1 = {
      generate: function generate() {
          return panelData;
      }
    };
    var row = new Row({
        title: 'My Row',
        height: '1000px',
        editable: false,
        collapse: true,
        panels: [panel1]
    });
    assert.deepEqual(row.generate(), overrideRow);
    assert.end();
});

test('Add panels to row when passed', function t(assert) {
    var panel1 = {
      foo: 'foo',
      bar: 'bar',
      baz: 1
    };
    var panel2 = {
      foo: 'foo2',
      bar: 'bar2',
      baz: 2
    };
    var row = new Row({
        panels: [panel1, panel2]
    });

    assert.deepEqual(row.state.panels, [panel1, panel2]);
    assert.end();
});

test('Row can add panels', function t(assert) {
    var row = new Row({
        title: 'My Row',
        height: '1000px',
        editable: false,
        collapse: true
    });
    var panel1 = {
      foo: 'foo',
      bar: 'bar',
      baz: 1
    };
    var panel2 = {
      foo: 'foo2',
      bar: 'bar2',
      baz: 2
    };

    row.addPanel(panel1);
    row.addPanel(panel2);
    assert.deepEqual(row.panels, [panel1, panel2]);
    assert.end();
});

test('Row generates state', function t(assert) {
    var panel = {
      generate: function generate() {
          return panelData;
      }
    };
    var row = new Row({
        title: 'My Row',
        height: '1000px',
        editable: false,
        collapse: true,
        panels: [panel]
    });

    assert.deepEqual(row.generate(), overrideRow);
    assert.end();
});
