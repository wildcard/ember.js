/**
  Returns true if the passed value is null or undefined. This avoids errors
  from JSLint complaining about use of ==, which can be technically
  confusing.

  ```javascript
  Ember.isNone();              // true
  Ember.isNone(null);          // true
  Ember.isNone(undefined);     // true
  Ember.isNone('');            // false
  Ember.isNone([]);            // false
  Ember.isNone(function() {});  // false
  ```

  @method isNone
  @for Ember
  @param {Object} obj Value to test
  @return {Boolean}
  @public
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isNone;

function isNone(obj) {
  return obj === null || obj === undefined;
}

module.exports = exports["default"];