'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalTestsProps_helper = require('ember-metal/tests/props_helper');

var _emberMetalObserver = require('ember-metal/observer');

var _emberMetalProperty_events = require('ember-metal/property_events');

var _emberMetalProperties = require('ember-metal/properties');

var _emberMetalComputed = require('ember-metal/computed');

var _emberMetalMixin = require('ember-metal/mixin');

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

// ..........................................................
// ADD OBSERVER
//

QUnit.module('addObserver');

(0, _emberMetalTestsProps_helper.testBoth)('observer should fire when property is modified', function (get, set) {

  var obj = {};
  var count = 0;

  (0, _emberMetalObserver.addObserver)(obj, 'foo', function () {
    equal(get(obj, 'foo'), 'bar', 'should invoke AFTER value changed');
    count++;
  });

  set(obj, 'foo', 'bar');
  equal(count, 1, 'should have invoked observer');
});

(0, _emberMetalTestsProps_helper.testBoth)('observer should fire when dependent property is modified', function (get, set) {
  var obj = { bar: 'bar' };
  (0, _emberMetalProperties.defineProperty)(obj, 'foo', (0, _emberMetalComputed.computed)(function () {
    return get(this, 'bar').toUpperCase();
  }).property('bar'));

  get(obj, 'foo');

  var count = 0;
  (0, _emberMetalObserver.addObserver)(obj, 'foo', function () {
    equal(get(obj, 'foo'), 'BAZ', 'should have invoked after prop change');
    count++;
  });

  set(obj, 'bar', 'baz');
  equal(count, 1, 'should have invoked observer');
});

(0, _emberMetalTestsProps_helper.testBoth)('observer should continue to fire after dependent properties are accessed', function (get, set) {
  var observerCount = 0;
  var obj = {};

  (0, _emberMetalProperties.defineProperty)(obj, 'prop', (0, _emberMetalComputed.computed)(function () {
    return Math.random();
  }));
  (0, _emberMetalProperties.defineProperty)(obj, 'anotherProp', (0, _emberMetalComputed.computed)('prop', function () {
    return get(this, 'prop') + Math.random();
  }));

  (0, _emberMetalObserver.addObserver)(obj, 'prop', function () {
    observerCount++;
  });

  get(obj, 'anotherProp');

  for (var i = 0; i < 10; i++) {
    (0, _emberMetalProperty_events.propertyWillChange)(obj, 'prop');
    (0, _emberMetalProperty_events.propertyDidChange)(obj, 'prop');
  }

  equal(observerCount, 10, 'should continue to fire indefinitely');
});

if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
  (0, _emberMetalTestsProps_helper.testBoth)('observer added declaratively via brace expansion should fire when property changes', function (get, set) {
    var obj = {};
    var count = 0;

    (0, _emberMetalMixin.mixin)(obj, {
      observeFooAndBar: (function () {
        count++;
      }).observes('{foo,bar}')
    });

    set(obj, 'foo', 'foo');
    equal(count, 1, 'observer specified via brace expansion invoked on property change');

    set(obj, 'bar', 'bar');
    equal(count, 2, 'observer specified via brace expansion invoked on property change');

    set(obj, 'baz', 'baz');
    equal(count, 2, 'observer not invoked on unspecified property');
  });

  (0, _emberMetalTestsProps_helper.testBoth)('observer specified declaratively via brace expansion should fire when dependent property changes', function (get, set) {
    var obj = { baz: 'Initial' };
    var count = 0;

    (0, _emberMetalProperties.defineProperty)(obj, 'foo', (0, _emberMetalComputed.computed)(function () {
      return get(this, 'bar').toLowerCase();
    }).property('bar'));

    (0, _emberMetalProperties.defineProperty)(obj, 'bar', (0, _emberMetalComputed.computed)(function () {
      return get(this, 'baz').toUpperCase();
    }).property('baz'));

    (0, _emberMetalMixin.mixin)(obj, {
      fooAndBarWatcher: (function () {
        count++;
      }).observes('{foo,bar}')
    });

    get(obj, 'foo');
    set(obj, 'baz', 'Baz');
    // fire once for foo, once for bar
    equal(count, 2, 'observer specified via brace expansion invoked on dependent property change');

    set(obj, 'quux', 'Quux');
    equal(count, 2, 'observer not fired on unspecified property');
  });
}

(0, _emberMetalTestsProps_helper.testBoth)('observers watching multiple properties via brace expansion should fire when the properties change', function (get, set) {
  var obj = {};
  var count = 0;

  (0, _emberMetalMixin.mixin)(obj, {
    observeFooAndBar: (0, _emberMetalMixin.observer)('{foo,bar}', function () {
      count++;
    })
  });

  set(obj, 'foo', 'foo');
  equal(count, 1, 'observer specified via brace expansion invoked on property change');

  set(obj, 'bar', 'bar');
  equal(count, 2, 'observer specified via brace expansion invoked on property change');

  set(obj, 'baz', 'baz');
  equal(count, 2, 'observer not invoked on unspecified property');
});

(0, _emberMetalTestsProps_helper.testBoth)('observers watching multiple properties via brace expansion should fire when dependent properties change', function (get, set) {
  var obj = { baz: 'Initial' };
  var count = 0;

  (0, _emberMetalProperties.defineProperty)(obj, 'foo', (0, _emberMetalComputed.computed)(function () {
    return get(this, 'bar').toLowerCase();
  }).property('bar'));

  (0, _emberMetalProperties.defineProperty)(obj, 'bar', (0, _emberMetalComputed.computed)(function () {
    return get(this, 'baz').toUpperCase();
  }).property('baz'));

  (0, _emberMetalMixin.mixin)(obj, {
    fooAndBarWatcher: (0, _emberMetalMixin.observer)('{foo,bar}', function () {
      count++;
    })
  });

  get(obj, 'foo');
  set(obj, 'baz', 'Baz');
  // fire once for foo, once for bar
  equal(count, 2, 'observer specified via brace expansion invoked on dependent property change');

  set(obj, 'quux', 'Quux');
  equal(count, 2, 'observer not fired on unspecified property');
});

(0, _emberMetalTestsProps_helper.testBoth)('nested observers should fire in order', function (get, set) {
  var obj = { foo: 'foo', bar: 'bar' };
  var fooCount = 0;
  var barCount = 0;

  (0, _emberMetalObserver.addObserver)(obj, 'foo', function () {
    fooCount++;
  });
  (0, _emberMetalObserver.addObserver)(obj, 'bar', function () {
    set(obj, 'foo', 'BAZ');
    equal(fooCount, 1, 'fooCount should have fired already');
    barCount++;
  });

  set(obj, 'bar', 'BIFF');
  equal(barCount, 1, 'barCount should have fired');
  equal(fooCount, 1, 'foo should have fired');
});

(0, _emberMetalTestsProps_helper.testBoth)('removing an chain observer on change should not fail', function (get, set) {
  var foo = { bar: 'bar' };
  var obj1 = { foo: foo };
  var obj2 = { foo: foo };
  var obj3 = { foo: foo };
  var obj4 = { foo: foo };
  var count1 = 0;
  var count2 = 0;
  var count3 = 0;
  var count4 = 0;

  function observer1() {
    count1++;
  }
  function observer2() {
    count2++;
  }
  function observer3() {
    count3++;
    (0, _emberMetalObserver.removeObserver)(obj1, 'foo.bar', observer1);
    (0, _emberMetalObserver.removeObserver)(obj2, 'foo.bar', observer2);
    (0, _emberMetalObserver.removeObserver)(obj4, 'foo.bar', observer4);
  }
  function observer4() {
    count4++;
  }

  (0, _emberMetalObserver.addObserver)(obj1, 'foo.bar', observer1);
  (0, _emberMetalObserver.addObserver)(obj2, 'foo.bar', observer2);
  (0, _emberMetalObserver.addObserver)(obj3, 'foo.bar', observer3);
  (0, _emberMetalObserver.addObserver)(obj4, 'foo.bar', observer4);

  set(foo, 'bar', 'baz');

  equal(count1, 1, 'observer1 fired');
  equal(count2, 1, 'observer2 fired');
  equal(count3, 1, 'observer3 fired');
  equal(count4, 0, 'observer4 did not fire');
});

(0, _emberMetalTestsProps_helper.testBoth)('removing an chain before observer on change should not fail', function (get, set) {
  var foo = { bar: 'bar' };
  var obj1 = { foo: foo };
  var obj2 = { foo: foo };
  var obj3 = { foo: foo };
  var obj4 = { foo: foo };
  var count1 = 0;
  var count2 = 0;
  var count3 = 0;
  var count4 = 0;

  function observer1() {
    count1++;
  }
  function observer2() {
    count2++;
  }
  function observer3() {
    count3++;
    (0, _emberMetalObserver.removeBeforeObserver)(obj1, 'foo.bar', observer1);
    (0, _emberMetalObserver.removeBeforeObserver)(obj2, 'foo.bar', observer2);
    (0, _emberMetalObserver.removeBeforeObserver)(obj4, 'foo.bar', observer4);
  }
  function observer4() {
    count4++;
  }

  (0, _emberMetalObserver.addBeforeObserver)(obj1, 'foo.bar', observer1);
  (0, _emberMetalObserver.addBeforeObserver)(obj2, 'foo.bar', observer2);
  (0, _emberMetalObserver.addBeforeObserver)(obj3, 'foo.bar', observer3);
  (0, _emberMetalObserver.addBeforeObserver)(obj4, 'foo.bar', observer4);

  set(foo, 'bar', 'baz');

  equal(count1, 1, 'observer1 fired');
  equal(count2, 1, 'observer2 fired');
  equal(count3, 1, 'observer3 fired');
  equal(count4, 0, 'observer4 did not fire');
});

(0, _emberMetalTestsProps_helper.testBoth)('suspending an observer should not fire during callback', function (get, set) {
  var obj = {};
  var target, otherTarget;

  target = {
    values: [],
    method: function method() {
      this.values.push(get(obj, 'foo'));
    }
  };

  otherTarget = {
    values: [],
    method: function method() {
      this.values.push(get(obj, 'foo'));
    }
  };

  (0, _emberMetalObserver.addObserver)(obj, 'foo', target, target.method);
  (0, _emberMetalObserver.addObserver)(obj, 'foo', otherTarget, otherTarget.method);

  function callback() {
    /*jshint validthis:true */
    equal(this, target);

    set(obj, 'foo', '2');

    return 'result';
  }

  set(obj, 'foo', '1');

  equal((0, _emberMetalObserver._suspendObserver)(obj, 'foo', target, target.method, callback), 'result');

  set(obj, 'foo', '3');

  deepEqual(target.values, ['1', '3'], 'should invoke');
  deepEqual(otherTarget.values, ['1', '2', '3'], 'should invoke');
});

(0, _emberMetalTestsProps_helper.testBoth)('suspending an observer should not defer change notifications during callback', function (get, set) {
  var obj = {};
  var target, otherTarget;

  target = {
    values: [],
    method: function method() {
      this.values.push(get(obj, 'foo'));
    }
  };

  otherTarget = {
    values: [],
    method: function method() {
      this.values.push(get(obj, 'foo'));
    }
  };

  (0, _emberMetalObserver.addObserver)(obj, 'foo', target, target.method);
  (0, _emberMetalObserver.addObserver)(obj, 'foo', otherTarget, otherTarget.method);

  function callback() {
    /*jshint validthis:true */
    equal(this, target);

    set(obj, 'foo', '2');

    return 'result';
  }

  set(obj, 'foo', '1');

  (0, _emberMetalProperty_events.beginPropertyChanges)();
  equal((0, _emberMetalObserver._suspendObserver)(obj, 'foo', target, target.method, callback), 'result');
  (0, _emberMetalProperty_events.endPropertyChanges)();

  set(obj, 'foo', '3');

  deepEqual(target.values, ['1', '3'], 'should invoke');
  deepEqual(otherTarget.values, ['1', '2', '3'], 'should invoke');
});

(0, _emberMetalTestsProps_helper.testBoth)('suspending observers should not fire during callback', function (get, set) {
  var obj = {};
  var target, otherTarget;

  target = {
    values: [],
    method: function method() {
      this.values.push(get(obj, 'foo'));
    }
  };

  otherTarget = {
    values: [],
    method: function method() {
      this.values.push(get(obj, 'foo'));
    }
  };

  (0, _emberMetalObserver.addObserver)(obj, 'foo', target, target.method);
  (0, _emberMetalObserver.addObserver)(obj, 'foo', otherTarget, otherTarget.method);

  function callback() {
    /*jshint validthis:true */
    equal(this, target);

    set(obj, 'foo', '2');

    return 'result';
  }

  set(obj, 'foo', '1');

  equal((0, _emberMetalObserver._suspendObservers)(obj, ['foo'], target, target.method, callback), 'result');

  set(obj, 'foo', '3');

  deepEqual(target.values, ['1', '3'], 'should invoke');
  deepEqual(otherTarget.values, ['1', '2', '3'], 'should invoke');
});

(0, _emberMetalTestsProps_helper.testBoth)('suspending observers should not defer change notifications during callback', function (get, set) {
  var obj = {};
  var target, otherTarget;

  target = {
    values: [],
    method: function method() {
      this.values.push(get(obj, 'foo'));
    }
  };

  otherTarget = {
    values: [],
    method: function method() {
      this.values.push(get(obj, 'foo'));
    }
  };

  (0, _emberMetalObserver.addObserver)(obj, 'foo', target, target.method);
  (0, _emberMetalObserver.addObserver)(obj, 'foo', otherTarget, otherTarget.method);

  function callback() {
    /*jshint validthis:true */
    equal(this, target);

    set(obj, 'foo', '2');

    return 'result';
  }

  set(obj, 'foo', '1');

  (0, _emberMetalProperty_events.beginPropertyChanges)();
  equal((0, _emberMetalObserver._suspendObservers)(obj, ['foo'], target, target.method, callback), 'result');
  (0, _emberMetalProperty_events.endPropertyChanges)();

  set(obj, 'foo', '3');

  deepEqual(target.values, ['1', '3'], 'should invoke');
  deepEqual(otherTarget.values, ['1', '2', '3'], 'should invoke');
});

(0, _emberMetalTestsProps_helper.testBoth)('deferring property change notifications', function (get, set) {
  var obj = { foo: 'foo' };
  var fooCount = 0;

  (0, _emberMetalObserver.addObserver)(obj, 'foo', function () {
    fooCount++;
  });

  (0, _emberMetalProperty_events.beginPropertyChanges)(obj);
  set(obj, 'foo', 'BIFF');
  set(obj, 'foo', 'BAZ');
  (0, _emberMetalProperty_events.endPropertyChanges)(obj);

  equal(fooCount, 1, 'foo should have fired once');
});

(0, _emberMetalTestsProps_helper.testBoth)('deferring property change notifications safely despite exceptions', function (get, set) {
  var obj = { foo: 'foo' };
  var fooCount = 0;
  var exc = new Error('Something unexpected happened!');

  expect(2);
  (0, _emberMetalObserver.addObserver)(obj, 'foo', function () {
    fooCount++;
  });

  try {
    (0, _emberMetalProperty_events.changeProperties)(function () {
      set(obj, 'foo', 'BIFF');
      set(obj, 'foo', 'BAZ');
      throw exc;
    });
  } catch (err) {
    if (err !== exc) {
      throw err;
    }
  }

  equal(fooCount, 1, 'foo should have fired once');

  (0, _emberMetalProperty_events.changeProperties)(function () {
    set(obj, 'foo', 'BIFF2');
    set(obj, 'foo', 'BAZ2');
  });

  equal(fooCount, 2, 'foo should have fired again once');
});

(0, _emberMetalTestsProps_helper.testBoth)('deferring property change notifications will not defer before observers', function (get, set) {
  var obj = { foo: 'foo' };
  var fooCount = 0;

  (0, _emberMetalObserver.addBeforeObserver)(obj, 'foo', function () {
    fooCount++;
  });

  (0, _emberMetalProperty_events.beginPropertyChanges)(obj);
  set(obj, 'foo', 'BIFF');
  equal(fooCount, 1, 'should fire before observer immediately');
  set(obj, 'foo', 'BAZ');
  (0, _emberMetalProperty_events.endPropertyChanges)(obj);

  equal(fooCount, 1, 'should not fire before observer twice');
});

(0, _emberMetalTestsProps_helper.testBoth)('implementing sendEvent on object should invoke when deferring property change notifications ends', function (get, set) {
  var count = 0;
  var events = [];
  var obj = {
    sendEvent: function sendEvent(eventName) {
      events.push(eventName);
    },
    foo: 'baz'
  };

  (0, _emberMetalObserver.addObserver)(obj, 'foo', function () {
    count++;
  });

  (0, _emberMetalProperty_events.beginPropertyChanges)(obj);
  set(obj, 'foo', 'BAZ');

  equal(count, 0, 'should have not invoked observer');
  equal(events.length, 1, 'should have invoked sendEvent for before');

  (0, _emberMetalProperty_events.endPropertyChanges)(obj);

  equal(count, 1, 'should have invoked observer');
  equal(events.length, 2, 'should have invoked sendEvent');
  equal(events[0], 'foo:before');
  equal(events[1], 'foo:change');
});

(0, _emberMetalTestsProps_helper.testBoth)('addObserver should propagate through prototype', function (get, set) {
  var obj = { foo: 'foo', count: 0 };
  var obj2;

  (0, _emberMetalObserver.addObserver)(obj, 'foo', function () {
    this.count++;
  });
  obj2 = Object.create(obj);

  set(obj2, 'foo', 'bar');

  equal(obj2.count, 1, 'should have invoked observer on inherited');
  equal(obj.count, 0, 'should not have invoked observer on parent');

  obj2.count = 0;
  set(obj, 'foo', 'baz');
  equal(obj.count, 1, 'should have invoked observer on parent');
  equal(obj2.count, 0, 'should not have invoked observer on inherited');
});

(0, _emberMetalTestsProps_helper.testBoth)('addObserver should respect targets with methods', function (get, set) {
  var observed = { foo: 'foo' };

  var target1 = {
    count: 0,

    didChange: function didChange(obj, keyName) {
      var value = get(obj, keyName);
      equal(this, target1, 'should invoke with this');
      equal(obj, observed, 'param1 should be observed object');
      equal(keyName, 'foo', 'param2 should be keyName');
      equal(value, 'BAZ', 'param3 should new value');
      this.count++;
    }
  };

  var target2 = {
    count: 0,

    didChange: function didChange(obj, keyName) {
      var value = get(obj, keyName);
      equal(this, target2, 'should invoke with this');
      equal(obj, observed, 'param1 should be observed object');
      equal(keyName, 'foo', 'param2 should be keyName');
      equal(value, 'BAZ', 'param3 should new value');
      this.count++;
    }
  };

  (0, _emberMetalObserver.addObserver)(observed, 'foo', target1, 'didChange');
  (0, _emberMetalObserver.addObserver)(observed, 'foo', target2, target2.didChange);

  set(observed, 'foo', 'BAZ');
  equal(target1.count, 1, 'target1 observer should have fired');
  equal(target2.count, 1, 'target2 observer should have fired');
});

(0, _emberMetalTestsProps_helper.testBoth)('addObserver should allow multiple objects to observe a property', function (get, set) {
  var observed = { foo: 'foo' };

  var target1 = {
    count: 0,

    didChange: function didChange(obj, keyName, value) {
      this.count++;
    }
  };

  var target2 = {
    count: 0,

    didChange: function didChange(obj, keyName, value) {
      this.count++;
    }
  };

  (0, _emberMetalObserver.addObserver)(observed, 'foo', target1, 'didChange');
  (0, _emberMetalObserver.addObserver)(observed, 'foo', target2, 'didChange');

  set(observed, 'foo', 'BAZ');
  equal(target1.count, 1, 'target1 observer should have fired');
  equal(target2.count, 1, 'target2 observer should have fired');
});

// ..........................................................
// REMOVE OBSERVER
//

QUnit.module('removeObserver');

(0, _emberMetalTestsProps_helper.testBoth)('removing observer should stop firing', function (get, set) {

  var obj = {};
  var count = 0;
  function F() {
    count++;
  }
  (0, _emberMetalObserver.addObserver)(obj, 'foo', F);

  set(obj, 'foo', 'bar');
  equal(count, 1, 'should have invoked observer');

  (0, _emberMetalObserver.removeObserver)(obj, 'foo', F);

  set(obj, 'foo', 'baz');
  equal(count, 1, 'removed observer shouldn\'t fire');
});

(0, _emberMetalTestsProps_helper.testBoth)('local observers can be removed', function (get, set) {
  var barObserved = 0;

  var MyMixin = _emberMetalMixin.Mixin.create({
    foo1: (0, _emberMetalMixin.observer)('bar', function () {
      barObserved++;
    }),

    foo2: (0, _emberMetalMixin.observer)('bar', function () {
      barObserved++;
    })
  });

  var obj = {};
  MyMixin.apply(obj);

  set(obj, 'bar', 'HI!');
  equal(barObserved, 2, 'precond - observers should be fired');

  (0, _emberMetalObserver.removeObserver)(obj, 'bar', null, 'foo1');

  barObserved = 0;
  set(obj, 'bar', 'HI AGAIN!');

  equal(barObserved, 1, 'removed observers should not be called');
});

(0, _emberMetalTestsProps_helper.testBoth)('removeObserver should respect targets with methods', function (get, set) {
  var observed = { foo: 'foo' };

  var target1 = {
    count: 0,

    didChange: function didChange() {
      this.count++;
    }
  };

  var target2 = {
    count: 0,

    didChange: function didChange() {
      this.count++;
    }
  };

  (0, _emberMetalObserver.addObserver)(observed, 'foo', target1, 'didChange');
  (0, _emberMetalObserver.addObserver)(observed, 'foo', target2, target2.didChange);

  set(observed, 'foo', 'BAZ');
  equal(target1.count, 1, 'target1 observer should have fired');
  equal(target2.count, 1, 'target2 observer should have fired');

  (0, _emberMetalObserver.removeObserver)(observed, 'foo', target1, 'didChange');
  (0, _emberMetalObserver.removeObserver)(observed, 'foo', target2, target2.didChange);

  target1.count = target2.count = 0;
  set(observed, 'foo', 'BAZ');
  equal(target1.count, 0, 'target1 observer should not fire again');
  equal(target2.count, 0, 'target2 observer should not fire again');
});

// ..........................................................
// BEFORE OBSERVER
//

QUnit.module('addBeforeObserver');

(0, _emberMetalTestsProps_helper.testBoth)('observer should fire before a property is modified', function (get, set) {

  var obj = { foo: 'foo' };
  var count = 0;

  (0, _emberMetalObserver.addBeforeObserver)(obj, 'foo', function () {
    equal(get(obj, 'foo'), 'foo', 'should invoke before value changed');
    count++;
  });

  set(obj, 'foo', 'bar');
  equal(count, 1, 'should have invoked observer');
});

(0, _emberMetalTestsProps_helper.testBoth)('observer should fire before dependent property is modified', function (get, set) {
  var obj = { bar: 'bar' };
  (0, _emberMetalProperties.defineProperty)(obj, 'foo', (0, _emberMetalComputed.computed)(function () {
    return get(this, 'bar').toUpperCase();
  }).property('bar'));

  get(obj, 'foo');

  var count = 0;
  (0, _emberMetalObserver.addBeforeObserver)(obj, 'foo', function () {
    equal(get(obj, 'foo'), 'BAR', 'should have invoked after prop change');
    count++;
  });

  set(obj, 'bar', 'baz');
  equal(count, 1, 'should have invoked observer');
});

if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
  (0, _emberMetalTestsProps_helper.testBoth)('before observer added declaratively via brace expansion should fire when property changes', function (get, set) {
    var obj = {};
    var count = 0;

    (0, _emberMetalMixin.mixin)(obj, {
      fooAndBarWatcher: (function () {
        count++;
      }).observesBefore('{foo,bar}')
    });

    set(obj, 'foo', 'foo');
    equal(count, 1, 'observer specified via brace expansion invoked on property change');

    set(obj, 'bar', 'bar');
    equal(count, 2, 'observer specified via brace expansion invoked on property change');

    set(obj, 'baz', 'baz');
    equal(count, 2, 'observer not invoked on unspecified property');
  });

  (0, _emberMetalTestsProps_helper.testBoth)('before observer specified declaratively via brace expansion should fire when dependent property changes', function (get, set) {
    var obj = { baz: 'Initial' };
    var count = 0;

    (0, _emberMetalProperties.defineProperty)(obj, 'foo', (0, _emberMetalComputed.computed)(function () {
      return get(this, 'bar').toLowerCase();
    }).property('bar'));

    (0, _emberMetalProperties.defineProperty)(obj, 'bar', (0, _emberMetalComputed.computed)(function () {
      return get(this, 'baz').toUpperCase();
    }).property('baz'));

    (0, _emberMetalMixin.mixin)(obj, {
      fooAndBarWatcher: (function () {
        count++;
      }).observesBefore('{foo,bar}')
    });

    get(obj, 'foo');
    set(obj, 'baz', 'Baz');
    // fire once for foo, once for bar
    equal(count, 2, 'observer specified via brace expansion invoked on dependent property change');

    set(obj, 'quux', 'Quux');
    equal(count, 2, 'observer not fired on unspecified property');
  });
}

(0, _emberMetalTestsProps_helper.testBoth)('before observer watching multiple properties via brace expansion should fire when properties change', function (get, set) {
  var obj = {};
  var count = 0;

  (0, _emberMetalMixin.mixin)(obj, {
    fooAndBarWatcher: (0, _emberMetalMixin.beforeObserver)('{foo,bar}', function () {
      count++;
    })
  });

  set(obj, 'foo', 'foo');
  equal(count, 1, 'observer specified via brace expansion invoked on property change');

  set(obj, 'bar', 'bar');
  equal(count, 2, 'observer specified via brace expansion invoked on property change');

  set(obj, 'baz', 'baz');
  equal(count, 2, 'observer not invoked on unspecified property');
});

(0, _emberMetalTestsProps_helper.testBoth)('before observer watching multiple properties via brace expansion should fire when dependent property changes', function (get, set) {
  var obj = { baz: 'Initial' };
  var count = 0;

  (0, _emberMetalProperties.defineProperty)(obj, 'foo', (0, _emberMetalComputed.computed)(function () {
    return get(this, 'bar').toLowerCase();
  }).property('bar'));

  (0, _emberMetalProperties.defineProperty)(obj, 'bar', (0, _emberMetalComputed.computed)(function () {
    return get(this, 'baz').toUpperCase();
  }).property('baz'));

  (0, _emberMetalMixin.mixin)(obj, {
    fooAndBarWatcher: (0, _emberMetalMixin.beforeObserver)('{foo,bar}', function () {
      count++;
    })
  });

  get(obj, 'foo');
  set(obj, 'baz', 'Baz');
  // fire once for foo, once for bar
  equal(count, 2, 'observer specified via brace expansion invoked on dependent property change');

  set(obj, 'quux', 'Quux');
  equal(count, 2, 'observer not fired on unspecified property');
});

(0, _emberMetalTestsProps_helper.testBoth)('addBeforeObserver should propagate through prototype', function (get, set) {
  var obj = { foo: 'foo', count: 0 };
  var obj2;

  (0, _emberMetalObserver.addBeforeObserver)(obj, 'foo', function () {
    this.count++;
  });
  obj2 = Object.create(obj);

  set(obj2, 'foo', 'bar');
  equal(obj2.count, 1, 'should have invoked observer on inherited');
  equal(obj.count, 0, 'should not have invoked observer on parent');

  obj2.count = 0;
  set(obj, 'foo', 'baz');
  equal(obj.count, 1, 'should have invoked observer on parent');
  equal(obj2.count, 0, 'should not have invoked observer on inherited');
});

(0, _emberMetalTestsProps_helper.testBoth)('addBeforeObserver should respect targets with methods', function (get, set) {
  var observed = { foo: 'foo' };

  var target1 = {
    count: 0,

    willChange: function willChange(obj, keyName) {
      var value = get(obj, keyName);
      equal(this, target1, 'should invoke with this');
      equal(obj, observed, 'param1 should be observed object');
      equal(keyName, 'foo', 'param2 should be keyName');
      equal(value, 'foo', 'param3 should old value');
      this.count++;
    }
  };

  var target2 = {
    count: 0,

    willChange: function willChange(obj, keyName) {
      var value = get(obj, keyName);
      equal(this, target2, 'should invoke with this');
      equal(obj, observed, 'param1 should be observed object');
      equal(keyName, 'foo', 'param2 should be keyName');
      equal(value, 'foo', 'param3 should old value');
      this.count++;
    }
  };

  (0, _emberMetalObserver.addBeforeObserver)(observed, 'foo', target1, 'willChange');
  (0, _emberMetalObserver.addBeforeObserver)(observed, 'foo', target2, target2.willChange);

  set(observed, 'foo', 'BAZ');
  equal(target1.count, 1, 'target1 observer should have fired');
  equal(target2.count, 1, 'target2 observer should have fired');
});

// ..........................................................
// CHAINED OBSERVERS
//

var obj, count, lookup;
var originalLookup = _emberMetalCore2['default'].lookup;

QUnit.module('addObserver - dependentkey with chained properties', {
  setup: function setup() {
    obj = {
      foo: {
        bar: {
          baz: {
            biff: 'BIFF'
          }
        }
      }
    };

    _emberMetalCore2['default'].lookup = lookup = {
      Global: {
        foo: {
          bar: {
            baz: {
              biff: 'BIFF'
            }
          }
        }
      }
    };

    count = 0;
  },

  teardown: function teardown() {
    obj = count = null;
    _emberMetalCore2['default'].lookup = originalLookup;
  }
});

(0, _emberMetalTestsProps_helper.testBoth)('depending on a chain with a computed property', function (get, set) {
  (0, _emberMetalProperties.defineProperty)(obj, 'computed', (0, _emberMetalComputed.computed)(function () {
    return { foo: 'bar' };
  }));

  var changed = 0;
  (0, _emberMetalObserver.addObserver)(obj, 'computed.foo', function () {
    changed++;
  });

  equal(undefined, (0, _emberMetalComputed.cacheFor)(obj, 'computed'), 'addObserver should not compute CP');

  set(obj, 'computed.foo', 'baz');

  equal(changed, 1, 'should fire observer');
});

(0, _emberMetalTestsProps_helper.testBoth)('depending on a simple chain', function (get, set) {

  var val;
  (0, _emberMetalObserver.addObserver)(obj, 'foo.bar.baz.biff', function (target, key) {
    val = get(target, key);
    count++;
  });

  set(get(obj, 'foo.bar.baz'), 'biff', 'BUZZ');
  equal(val, 'BUZZ');
  equal(count, 1);

  set(get(obj, 'foo.bar'), 'baz', { biff: 'BLARG' });
  equal(val, 'BLARG');
  equal(count, 2);

  set(get(obj, 'foo'), 'bar', { baz: { biff: 'BOOM' } });
  equal(val, 'BOOM');
  equal(count, 3);

  set(obj, 'foo', { bar: { baz: { biff: 'BLARG' } } });
  equal(val, 'BLARG');
  equal(count, 4);

  set(get(obj, 'foo.bar.baz'), 'biff', 'BUZZ');
  equal(val, 'BUZZ');
  equal(count, 5);

  var foo = get(obj, 'foo');

  set(obj, 'foo', 'BOO');
  equal(val, undefined);
  equal(count, 6);

  set(foo.bar.baz, 'biff', 'BOOM');
  equal(count, 6, 'should be not have invoked observer');
});

(0, _emberMetalTestsProps_helper.testBoth)('depending on a Global chain', function (get, set) {
  var Global = lookup.Global;
  var val;

  (0, _emberMetalObserver.addObserver)(obj, 'Global.foo.bar.baz.biff', function (target, key) {
    val = get(lookup, key);
    count++;
  });

  set(get(Global, 'foo.bar.baz'), 'biff', 'BUZZ');
  equal(val, 'BUZZ');
  equal(count, 1);

  set(get(Global, 'foo.bar'), 'baz', { biff: 'BLARG' });
  equal(val, 'BLARG');
  equal(count, 2);

  set(get(Global, 'foo'), 'bar', { baz: { biff: 'BOOM' } });
  equal(val, 'BOOM');
  equal(count, 3);

  set(Global, 'foo', { bar: { baz: { biff: 'BLARG' } } });
  equal(val, 'BLARG');
  equal(count, 4);

  set(get(Global, 'foo.bar.baz'), 'biff', 'BUZZ');
  equal(val, 'BUZZ');
  equal(count, 5);

  var foo = get(obj, 'foo');

  set(Global, 'foo', 'BOO');
  equal(val, undefined);
  equal(count, 6);

  set(foo.bar.baz, 'biff', 'BOOM');
  equal(count, 6, 'should be not have invoked observer');
});

QUnit.module('removeBeforeObserver');

// ..........................................................
// SETTING IDENTICAL VALUES
//

QUnit.module('props/observer_test - setting identical values');

(0, _emberMetalTestsProps_helper.testBoth)('setting simple prop should not trigger', function (get, set) {

  var obj = { foo: 'bar' };
  var count = 0;

  (0, _emberMetalObserver.addObserver)(obj, 'foo', function () {
    count++;
  });

  set(obj, 'foo', 'bar');
  equal(count, 0, 'should not trigger observer');

  set(obj, 'foo', 'baz');
  equal(count, 1, 'should trigger observer');

  set(obj, 'foo', 'baz');
  equal(count, 1, 'should not trigger observer again');
});

// The issue here is when a computed property is directly set with a value, then has a
// dependent key change (which triggers a cache expiration and recomputation), observers will
// not be fired if the CP setter is called with the last set value.
(0, _emberMetalTestsProps_helper.testBoth)('setting a cached computed property whose value has changed should trigger', function (_get, set) {
  var obj = {};

  (0, _emberMetalProperties.defineProperty)(obj, 'foo', (0, _emberMetalComputed.computed)({
    get: function get() {
      return _get(this, 'baz');
    },
    set: function set(key, value) {
      return value;
    }
  }).property('baz'));

  var count = 0;

  (0, _emberMetalObserver.addObserver)(obj, 'foo', function () {
    count++;
  });

  set(obj, 'foo', 'bar');
  equal(count, 1);
  equal(_get(obj, 'foo'), 'bar');

  set(obj, 'baz', 'qux');
  equal(count, 2);
  equal(_get(obj, 'foo'), 'qux');

  _get(obj, 'foo');
  set(obj, 'foo', 'bar');
  equal(count, 3);
  equal(_get(obj, 'foo'), 'bar');
});

QUnit.module('Ember.immediateObserver (Deprecated)');

(0, _emberMetalTestsProps_helper.testBoth)('immediate observers should fire synchronously', function (get, set) {
  expectDeprecation(/Usage of `Ember.immediateObserver` is deprecated, use `Ember.observer` instead./);
  var obj = {};
  var observerCalled = 0;
  var mixin;

  // explicitly create a run loop so we do not inadvertently
  // trigger deferred behavior
  (0, _emberMetalRun_loop2['default'])(function () {
    mixin = _emberMetalMixin.Mixin.create({
      fooDidChange: (0, _emberMetalMixin.immediateObserver)('foo', function () {
        observerCalled++;
        equal(get(this, 'foo'), 'barbaz', 'newly set value is immediately available');
      })
    });

    mixin.apply(obj);

    (0, _emberMetalProperties.defineProperty)(obj, 'foo', (0, _emberMetalComputed.computed)({
      get: function get() {
        return 'yes hello this is foo';
      },
      set: function set(key, value) {
        return value;
      }
    }));

    equal(get(obj, 'foo'), 'yes hello this is foo', 'precond - computed property returns a value');
    equal(observerCalled, 0, 'observer has not yet been called');

    set(obj, 'foo', 'barbaz');

    equal(observerCalled, 1, 'observer was called once');
  });
});

if (_emberMetalCore2['default'].EXTEND_PROTOTYPES) {
  (0, _emberMetalTestsProps_helper.testBoth)('immediate observers added declaratively via brace expansion fire synchronously', function (get, set) {
    var obj = {};
    var observerCalled = 0;
    var mixin;

    // explicitly create a run loop so we do not inadvertently
    // trigger deferred behavior
    (0, _emberMetalRun_loop2['default'])(function () {
      mixin = _emberMetalMixin.Mixin.create({
        fooDidChange: (function () {
          observerCalled++;
          equal(get(this, 'foo'), 'barbaz', 'newly set value is immediately available');
        }).observesImmediately('{foo,bar}')
      });

      mixin.apply(obj);

      (0, _emberMetalProperties.defineProperty)(obj, 'foo', (0, _emberMetalComputed.computed)({
        get: function get(key) {
          return 'yes hello this is foo';
        },
        set: function set(key, value) {
          return value;
        }
      }));

      equal(get(obj, 'foo'), 'yes hello this is foo', 'precond - computed property returns a value');
      equal(observerCalled, 0, 'observer has not yet been called');

      set(obj, 'foo', 'barbaz');

      equal(observerCalled, 1, 'observer was called once');
    });
  });
}

(0, _emberMetalTestsProps_helper.testBoth)('immediate observers watching multiple properties via brace expansion fire synchronously', function (get, set) {
  expectDeprecation(/Usage of `Ember.immediateObserver` is deprecated, use `Ember.observer` instead./);
  var obj = {};
  var observerCalled = 0;
  var mixin;

  // explicitly create a run loop so we do not inadvertently
  // trigger deferred behavior
  (0, _emberMetalRun_loop2['default'])(function () {
    mixin = _emberMetalMixin.Mixin.create({
      fooDidChange: (0, _emberMetalMixin.immediateObserver)('{foo,bar}', function () {
        observerCalled++;
        equal(get(this, 'foo'), 'barbaz', 'newly set value is immediately available');
      })
    });

    mixin.apply(obj);

    (0, _emberMetalProperties.defineProperty)(obj, 'foo', (0, _emberMetalComputed.computed)({
      get: function get() {
        return 'yes hello this is foo';
      },
      set: function set(key, value) {
        return value;
      }
    }));

    equal(get(obj, 'foo'), 'yes hello this is foo', 'precond - computed property returns a value');
    equal(observerCalled, 0, 'observer has not yet been called');

    set(obj, 'foo', 'barbaz');

    equal(observerCalled, 1, 'observer was called once');
  });
});

(0, _emberMetalTestsProps_helper.testBoth)('immediate observers are for internal properties only', function (get, set) {
  expectDeprecation(/Usage of `Ember.immediateObserver` is deprecated, use `Ember.observer` instead./);
  expectAssertion(function () {
    (0, _emberMetalMixin.immediateObserver)('foo.bar', function () {
      return this;
    });
  }, 'Immediate observers must observe internal properties only, not properties on other objects.');
});

QUnit.module('changeProperties');

(0, _emberMetalTestsProps_helper.testBoth)('observers added/removed during changeProperties should do the right thing.', function (get, set) {
  var obj = {
    foo: 0
  };
  function Observer() {
    this.willChangeCount = 0;
    this.didChangeCount = 0;
  }
  Observer.prototype = {
    add: function add() {
      (0, _emberMetalObserver.addBeforeObserver)(obj, 'foo', this, 'willChange');
      (0, _emberMetalObserver.addObserver)(obj, 'foo', this, 'didChange');
    },
    remove: function remove() {
      (0, _emberMetalObserver.removeBeforeObserver)(obj, 'foo', this, 'willChange');
      (0, _emberMetalObserver.removeObserver)(obj, 'foo', this, 'didChange');
    },
    willChange: function willChange() {
      this.willChangeCount++;
    },
    didChange: function didChange() {
      this.didChangeCount++;
    }
  };
  var addedBeforeFirstChangeObserver = new Observer();
  var addedAfterFirstChangeObserver = new Observer();
  var addedAfterLastChangeObserver = new Observer();
  var removedBeforeFirstChangeObserver = new Observer();
  var removedBeforeLastChangeObserver = new Observer();
  var removedAfterLastChangeObserver = new Observer();
  removedBeforeFirstChangeObserver.add();
  removedBeforeLastChangeObserver.add();
  removedAfterLastChangeObserver.add();
  (0, _emberMetalProperty_events.changeProperties)(function () {
    removedBeforeFirstChangeObserver.remove();
    addedBeforeFirstChangeObserver.add();

    set(obj, 'foo', 1);

    equal(addedBeforeFirstChangeObserver.willChangeCount, 1, 'addBeforeObserver called before the first change invoked immediately');
    equal(addedBeforeFirstChangeObserver.didChangeCount, 0, 'addObserver called before the first change is deferred');

    addedAfterFirstChangeObserver.add();
    removedBeforeLastChangeObserver.remove();

    set(obj, 'foo', 2);

    equal(addedAfterFirstChangeObserver.willChangeCount, 1, 'addBeforeObserver called after the first change invoked immediately');
    equal(addedAfterFirstChangeObserver.didChangeCount, 0, 'addObserver called after the first change is deferred');

    addedAfterLastChangeObserver.add();
    removedAfterLastChangeObserver.remove();
  });

  equal(removedBeforeFirstChangeObserver.willChangeCount, 0, 'removeBeforeObserver called before the first change sees none');
  equal(removedBeforeFirstChangeObserver.didChangeCount, 0, 'removeObserver called before the first change sees none');
  equal(addedBeforeFirstChangeObserver.willChangeCount, 1, 'addBeforeObserver called before the first change sees only 1');
  equal(addedBeforeFirstChangeObserver.didChangeCount, 1, 'addObserver called before the first change sees only 1');
  equal(addedAfterFirstChangeObserver.willChangeCount, 1, 'addBeforeObserver called after the first change sees 1');
  equal(addedAfterFirstChangeObserver.didChangeCount, 1, 'addObserver called after the first change sees 1');
  equal(addedAfterLastChangeObserver.willChangeCount, 0, 'addBeforeObserver called after the last change sees none');
  equal(addedAfterLastChangeObserver.didChangeCount, 0, 'addObserver called after the last change sees none');
  equal(removedBeforeLastChangeObserver.willChangeCount, 1, 'removeBeforeObserver called before the last change still sees 1');
  equal(removedBeforeLastChangeObserver.didChangeCount, 1, 'removeObserver called before the last change still sees 1');
  equal(removedAfterLastChangeObserver.willChangeCount, 1, 'removeBeforeObserver called after the last change still sees 1');
  equal(removedAfterLastChangeObserver.didChangeCount, 1, 'removeObserver called after the last change still sees 1');
});