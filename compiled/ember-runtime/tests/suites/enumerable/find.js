'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberRuntimeSystemObject = require('ember-runtime/system/object');

var _emberRuntimeSystemObject2 = _interopRequireDefault(_emberRuntimeSystemObject);

var _emberRuntimeTestsSuitesSuite = require('ember-runtime/tests/suites/suite');

var suite = _emberRuntimeTestsSuitesSuite.SuiteModuleBuilder.create();
// ..........................................................
// find()
//

suite.module('find');

suite.test('find should invoke callback on each item as long as you return false', function () {
  var obj = this.newObject();
  var ary = this.toArray(obj);
  var found = [];
  var result;

  result = obj.find(function (i) {
    found.push(i);
    return false;
  });
  equal(result, undefined, 'return value of obj.find');
  deepEqual(found, ary, 'items passed during find() should match');
});

suite.test('every should stop invoking when you return true', function () {
  var obj = this.newObject();
  var ary = this.toArray(obj);
  var cnt = ary.length - 2;
  var exp = cnt;
  var found = [];
  var result;

  result = obj.find(function (i) {
    found.push(i);
    return --cnt >= 0;
  });
  equal(result, ary[exp - 1], 'return value of obj.find');
  equal(found.length, exp, 'should invoke proper number of times');
  deepEqual(found, ary.slice(0, -2), 'items passed during find() should match');
});

// ..........................................................
// findBy()
//

suite.module('findBy');

suite.test('should return first object of property matches', function () {
  var ary, obj;

  ary = [{ foo: 'foo', bar: 'BAZ' }, _emberRuntimeSystemObject2['default'].create({ foo: 'foo', bar: 'bar' })];

  obj = this.newObject(ary);

  equal(obj.findBy('foo', 'foo'), ary[0], 'findBy(foo)');
  equal(obj.findBy('bar', 'bar'), ary[1], 'findBy(bar)');
});

suite.test('should return first object with truthy prop', function () {
  var ary, obj;

  ary = [{ foo: 'foo', bar: false }, _emberRuntimeSystemObject2['default'].create({ foo: 'bar', bar: true })];

  obj = this.newObject(ary);

  // different values - all eval to true
  equal(obj.findBy('foo'), ary[0], 'findBy(foo)');
  equal(obj.findBy('bar'), ary[1], 'findBy(bar)');
});

suite.test('should return first null property match', function () {
  var ary, obj;

  ary = [{ foo: null, bar: 'BAZ' }, _emberRuntimeSystemObject2['default'].create({ foo: null, bar: null })];

  obj = this.newObject(ary);

  equal(obj.findBy('foo', null), ary[0], 'findBy(\'foo\', null)');
  equal(obj.findBy('bar', null), ary[1], 'findBy(\'bar\', null)');
});

suite.test('should return first undefined property match', function () {
  var ary, obj;

  ary = [{ foo: undefined, bar: 'BAZ' }, _emberRuntimeSystemObject2['default'].create({})];

  obj = this.newObject(ary);

  equal(obj.findBy('foo', undefined), ary[0], 'findBy(\'foo\', undefined)');
  equal(obj.findBy('bar', undefined), ary[1], 'findBy(\'bar\', undefined)');
});

suite.test('should be aliased to findProperty', function () {
  var obj;

  obj = this.newObject([]);

  equal(obj.findProperty, obj.findBy);
});

exports['default'] = suite;
module.exports = exports['default'];