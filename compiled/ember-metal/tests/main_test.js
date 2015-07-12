'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetal = require('ember-metal');

var _emberMetal2 = _interopRequireDefault(_emberMetal);

// From sindresourhus/semver-regex https://github.com/sindresorhus/semver-regex/blob/795b05628d96597ebcbe6d31ef4a432858365582/index.js#L3
var SEMVER_REGEX = /^\bv?(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?\b$/;

QUnit.module('ember-metal/core/main');

QUnit.test('Ember registers itself', function () {
  var lib = _emberMetal2['default'].libraries._registry[0];

  equal(lib.name, 'Ember');
  equal(lib.version, _emberMetal2['default'].VERSION);
});

QUnit.test('Ember.VERSION is in alignment with SemVer v2.0.0', function () {
  ok(SEMVER_REGEX.test(_emberMetal2['default'].VERSION), 'Ember.VERSION (' + _emberMetal2['default'].VERSION + ')is valid SemVer v2.0.0');
});

QUnit.test('SEMVER_REGEX properly validates and invalidates version numbers', function () {
  function validateVersionString(versionString, expectedResult) {
    equal(SEMVER_REGEX.test(versionString), expectedResult);
  }

  // Postive test cases
  validateVersionString('1.11.3', true);
  validateVersionString('1.0.0-beta.16.1', true);
  validateVersionString('1.12.1+canary.aba1412', true);
  validateVersionString('2.0.0-beta.1+canary.bb344775', true);

  // Negative test cases
  validateVersionString('1.11.3.aba18a', false);
  validateVersionString('1.11', false);
});

QUnit.test('Ember.keys is deprecated', function () {
  expectDeprecation(function () {
    _emberMetal2['default'].keys({});
  }, 'Ember.keys is deprecated in favor of Object.keys');
});

QUnit.test('Ember.keys is deprecated', function () {
  expectDeprecation(function () {
    _emberMetal2['default'].create(null);
  }, 'Ember.create is deprecated in favor of Object.create');
});