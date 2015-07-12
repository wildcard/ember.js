'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _emberRuntimeTestsSuitesSuite = require('ember-runtime/tests/suites/suite');

var suite = _emberRuntimeTestsSuitesSuite.SuiteModuleBuilder.create();

suite.module('reduce');

suite.test('collects a summary value from an enumeration', function () {
  var obj = this.newObject([1, 2, 3]);
  var res = obj.reduce(function (previousValue, item, index, enumerable) {
    return previousValue + item;
  }, 0);
  equal(res, 6);
});

suite.test('passes index of item to callback', function () {
  var obj = this.newObject([1, 2, 3]);
  var res = obj.reduce(function (previousValue, item, index, enumerable) {
    return previousValue + index;
  }, 0);
  equal(res, 3);
});

suite.test('passes enumerable object to callback', function () {
  var obj = this.newObject([1, 2, 3]);
  var res = obj.reduce(function (previousValue, item, index, enumerable) {
    return enumerable;
  }, 0);
  equal(res, obj);
});

exports['default'] = suite;
module.exports = exports['default'];