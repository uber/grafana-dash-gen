'use strict';

var test = require('cached-tape');
var Custom = require('../../grafana/templates/custom');

var simpleCustom = require('../fixtures/templates/simple_custom');
var overrideCustom = require('../fixtures/templates/override_custom');

test('Custom template has defaults', function t(assert) {
    var template = new Custom();
    assert.deepEqual(template.state, simpleCustom);
    assert.end();
});

test('Custom template creates state', function t(assert) {
    var name = 'custom';
    var options = ['a', 'b'];
    var template = new Custom({
        name: name,
        options: options
    });
    assert.deepEqual(template.state, overrideCustom);
    assert.end();
});

test('Custom template generates state', function t(assert) {
    var name = 'custom';
    var options = ['a', 'b'];
    var template = new Custom({
        name: name,
        options: options
    });
    assert.deepEqual(template.generate(), overrideCustom);
    assert.end();
});

test('Custom template can add options', function t(assert) {
    var name = 'custom';
    var template = new Custom({name: name});
    template.addOption('a');
    template.addOption('b', true)

    assert.deepEqual(template.state, overrideCustom);
    assert.end();
});
