'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

// Ember.imports

var _emberMetalError = require('ember-metal/error');

var _emberMetalError2 = _interopRequireDefault(_emberMetalError);

function K() {
  return this;
}

function consoleMethod(name) {
  var consoleObj, logToConsole;
  if (_emberMetalCore2['default'].imports.console) {
    consoleObj = _emberMetalCore2['default'].imports.console;
  } else if (typeof console !== 'undefined') {
    consoleObj = console;
  }

  var method = typeof consoleObj === 'object' ? consoleObj[name] : null;

  if (method) {
    // Older IE doesn't support bind, but Chrome needs it
    if (typeof method.bind === 'function') {
      logToConsole = method.bind(consoleObj);
      logToConsole.displayName = 'console.' + name;
      return logToConsole;
    } else if (typeof method.apply === 'function') {
      logToConsole = function () {
        method.apply(consoleObj, arguments);
      };
      logToConsole.displayName = 'console.' + name;
      return logToConsole;
    } else {
      return function () {
        var message = Array.prototype.join.call(arguments, ', ');
        method(message);
      };
    }
  }
}

function assertPolyfill(test, message) {
  if (!test) {
    try {
      // attempt to preserve the stack
      throw new _emberMetalError2['default']('assertion failed: ' + message);
    } catch (error) {
      setTimeout(function () {
        throw error;
      }, 0);
    }
  }
}

/**
  Inside Ember-Metal, simply uses the methods from `imports.console`.
  Override this to provide more robust logging functionality.

  @class Logger
  @namespace Ember
  @private
*/
exports['default'] = {
  /**
   Logs the arguments to the console.
   You can pass as many arguments as you want and they will be joined together with a space.
      ```javascript
    var foo = 1;
    Ember.Logger.log('log value of foo:', foo);
    // "log value of foo: 1" will be printed to the console
    ```
     @method log
   @for Ember.Logger
   @param {*} arguments
   @private
  */
  log: consoleMethod('log') || K,

  /**
   Prints the arguments to the console with a warning icon.
   You can pass as many arguments as you want and they will be joined together with a space.
      ```javascript
    Ember.Logger.warn('Something happened!');
    // "Something happened!" will be printed to the console with a warning icon.
    ```
     @method warn
   @for Ember.Logger
   @param {*} arguments
   @private
  */
  warn: consoleMethod('warn') || K,

  /**
   Prints the arguments to the console with an error icon, red text and a stack trace.
   You can pass as many arguments as you want and they will be joined together with a space.
      ```javascript
    Ember.Logger.error('Danger! Danger!');
    // "Danger! Danger!" will be printed to the console in red text.
    ```
     @method error
   @for Ember.Logger
   @param {*} arguments
   @private
  */
  error: consoleMethod('error') || K,

  /**
   Logs the arguments to the console.
   You can pass as many arguments as you want and they will be joined together with a space.
      ```javascript
    var foo = 1;
    Ember.Logger.info('log value of foo:', foo);
    // "log value of foo: 1" will be printed to the console
    ```
     @method info
   @for Ember.Logger
   @param {*} arguments
   @private
  */
  info: consoleMethod('info') || K,

  /**
   Logs the arguments to the console in blue text.
   You can pass as many arguments as you want and they will be joined together with a space.
      ```javascript
    var foo = 1;
    Ember.Logger.debug('log value of foo:', foo);
    // "log value of foo: 1" will be printed to the console
    ```
     @method debug
   @for Ember.Logger
   @param {*} arguments
   @private
  */
  debug: consoleMethod('debug') || consoleMethod('info') || K,

  /**
   If the value passed into `Ember.Logger.assert` is not truthy it will throw an error with a stack trace.
      ```javascript
    Ember.Logger.assert(true); // undefined
    Ember.Logger.assert(true === false); // Throws an Assertion failed error.
    ```
     @method assert
   @for Ember.Logger
   @param {Boolean} bool Value to test
   @private
  */
  assert: consoleMethod('assert') || assertPolyfill
};
module.exports = exports['default'];