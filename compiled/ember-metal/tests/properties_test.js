'use strict';

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalProperties = require('ember-metal/properties');

var _emberMetalDeprecate_property = require('ember-metal/deprecate_property');

QUnit.module('Ember.defineProperty');

QUnit.test('toString', function () {

  var obj = {};
  (0, _emberMetalProperties.defineProperty)(obj, 'toString', undefined, function () {
    return 'FOO';
  });
  equal(obj.toString(), 'FOO', 'should replace toString');
});

QUnit.test('for data properties, didDefineProperty hook should be called if implemented', function () {
  expect(2);

  var obj = {
    didDefineProperty: function didDefineProperty(obj, keyName, value) {
      equal(keyName, 'foo', 'key name should be foo');
      equal(value, 'bar', 'value should be bar');
    }
  };

  (0, _emberMetalProperties.defineProperty)(obj, 'foo', undefined, 'bar');
});

QUnit.test('for computed properties, didDefineProperty hook should be called if implemented', function () {
  expect(2);

  var computedProperty = (0, _emberMetalComputed.computed)(function () {
    return this;
  });

  var obj = {
    didDefineProperty: function didDefineProperty(obj, keyName, value) {
      equal(keyName, 'foo', 'key name should be foo');
      strictEqual(value, computedProperty, 'value should be passed as computed property');
    }
  };

  (0, _emberMetalProperties.defineProperty)(obj, 'foo', computedProperty);
});

QUnit.test('for descriptor properties, didDefineProperty hook should be called if implemented', function () {
  expect(2);

  var descriptor = {
    writable: true,
    configurable: false,
    enumerable: true,
    value: 42
  };

  var obj = {
    didDefineProperty: function didDefineProperty(obj, keyName, value) {
      equal(keyName, 'answer', 'key name should be answer');
      strictEqual(value, descriptor, 'value should be passed as descriptor');
    }
  };

  (0, _emberMetalProperties.defineProperty)(obj, 'answer', descriptor);
});

QUnit.module('Ember.deprecateProperty');

QUnit.test('enables access to deprecated property and returns the value of the new property', function () {
  expect(3);
  var obj = { foo: 'bar' };

  (0, _emberMetalDeprecate_property.deprecateProperty)(obj, 'baz', 'foo');

  expectDeprecation();
  equal(obj.baz, obj.foo, 'baz and foo are equal');

  obj.foo = 'blammo';
  equal(obj.baz, obj.foo, 'baz and foo are equal');
});

QUnit.test('deprecatedKey is not enumerable', function () {
  expect(2);
  var obj = { foo: 'bar', blammo: 'whammy' };

  (0, _emberMetalDeprecate_property.deprecateProperty)(obj, 'baz', 'foo');

  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      notEqual(prop, 'baz');
    }
  }
});

QUnit.test('enables setter to deprecated property and updates the value of the new property', function () {
  expect(3);
  var obj = { foo: 'bar' };

  (0, _emberMetalDeprecate_property.deprecateProperty)(obj, 'baz', 'foo');

  expectDeprecation();
  obj.baz = 'bloop';
  equal(obj.foo, 'bloop', 'updating baz updates foo');
  equal(obj.baz, obj.foo, 'baz and foo are equal');
});