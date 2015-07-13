'use strict';

var test = require('cached-tape');
var Graphite = require('../../grafana/annotations/graphite');

var simpleGraphite = require('../fixtures/annotations/graphite');

test('Graphite annotation has requirements', function t(assert) {
    assert.throws(function assertThrows() {
        new Graphite();
    }, /UnfulfilledRequirement/);
    assert.end();
});

test('Graphite annotation requires name', function t(assert) {
    assert.throws(function assertThrows() {
        new Graphite({target: 'foo'});
    }, /UnfulfilledRequirement/);
    assert.end();
});

test('Graphite annotation requires target', function t(assert) {
    assert.throws(function assertThrows() {
        new Graphite({name: 'foo'});
    }, /UnfulfilledRequirement/);
    assert.end();
});

test('Graphite annotation creates state', function t(assert) {
    var annotation = new Graphite({
      name: 'custom name',
      target: 'custom.target'
    });
    assert.deepEqual(annotation.state, simpleGraphite);
    assert.end();
});

test('Graphite annotation generates state', function t(assert) {
    var annotation = new Graphite({
      name: 'custom name',
      target: 'custom.target'
    });
    assert.deepEqual(annotation.generate(), simpleGraphite);
    assert.end();
});
