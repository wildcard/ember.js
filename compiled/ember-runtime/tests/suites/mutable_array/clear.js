'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberRuntimeTestsSuitesSuite = require('ember-runtime/tests/suites/suite');

var suite = _emberRuntimeTestsSuitesSuite.SuiteModuleBuilder.create();

suite.module('clear');

suite.test('[].clear() => [] + notify', function () {
  var obj, before, after, observer;

  before = [];
  after = [];
  obj = this.newObject(before);
  observer = this.newObserver(obj, '[]', '@each', 'length', 'firstObject', 'lastObject');
  obj.getProperties('firstObject', 'lastObject'); /* Prime the cache */

  equal(obj.clear(), obj, 'return self');

  deepEqual(this.toArray(obj), after, 'post item results');
  equal(_emberMetalCore2['default'].get(obj, 'length'), after.length, 'length');

  equal(observer.validate('[]'), false, 'should NOT have notified [] once');
  equal(observer.validate('@each'), false, 'should NOT have notified @each once');
  equal(observer.validate('length'), false, 'should NOT have notified length once');
  equal(observer.validate('firstObject'), false, 'should NOT have notified firstObject once');
  equal(observer.validate('lastObject'), false, 'should NOT have notified lastObject once');
});

suite.test('[X].clear() => [] + notify', function () {
  var obj, before, after, observer;

  before = this.newFixture(1);
  after = [];
  obj = this.newObject(before);
  observer = this.newObserver(obj, '[]', '@each', 'length', 'firstObject', 'lastObject');
  obj.getProperties('firstObject', 'lastObject'); /* Prime the cache */

  equal(obj.clear(), obj, 'return self');

  deepEqual(this.toArray(obj), after, 'post item results');
  equal(_emberMetalCore2['default'].get(obj, 'length'), after.length, 'length');

  equal(observer.timesCalled('[]'), 1, 'should have notified [] once');
  equal(observer.timesCalled('@each'), 1, 'should have notified @each once');
  equal(observer.timesCalled('length'), 1, 'should have notified length once');
  equal(observer.timesCalled('firstObject'), 1, 'should have notified firstObject once');
  equal(observer.timesCalled('lastObject'), 1, 'should have notified lastObject once');
});

exports['default'] = suite;
module.exports = exports['default'];