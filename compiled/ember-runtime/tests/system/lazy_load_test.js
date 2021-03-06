'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var _emberRuntimeSystemLazy_load = require('ember-runtime/system/lazy_load');

QUnit.module('Lazy Loading');

QUnit.test('if a load hook is registered, it is executed when runLoadHooks are exected', function () {
  var count = 0;

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberRuntimeSystemLazy_load.onLoad)('__test_hook__', function (object) {
      count += object;
    });
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberRuntimeSystemLazy_load.runLoadHooks)('__test_hook__', 1);
  });

  equal(count, 1, 'the object was passed into the load hook');
});

QUnit.test('if runLoadHooks was already run, it executes newly added hooks immediately', function () {
  var count = 0;
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberRuntimeSystemLazy_load.onLoad)('__test_hook__', function (object) {
      count += object;
    });
  });

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberRuntimeSystemLazy_load.runLoadHooks)('__test_hook__', 1);
  });

  count = 0;
  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberRuntimeSystemLazy_load.onLoad)('__test_hook__', function (object) {
      count += object;
    });
  });

  equal(count, 1, 'the original object was passed into the load hook');
});

QUnit.test('hooks in ENV.EMBER_LOAD_HOOKS[\'hookName\'] get executed', function () {

  // Note that the necessary code to perform this test is run before
  // the Ember lib is loaded in tests/index.html

  (0, _emberMetalRun_loop2['default'])(function () {
    (0, _emberRuntimeSystemLazy_load.runLoadHooks)('__before_ember_test_hook__', 1);
  });

  equal(window.ENV.__test_hook_count__, 1, 'the object was passed into the load hook');
});

if (typeof window === 'object' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
  QUnit.test('load hooks trigger a custom event', function () {
    var eventObject = 'super duper awesome events';

    window.addEventListener('__test_hook_for_events__', function (e) {
      ok(true, 'custom event was fired');
      equal(e.detail, eventObject, 'event details are provided properly');
    });

    (0, _emberMetalRun_loop2['default'])(function () {
      (0, _emberRuntimeSystemLazy_load.runLoadHooks)('__test_hook_for_events__', eventObject);
    });
  });
}