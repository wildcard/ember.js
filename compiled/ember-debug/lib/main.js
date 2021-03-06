/*global __fail__*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports._warnIfUsingStrippedFeatureFlags = _warnIfUsingStrippedFeatureFlags;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberMetalError = require('ember-metal/error');

var _emberMetalError2 = _interopRequireDefault(_emberMetalError);

var _emberMetalLogger = require('ember-metal/logger');

var _emberMetalLogger2 = _interopRequireDefault(_emberMetalLogger);

var _emberDebugDeprecationManager = require('ember-debug/deprecation-manager');

var _emberDebugDeprecationManager2 = _interopRequireDefault(_emberDebugDeprecationManager);

var _emberMetalEnvironment = require('ember-metal/environment');

var _emberMetalEnvironment2 = _interopRequireDefault(_emberMetalEnvironment);

/**
@module ember
@submodule ember-debug
*/

/**
@class Ember
@public
*/

function isPlainFunction(test) {
  return typeof test === 'function' && test.PrototypeMixin === undefined;
}

/**
  Define an assertion that will throw an exception if the condition is not
  met. Ember build tools will remove any calls to `Ember.assert()` when
  doing a production build. Example:

  ```javascript
  // Test for truthiness
  Ember.assert('Must pass a valid object', obj);

  // Fail unconditionally
  Ember.assert('This code path should never be run');
  ```

  @method assert
  @param {String} desc A description of the assertion. This will become
    the text of the Error thrown if the assertion fails.
  @param {Boolean|Function} test Must be truthy for the assertion to pass. If
    falsy, an exception will be thrown. If this is a function, it will be executed and
    its return value will be used as condition.
  @public
*/
_emberMetalCore2['default'].assert = function (desc, test) {
  var throwAssertion;

  if (isPlainFunction(test)) {
    throwAssertion = !test();
  } else {
    throwAssertion = !test;
  }

  if (throwAssertion) {
    throw new _emberMetalError2['default']('Assertion Failed: ' + desc);
  }
};

/**
  Display a warning with the provided message. Ember build tools will
  remove any calls to `Ember.warn()` when doing a production build.

  @method warn
  @param {String} message A warning to display.
  @param {Boolean} test An optional boolean. If falsy, the warning
    will be displayed.
  @public
*/
_emberMetalCore2['default'].warn = function (message, test) {
  if (!test) {
    _emberMetalLogger2['default'].warn('WARNING: ' + message);
    if ('trace' in _emberMetalLogger2['default']) {
      _emberMetalLogger2['default'].trace();
    }
  }
};

/**
  Display a debug notice. Ember build tools will remove any calls to
  `Ember.debug()` when doing a production build.

  ```javascript
  Ember.debug('I\'m a debug notice!');
  ```

  @method debug
  @param {String} message A debug message to display.
  @public
*/
_emberMetalCore2['default'].debug = function (message) {
  _emberMetalLogger2['default'].debug('DEBUG: ' + message);
};

/**
  Display a deprecation warning with the provided message and a stack trace
  (Chrome and Firefox only). Ember build tools will remove any calls to
  `Ember.deprecate()` when doing a production build.

  @method deprecate
  @param {String} message A description of the deprecation.
  @param {Boolean|Function} test An optional boolean. If falsy, the deprecation
    will be displayed. If this is a function, it will be executed and its return
    value will be used as condition.
  @param {Object} options An optional object that can be used to pass
    in a `url` to the transition guide on the emberjs.com website, and a unique
    `id` for this deprecation. The `id` can be used by Ember debugging tools
    to change the behavior (raise, log or silence) for that specific deprecation.
    The `id` should be namespaced by dots, e.g. "view.helper.select".
  @public
*/
_emberMetalCore2['default'].deprecate = function (message, test, options) {
  if (_emberMetalCore2['default'].ENV.RAISE_ON_DEPRECATION) {
    _emberDebugDeprecationManager2['default'].setDefaultLevel(_emberDebugDeprecationManager.deprecationLevels.RAISE);
  }
  if (_emberDebugDeprecationManager2['default'].getLevel(options && options.id) === _emberDebugDeprecationManager.deprecationLevels.SILENCE) {
    return;
  }

  var noDeprecation;

  if (isPlainFunction(test)) {
    noDeprecation = test();
  } else {
    noDeprecation = test;
  }

  if (noDeprecation) {
    return;
  }

  if (options && options.id) {
    message = message + (' [deprecation id: ' + options.id + ']');
  }

  if (_emberDebugDeprecationManager2['default'].getLevel(options && options.id) === _emberDebugDeprecationManager.deprecationLevels.RAISE) {
    throw new _emberMetalError2['default'](message);
  }

  var error;

  // When using new Error, we can't do the arguments check for Chrome. Alternatives are welcome
  try {
    __fail__.fail();
  } catch (e) {
    error = e;
  }

  if (arguments.length === 3) {
    _emberMetalCore2['default'].assert('options argument to Ember.deprecate should be an object', options && typeof options === 'object');
    if (options.url) {
      message += ' See ' + options.url + ' for more details.';
    }
  }

  if (_emberMetalCore2['default'].LOG_STACKTRACE_ON_DEPRECATION && error.stack) {
    var stack;
    var stackStr = '';

    if (error['arguments']) {
      // Chrome
      stack = error.stack.replace(/^\s+at\s+/gm, '').replace(/^([^\(]+?)([\n$])/gm, '{anonymous}($1)$2').replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}($1)').split('\n');
      stack.shift();
    } else {
      // Firefox
      stack = error.stack.replace(/(?:\n@:0)?\s+$/m, '').replace(/^\(/gm, '{anonymous}(').split('\n');
    }

    stackStr = '\n    ' + stack.slice(2).join('\n    ');
    message = message + stackStr;
  }

  _emberMetalLogger2['default'].warn('DEPRECATION: ' + message);
};

/**
  Alias an old, deprecated method with its new counterpart.

  Display a deprecation warning with the provided message and a stack trace
  (Chrome and Firefox only) when the assigned method is called.

  Ember build tools will not remove calls to `Ember.deprecateFunc()`, though
  no warnings will be shown in production.

  ```javascript
  Ember.oldMethod = Ember.deprecateFunc('Please use the new, updated method', Ember.newMethod);
  ```

  @method deprecateFunc
  @param {String} message A description of the deprecation.
  @param {Function} func The new function called to replace its deprecated counterpart.
  @return {Function} a new function that wrapped the original function with a deprecation warning
  @private
*/
_emberMetalCore2['default'].deprecateFunc = function (message, func) {
  return function () {
    _emberMetalCore2['default'].deprecate(message);
    return func.apply(this, arguments);
  };
};

/**
  Run a function meant for debugging. Ember build tools will remove any calls to
  `Ember.runInDebug()` when doing a production build.

  ```javascript
  Ember.runInDebug(function() {
    Ember.Handlebars.EachView.reopen({
      didInsertElement: function() {
        console.log('I\'m happy');
      }
    });
  });
  ```

  @method runInDebug
  @param {Function} func The function to be executed.
  @since 1.5.0
  @public
*/
_emberMetalCore2['default'].runInDebug = function (func) {
  func();
};

/**
  Will call `Ember.warn()` if ENABLE_ALL_FEATURES, ENABLE_OPTIONAL_FEATURES, or
  any specific FEATURES flag is truthy.

  This method is called automatically in debug canary builds.

  @private
  @method _warnIfUsingStrippedFeatureFlags
  @return {void}
*/

function _warnIfUsingStrippedFeatureFlags(FEATURES, featuresWereStripped) {
  if (featuresWereStripped) {
    _emberMetalCore2['default'].warn('Ember.ENV.ENABLE_ALL_FEATURES is only available in canary builds.', !_emberMetalCore2['default'].ENV.ENABLE_ALL_FEATURES);
    _emberMetalCore2['default'].warn('Ember.ENV.ENABLE_OPTIONAL_FEATURES is only available in canary builds.', !_emberMetalCore2['default'].ENV.ENABLE_OPTIONAL_FEATURES);

    for (var key in FEATURES) {
      if (FEATURES.hasOwnProperty(key) && key !== 'isEnabled') {
        _emberMetalCore2['default'].warn('FEATURE["' + key + '"] is set as enabled, but FEATURE flags are only available in canary builds.', !FEATURES[key]);
      }
    }
  }
}

if (!_emberMetalCore2['default'].testing) {
  // Complain if they're using FEATURE flags in builds other than canary
  _emberMetalFeatures.FEATURES['features-stripped-test'] = true;
  var featuresWereStripped = true;

  if ((0, _emberMetalFeatures2['default'])('features-stripped-test')) {
    featuresWereStripped = false;
  }

  delete _emberMetalFeatures.FEATURES['features-stripped-test'];
  _warnIfUsingStrippedFeatureFlags(_emberMetalCore2['default'].ENV.FEATURES, featuresWereStripped);

  // Inform the developer about the Ember Inspector if not installed.
  var isFirefox = _emberMetalEnvironment2['default'].isFirefox;
  var isChrome = _emberMetalEnvironment2['default'].isChrome;

  if (typeof window !== 'undefined' && (isFirefox || isChrome) && window.addEventListener) {
    window.addEventListener('load', function () {
      if (document.documentElement && document.documentElement.dataset && !document.documentElement.dataset.emberExtension) {
        var downloadURL;

        if (isChrome) {
          downloadURL = 'https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi';
        } else if (isFirefox) {
          downloadURL = 'https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/';
        }

        _emberMetalCore2['default'].debug('For more advanced debugging, install the Ember Inspector from ' + downloadURL);
      }
    }, false);
  }
}

_emberMetalCore2['default'].Debug = {
  _addDeprecationLevel: function _addDeprecationLevel(id, level) {
    _emberDebugDeprecationManager2['default'].setLevel(id, level);
  },
  _deprecationLevels: _emberDebugDeprecationManager.deprecationLevels
};

/*
  We are transitioning away from `ember.js` to `ember.debug.js` to make
  it much clearer that it is only for local development purposes.

  This flag value is changed by the tooling (by a simple string replacement)
  so that if `ember.js` (which must be output for backwards compat reasons) is
  used a nice helpful warning message will be printed out.
*/
var runningNonEmberDebugJS = false;
exports.runningNonEmberDebugJS = runningNonEmberDebugJS;
if (runningNonEmberDebugJS) {
  _emberMetalCore2['default'].warn('Please use `ember.debug.js` instead of `ember.js` for development and debugging.');
}