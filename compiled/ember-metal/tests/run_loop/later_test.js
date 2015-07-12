'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalIs_none = require('ember-metal/is_none');

var _emberMetalIs_none2 = _interopRequireDefault(_emberMetalIs_none);

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

var originalSetTimeout = window.setTimeout;
var originalDateValueOf = Date.prototype.valueOf;

function wait(callback, maxWaitCount) {
  maxWaitCount = (0, _emberMetalIs_none2['default'])(maxWaitCount) ? 100 : maxWaitCount;

  originalSetTimeout(function () {
    if (maxWaitCount > 0 && (_emberMetalRun_loop2['default'].hasScheduledTimers() || _emberMetalRun_loop2['default'].currentRunLoop)) {
      wait(callback, maxWaitCount - 1);

      return;
    }

    callback();
  }, 10);
}

// Synchronous "sleep". This simulates work being done
// after run.later was called but before the run loop
// has flushed. In previous versions, this would have
// caused the run.later callback to have run from
// within the run loop flush, since by the time the
// run loop has to flush, it would have considered
// the timer already expired.
function pauseUntil(time) {
  // jscs:disable
  while (+new Date() < time) {}
  // jscs:enable
}

QUnit.module('run.later', {
  teardown: function teardown() {
    window.setTimeout = originalSetTimeout;
    Date.prototype.valueOf = originalDateValueOf;
  }
});

asyncTest('should invoke after specified period of time - function only', function () {

  var invoked = false;

  (0, _emberMetalRun_loop2['default'])(function () {
    _emberMetalRun_loop2['default'].later(function () {
      invoked = true;
    }, 100);
  });

  wait(function () {
    QUnit.start();
    equal(invoked, true, 'should have invoked later item');
  });
});

asyncTest('should invoke after specified period of time - target/method', function () {

  var obj = { invoked: false };

  (0, _emberMetalRun_loop2['default'])(function () {
    _emberMetalRun_loop2['default'].later(obj, function () {
      this.invoked = true;
    }, 100);
  });

  wait(function () {
    QUnit.start();
    equal(obj.invoked, true, 'should have invoked later item');
  });
});

asyncTest('should invoke after specified period of time - target/method/args', function () {

  var obj = { invoked: 0 };

  (0, _emberMetalRun_loop2['default'])(function () {
    _emberMetalRun_loop2['default'].later(obj, function (amt) {
      this.invoked += amt;
    }, 10, 100);
  });

  wait(function () {
    QUnit.start();
    equal(obj.invoked, 10, 'should have invoked later item');
  });
});

asyncTest('should always invoke within a separate runloop', function () {
  var obj = { invoked: 0 };
  var firstRunLoop, secondRunLoop;

  (0, _emberMetalRun_loop2['default'])(function () {
    firstRunLoop = _emberMetalRun_loop2['default'].currentRunLoop;

    _emberMetalRun_loop2['default'].later(obj, function (amt) {
      this.invoked += amt;
      secondRunLoop = _emberMetalRun_loop2['default'].currentRunLoop;
    }, 10, 1);

    pauseUntil(+new Date() + 100);
  });

  ok(firstRunLoop, 'first run loop captured');
  ok(!_emberMetalRun_loop2['default'].currentRunLoop, 'shouldn\'t be in a run loop after flush');
  equal(obj.invoked, 0, 'shouldn\'t have invoked later item yet');

  wait(function () {
    QUnit.start();
    equal(obj.invoked, 10, 'should have invoked later item');
    ok(secondRunLoop, 'second run loop took place');
    ok(secondRunLoop !== firstRunLoop, 'two different run loops took place');
  });
});

// Our current implementation doesn't allow us to correctly enforce this ordering.
// We should probably implement a queue to provide this guarantee.
// See https://github.com/emberjs/ember.js/issues/3526 for more information.

// asyncTest('callback order', function() {
//   var array = [];
//   function fn(val) { array.push(val); }

//   run(function() {
//     run.later(this, fn, 4, 5);
//     run.later(this, fn, 1, 1);
//     run.later(this, fn, 5, 10);
//     run.later(this, fn, 2, 3);
//     run.later(this, fn, 3, 3);
//   });

//   deepEqual(array, []);

//   wait(function() {
//     QUnit.start();
//     deepEqual(array, [1,2,3,4,5], 'callbacks were called in expected order');
//   });
// });

// Out current implementation doesn't allow us to properly enforce what is tested here.
// We should probably fix it, but it's not technically a bug right now.
// See https://github.com/emberjs/ember.js/issues/3522 for more information.

// asyncTest('callbacks coalesce into same run loop if expiring at the same time', function() {
//   var array = [];
//   function fn(val) { array.push(run.currentRunLoop); }

//   run(function() {

//     // Force +new Date to return the same result while scheduling
//     // run.later timers. Otherwise: non-determinism!
//     var now = +new Date();
//     Date.prototype.valueOf = function() { return now; };

//     run.later(this, fn, 10);
//     run.later(this, fn, 200);
//     run.later(this, fn, 200);

//     Date.prototype.valueOf = originalDateValueOf;
//   });

//   deepEqual(array, []);

//   wait(function() {
//     QUnit.start();
//     equal(array.length, 3, 'all callbacks called');
//     ok(array[0] !== array[1], 'first two callbacks have different run loops');
//     ok(array[0], 'first runloop present');
//     ok(array[1], 'second runloop present');
//     equal(array[1], array[2], 'last two callbacks got the same run loop');
//   });
// });

asyncTest('inception calls to run.later should run callbacks in separate run loops', function () {

  var runLoop, finished;

  (0, _emberMetalRun_loop2['default'])(function () {
    runLoop = _emberMetalRun_loop2['default'].currentRunLoop;
    ok(runLoop);

    _emberMetalRun_loop2['default'].later(function () {
      ok(_emberMetalRun_loop2['default'].currentRunLoop && _emberMetalRun_loop2['default'].currentRunLoop !== runLoop, 'first later callback has own run loop');
      runLoop = _emberMetalRun_loop2['default'].currentRunLoop;

      _emberMetalRun_loop2['default'].later(function () {
        ok(_emberMetalRun_loop2['default'].currentRunLoop && _emberMetalRun_loop2['default'].currentRunLoop !== runLoop, 'second later callback has own run loop');
        finished = true;
      }, 40);
    }, 40);
  });

  wait(function () {
    QUnit.start();
    ok(finished, 'all .later callbacks run');
  });
});

asyncTest('setTimeout should never run with a negative wait', function () {

  // Rationale: The old run loop code was susceptible to an occasional
  // bug where invokeLaterTimers would be scheduled with a setTimeout
  // with a negative wait. Modern browsers normalize this to 0, but
  // older browsers (IE <= 8) break with a negative wait, which
  // happens when an expired timer callback takes a while to run,
  // which is what we simulate here.
  var newSetTimeoutUsed;
  window.setTimeout = function () {
    var wait = arguments[arguments.length - 1];
    newSetTimeoutUsed = true;
    ok(!isNaN(wait) && wait >= 0, 'wait is a non-negative number');
    // In IE8, `setTimeout.apply` is `undefined`.
    var apply = Function.prototype.apply;
    return apply.apply(originalSetTimeout, [this, arguments]);
  };

  var count = 0;
  (0, _emberMetalRun_loop2['default'])(function () {

    _emberMetalRun_loop2['default'].later(function () {
      count++;

      // This will get run first. Waste some time.
      // This is intended to break invokeLaterTimers code by taking a
      // long enough time that other timers should technically expire. It's
      // fine that they're not called in this run loop; just need to
      // make sure that invokeLaterTimers doesn't end up scheduling
      // a negative setTimeout.
      pauseUntil(+new Date() + 60);
    }, 1);

    _emberMetalRun_loop2['default'].later(function () {
      equal(count, 1, 'callbacks called in order');
    }, 50);
  });

  wait(function () {
    window.setTimeout = originalSetTimeout;
    QUnit.start();
    ok(newSetTimeoutUsed, 'stub setTimeout was used');
  });
});
/* do nothing - sleeping */